// agent.ts - with data extraction feature
import {
  createZypherContext,
  ZypherAgent,
  OpenAIModelProvider,
} from "@corespeed/zypher";
import { startWSServer, broadcast } from "./ws_server.ts";
import * as cheerio from "npm:cheerio@1.0.0-rc.12";

let currentPageHtml: string = "";
let currentPageUrl: string = "";

// Extract page content
async function extractPageContent(url: string) {
  try {
    console.log("📥 Fetching page content:", url);
    const response = await fetch(url);
    const html = await response.text();
    
    currentPageHtml = html;
    currentPageUrl = url;
    
    const $ = cheerio.load(html);
    
    // Remove scripts and styles
    $('script, style, nav, footer, header').remove();
    
    // Extract main content
    const title = $('h1').first().text().trim() || $('title').text().trim();
    const content = $('main, article, .content, #content, body').first().text().trim();
    
    // Clean whitespace
    const cleanContent = content
      .replace(/\s+/g, ' ')
      .substring(0, 5000); // Length limit
    
    console.log("✅ Page content extracted");
    
    return {
      url,
      title,
      content: cleanContent,
      fullHtml: html
    };
  } catch (error) {
    console.error("❌ Failed to extract page content:", error);
    return null;
  }
}

// Custom extraction
async function extractCustomData(instruction: string) {
  if (!currentPageHtml || !currentPageUrl) {
    return {
      success: false,
      error: "Please open a webpage first"
    };
  }

  try {
    console.log("🔍 Starting custom extraction:", instruction);
    
    const $ = cheerio.load(currentPageHtml);
    
    let result: any = {};
    
    const lowerInstruction = instruction.toLowerCase();
    
    // Extract title
    if (lowerInstruction.includes("title")) {
      result.title = $('h1').first().text().trim();
      result.allHeadings = $('h1, h2, h3').map((_: any, el: any) => $(el).text().trim()).get();
    }
    
    // Extract links
    if (lowerInstruction.includes("link")) {
      result.links = $('a').map((_: any, el: any) => ({
        text: $(el).text().trim(),
        href: $(el).attr('href')
      })).get().slice(0, 20);
    }
    
    // Extract images
    if (lowerInstruction.includes("image")) {
      result.images = $('img').map((_: any, el: any) => ({
        alt: $(el).attr('alt'),
        src: $(el).attr('src')
      })).get().slice(0, 10);
    }
    
    // Extract tables
    if (lowerInstruction.includes("table")) {
      result.tables = $('table').map((_: any, table: any) => {
        const rows = $(table).find('tr').map((_: any, row: any) => {
          return $(row).find('td, th').map((_: any, cell: any) => $(cell).text().trim()).get();
        }).get();
        return rows;
      }).get();
    }
    
    // Extract paragraphs
    if (lowerInstruction.includes("paragraph") || 
        lowerInstruction.includes("content")) {
      result.paragraphs = $('p').map((_: any, el: any) => $(el).text().trim()).get()
        .filter((p: string) => p.length > 20)
        .slice(0, 10);
    }
    
    // Extract lists
    if (lowerInstruction.includes("list")) {
      result.lists = $('ul, ol').map((_: any, list: any) => {
        return $(list).find('li').map((_: any, li: any) => $(li).text().trim()).get();
      }).get().slice(0, 5);
    }
    
    // AI extraction
    if (Object.keys(result).length === 0 || lowerInstruction.includes("ai") || 
        lowerInstruction.includes("analyze")) {
      
      const pageContent = await extractPageContent(currentPageUrl);
      
      if (pageContent) {
        const aiResult = await analyzeWithAI(instruction, pageContent);
        result.aiAnalysis = aiResult;
      }
    }
    
    result.url = currentPageUrl;
    result.timestamp = new Date().toISOString();
    
    console.log("✅ Data extraction complete");
    
    return {
      success: true,
      data: result
    };
    
  } catch (error) {
    console.error("❌ Extraction failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// AI analysis
async function analyzeWithAI(instruction: string, pageContent: any) {
  try {
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      return "AI analysis unavailable: API Key not set";
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a webpage content analysis assistant. Extract useful information from provided webpage content based on user instructions. Return JSON."
          },
          {
            role: "user",
            content: `Page Title: ${pageContent.title}\nPage URL: ${pageContent.url}\n\nPage Content:\n${pageContent.content}\n\nUser Instruction: ${instruction}\n\nPlease return structured extracted information.`
          }
        ],
        max_tokens: 1000
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
    
  } catch (error) {
    console.error("AI analysis failed:", error);
    return "AI analysis failed";
  }
}

async function initAgent() {
  try {
    console.log("🔄 Initializing Zypher agent...");
    
    const context = await createZypherContext(Deno.cwd());
    console.log("✅ Context created");

    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      throw new Error("❌ OPENAI_API_KEY environment variable not set!");
    }

    const provider = new OpenAIModelProvider({ apiKey });
    console.log("✅ Provider created");

    const agent = new ZypherAgent(context, provider);
    console.log("✅ Zypher agent ready");

    return agent;
  } catch (error) {
    console.error("❌ Failed to initialize agent:", error);
    throw error;
  }
}

const agent = await initAgent();

export function runTask(task: string) {
  console.log("🚀 Task received:", task);

  broadcast(JSON.stringify({
    type: "message",
    message: {
      role: "assistant",
      content: [{ type: "text", text: `Command received: ${task}` }]
    }
  }));

  const lowerTask = task.toLowerCase();
  
  // Data extraction commands
  if (lowerTask.includes("extract") ||
      lowerTask.includes("analyze page")) {
    
    extractCustomData(task)
      .then(result => {
        if (result.success) {
          broadcast(JSON.stringify({
            type: "extraction_result",
            data: result.data
          }));
          
          broadcast(JSON.stringify({
            type: "message",
            message: {
              role: "assistant",
              content: [{ 
                type: "text", 
                text: `✅ Data extraction completed!\n\n${JSON.stringify(result.data, null, 2)}` 
              }]
            }
          }));
        } else {
          broadcast(JSON.stringify({
            type: "message",
            message: {
              role: "assistant",
              content: [{ type: "text", text: `❌ Extraction failed: ${result.error}` }]
            }
          }));
        }
        
        broadcast(JSON.stringify({ type: "complete" }));
      })
      .catch(error => {
        console.error("Extraction error:", error);
        broadcast(JSON.stringify({
          type: "error",
          error: error instanceof Error ? error.message : String(error)
        }));
      });
    
    return;
  }
  
  // Browser commands
  const patterns = [
    /(?:open|visit|search|go to|navigate)\s*([a-zA-Z0-9.-]+(?:\.[a-zA-Z]{2,})?)/i,
    /(?:open|visit)\s*([^\s]+)/i,
  ];

  for (const pattern of patterns) {
    const match = task.match(pattern);
    if (match) {
      let url = match[1];
      
      if (!url.startsWith("http")) {
        if (url.includes(".")) {
          url = "https://" + url;
        } else {
          url = `https://wikipedia.org/wiki/${encodeURIComponent(url)}`;
        }
      }
      
      console.log("🎯 Parsed URL:", url);
      
      extractPageContent(url).catch(err => {
        console.error("Page extraction failed:", err);
      });
      
      broadcast(JSON.stringify({
        type: "browser_navigate",
        url: url
      }));
      
      broadcast(JSON.stringify({
        type: "message",
        message: {
          role: "assistant",
          content: [{ type: "text", text: `✅ Opening ${url}\n\n💡 Tip: After the page loads, you can say:\n- "extract titles"\n- "extract links"\n- "extract images"\n- "analyze this page"` }]
        }
      }));
      
      broadcast(JSON.stringify({ type: "complete" }));
      
      return;
    }
  }

  // Default Zypher agent tasks
  try {
    const events = agent.runTask(task, "gpt-4o-mini");

    events.subscribe({
      next(event) {
        console.log("📤 Agent event:", event);
        broadcast(JSON.stringify(event));
      },
      error(err) {
        console.error("❌ Agent error:", err);
        broadcast(JSON.stringify({
          type: "error",
          error: err instanceof Error ? err.message : String(err)
        }));
      },
      complete() {
        console.log("✅ Task completed");
        broadcast(JSON.stringify({ type: "complete" }));
      },
    });
  } catch (error) {
    console.error("❌ Execution failed:", error);
    broadcast(JSON.stringify({
      type: "error",
      error: error instanceof Error ? error.message : String(error)
    }));
  }
}

console.log("🚀 Starting WebSocket server...");
startWSServer(runTask);
console.log("✅ System ready, waiting for commands...");
console.log("💡 Supported features:");
console.log("   1. Open webpage: open wikipedia.org");
console.log("   2. Extract data: extract titles");
console.log("   3. AI analysis: analyze this page");
