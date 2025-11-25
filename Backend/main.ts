// import {
//   OpenAIModelProvider,
//   createZypherContext,
//   ZypherAgent,
// } from "@corespeed/zypher";
// import { eachValueFrom } from "rxjs-for-await";

// // Helper function to safely get environment variables
// function getRequiredEnv(name: string): string {
//   const value = Deno.env.get(name);
//   if (!value) {
//     throw new Error(`Environment variable ${name} is not set`);
//   }
//   return value;
// }

// // 创建自定义的 Firecrawl 工具函数（绕过 MCP schema 问题）
// async function firecrawlSearch(query: string): Promise<string> {
//   const apiKey = getRequiredEnv("FIRECRAWL_API_KEY");
  
//   try {
//     const response = await fetch("https://api.firecrawl.dev/v1/search", {
//       method: "POST",
//       headers: {
//         "Authorization": `Bearer ${apiKey}`,
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         query: query,
//         limit: 5
//       })
//     });
    
//     if (!response.ok) {
//       throw new Error(`Firecrawl API returned ${response.status}`);
//     }
    
//     const data = await response.json();
//     return JSON.stringify(data, null, 2);
//   } catch (error) {
//     console.error("Firecrawl search error:", error);
//     if (error instanceof Error) {
//       return `Error searching: ${error.message}`;
//     }
//     try {
//       return `Error searching: ${JSON.stringify(error)}`;
//     } catch {
//       return `Error searching: unknown error`;
//     }
//   }
// }

// async function main() {
//   // Initialize the agent execution context
//   const zypherContext = await createZypherContext("C:\\Users\\zhaot");

//   // Create the agent with OpenAI provider
//   const agent = new ZypherAgent(
//     zypherContext,
//     new OpenAIModelProvider({
//       apiKey: getRequiredEnv("OPENAI_API_KEY"),
//     }),
//   );

//   console.log("🔍 Step 1: Searching for AI news with Firecrawl...\n");
  
//   // 直接使用 Firecrawl API
//   const searchResults = await firecrawlSearch("latest AI news 2025");
//   console.log("✅ Search completed\n");
  
//   console.log("🤖 Step 2: Analyzing results with OpenAI agent...\n");
  
//   // 让 OpenAI agent 分析搜索结果（不通过 MCP，避免 schema 问题）
//   const event$ = agent.runTask(
//     `Analyze these search results and summarize the latest AI news:\n\n${searchResults}`,
//     "gpt-4-turbo-preview",
//   );

//   // Stream the results in real-time
//   for await (const event of eachValueFrom(event$)) {
//     console.log(event);
//   }
// }

// // 运行
// main().catch(console.error);