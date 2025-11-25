# AI Agent for Wikipedia Research

An intelligent Wikipedia research assistant powered by **Zypher AI Agent Framework**. Navigate Wikipedia articles through natural language commands and extract structured knowledge automatically.

## Overview

This project leverages the **Zypher Agent Framework** to create an intelligent research assistant specifically designed for Wikipedia. The Zypher agent interprets natural language commands, orchestrates complex research workflows, and coordinates between web scraping, data extraction, and AI analysis.

**Current Focus**: Wikipedia encyclopedia only
**AI Framework**: Zypher Agent with OpenAI GPT-4o-mini
**Future Vision**: Expandable to other knowledge bases and research platforms

## Why Zypher Agent?

### What is Zypher?

**Zypher** is an advanced AI agent framework that enables building intelligent, autonomous agents capable of:
- **Natural Language Understanding**: Interprets user intent from conversational input
- **Task Orchestration**: Breaks complex requests into executable steps
- **Tool Integration**: Seamlessly coordinates multiple tools and APIs
- **Context Management**: Maintains conversation and task context
- **Adaptive Execution**: Adjusts strategy based on results

### Zypher in This Project

Our implementation uses `ZypherAgent` as the core intelligence layer:

```typescript
import { ZypherAgent, OpenAIModelProvider } from "@corespeed/zypher";

// Create agent with OpenAI backend
const agent = new ZypherAgent(context, provider);

// Agent interprets and executes commands
agent.runTask("search quantum computing", "gpt-4o-mini");
```

### Agent Capabilities

The Zypher agent in this project:

1. **Command Interpretation**
   - Understands variations: "open", "search", "navigate to"
   - Handles multilingual input (English/Chinese)
   - Extracts entities and intent from natural language

2. **Task Execution**
   - Coordinates Wikipedia navigation
   - Triggers data extraction pipelines
   - Manages AI analysis workflows
   - Handles error recovery

3. **Context Awareness**
   - Remembers current article
   - Tracks research session
   - Maintains extraction state
   - Links related commands

4. **Tool Orchestration**
   - Wikipedia API calls
   - HTML parsing (Cheerio)
   - OpenAI GPT analysis
   - WebSocket communication

### Agent Architecture

```
User Command
     ↓
┌─────────────────────────────────┐
│     Zypher Agent (Core)         │
│                                 │
│  1. Parse Intent                │
│  2. Plan Execution              │
│  3. Coordinate Tools            │
│  4. Return Results              │
└─────────────────────────────────┘
     ↓           ↓           ↓
   ┌──────┐  ┌──────┐  ┌──────┐
   │ Wiki │  │Parse │  │  AI  │
   │ API  │  │Tool  │  │ LLM  │
   └──────┘  └──────┘  └──────┘
```

### Example Agent Workflow

When you type: **"search quantum computing and extract key concepts"**

1. **Zypher Agent receives command**
   - Parses: intent=search + extract, topic=quantum computing
   
2. **Plans execution strategy**
   - Step 1: Search Wikipedia
   - Step 2: Navigate to article
   - Step 3: Extract section titles
   - Step 4: AI analysis for key concepts

3. **Executes with tools**
   - Calls Wikipedia search API
   - Triggers HTML parser
   - Invokes GPT for analysis

4. **Returns structured result**
   - Article URL
   - Section structure
   - Key concepts list

### Why Not Just GPT?

Direct GPT API vs. Zypher Agent:

| Feature | Direct GPT | Zypher Agent |
|---------|------------|--------------|
| Tool use | Manual integration | Built-in orchestration |
| Context | Single conversation | Multi-session memory |
| Planning | Prompt engineering | Automatic decomposition |
| Error handling | Manual retry | Intelligent recovery |
| Extensibility | Hard-coded | Plugin architecture |

### Agent Configuration

Current agent setup:

```typescript
const context = await createZypherContext(Deno.cwd());
const provider = new OpenAIModelProvider({
  apiKey: process.env.OPENAI_API_KEY
});

const agent = new ZypherAgent(context, provider);

// Agent automatically handles:
// - Command parsing
// - Tool selection
// - Execution planning
// - Result formatting
```

### Custom Tools Registration

The agent can be extended with custom tools:

```typescript
// Future: Register custom Wikipedia tools
agent.registerTool({
  name: "wikipedia_citation",
  description: "Extract citations in specific format",
  handler: extractCitations
});

// Agent will automatically use when appropriate
agent.runTask("get citations in APA format");
```

### Benefits for Research

Using Zypher Agent provides:

1. **Intelligent Routing**: Agent decides which extraction method to use
2. **Adaptive Behavior**: Adjusts strategy based on article type
3. **Error Recovery**: Retries with different approaches on failure
4. **Context Retention**: Remembers previous research steps
5. **Extensibility**: Easy to add new research capabilities

## Features

- **Natural Language Wikipedia Navigation**: Command the system using plain English or Chinese
- **Smart Article Discovery**: Search and navigate Wikipedia articles automatically
- **Knowledge Extraction**: Extract titles, links, references, and content from Wikipedia articles
- **AI-Powered Analysis**: Use GPT to intelligently analyze and summarize Wikipedia content
- **Real-time Research Interface**: Wikipedia viewer on the left, AI assistant on the right
- **Structured Data Output**: Get organized, structured information from articles

## Prerequisites

- **Deno** (v1.37 or higher) - Modern JavaScript/TypeScript runtime
- **Node.js** (v18 or higher) - For frontend development
- **npm** or **yarn** - Package manager
- **OpenAI API Key** - Required for Zypher Agent's AI capabilities

### About Zypher Agent Framework

This project uses the **Zypher Agent Framework** (`@corespeed/zypher`), which requires:
- Valid OpenAI API key
- Deno runtime with network permissions
- Understanding of agent-based architectures (optional, but helpful)

The Zypher framework handles:
- Intent parsing from natural language
- Multi-step task planning
- Tool coordination and execution
- Context management across sessions

## Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd <project-directory>
```

### 2. Install Dependencies

#### Backend (Deno)
Deno will automatically download dependencies on first run.

#### Frontend (React)
```bash
npm install
```

### 3. Set Environment Variable

Set your OpenAI API key:

**Windows:**
```cmd
set OPENAI_API_KEY=your-api-key-here
```

**Mac/Linux:**
```bash
export OPENAI_API_KEY=your-api-key-here
```

Or create a `.env` file:
```
OPENAI_API_KEY=your-api-key-here
```

## Project Structure

```
project/
├── backend/
│   ├── agent.ts              # Main agent with extraction features
│   ├── ws_server.ts          # WebSocket server
│   └── .env                  # Environment variables (create this)
├── frontend/
│   ├── src/
│   │   ├── App.tsx           # Main application layout
│   │   ├── BrowserView.tsx   # Browser display component
│   │   └── ChatPanel.tsx     # AI chat interface
│   └── package.json
└── README.md
```

## Running the Project

### Step 1: Start the Backend Agent

Open a terminal in the backend directory:

```bash
deno run --allow-all agent.ts
```

You should see:
```
Initializing Zypher agent...
Context created
Provider created
Zypher agent ready
Starting WebSocket server...
Granted net access to "0.0.0.0:8788"
System ready, waiting for commands...
```

**Important**: Keep this terminal running.

### Step 2: Start the Frontend

Open a **new terminal** in the frontend directory:

```bash
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Step 3: Open in Browser

Navigate to: `http://localhost:5173`

You should see:
- Left side: Browser view (showing Wikipedia by default)
- Right side: AI chat panel

## How Zypher Agent Processes Commands

### Example 1: Simple Navigation

**User Input:** `"search quantum computing"`

**Zypher Agent Processing:**
```typescript
// 1. Agent receives command
agent.runTask("search quantum computing", "gpt-4o-mini");

// 2. Zypher interprets intent
Intent: SEARCH_WIKIPEDIA
Entity: "quantum computing"
Action: Navigate to article

// 3. Agent executes
navigateToWikipedia("quantum computing");
broadcastToFrontend({ type: "browser_navigate", url: "..." });

// 4. Returns confirmation
"Opening Wikipedia article about quantum computing"
```

### Example 2: Complex Extraction

**User Input:** `"extract all section titles and analyze the structure"`

**Zypher Agent Processing:**
```typescript
// 1. Agent parses multi-step request
agent.runTask("extract all section titles and analyze the structure");

// 2. Zypher plans execution
Step 1: Extract section titles (Cheerio tool)
Step 2: Analyze structure (GPT tool)
Step 3: Format results

// 3. Sequential execution
const titles = await extractTitles(currentPage);
const analysis = await analyzeStructure(titles);

// 4. Returns structured result
{
  titles: ["Introduction", "History", "Applications"],
  analysis: "This article follows a chronological structure..."
}
```

### Example 3: Intelligent Fallback

**User Input:** `"tell me about this topic"` (ambiguous)

**Zypher Agent Processing:**
```typescript
// 1. Agent recognizes ambiguity
agent.runTask("tell me about this topic");

// 2. Zypher uses context
CurrentContext: {
  article: "Quantum Computing",
  lastAction: "navigation"
}

// 3. Agent resolves intent
Resolved: Analyze current article about "Quantum Computing"

// 4. Executes appropriate tool
await analyzeWithAI(currentPageContent);
```

## Agent Code Structure

### Backend (agent.ts)

```typescript
// Initialize Zypher Agent
const context = await createZypherContext(Deno.cwd());
const provider = new OpenAIModelProvider({ apiKey });
const agent = new ZypherAgent(context, provider);

// Main task handler
export function runTask(task: string) {
  // Detect command type
  if (isNavigationCommand(task)) {
    handleNavigation(task);
  } else if (isExtractionCommand(task)) {
    handleExtraction(task);
  } else {
    // Let Zypher agent handle complex/ambiguous commands
    const events = agent.runTask(task, "gpt-4o-mini");
    
    events.subscribe({
      next(event) {
        broadcast(JSON.stringify(event));
      },
      complete() {
        broadcast({ type: "complete" });
      }
    });
  }
}
```

### Agent Event Streaming

The Zypher agent returns an observable stream of events:

```typescript
agent.runTask(userCommand).subscribe({
  // Agent thinking/planning
  next(event) {
    if (event.type === "text") {
      // Agent's reasoning steps
      console.log(event.content);
    }
  },
  
  // Task completed
  complete() {
    console.log("Agent finished execution");
  },
  
  // Error handling
  error(err) {
    console.error("Agent encountered error:", err);
  }
});
```

### Wikipedia Navigation

In the AI chat panel, type:

```
open python
```
(Opens Wikipedia article about Python)

```
search quantum computing
```
(Searches Wikipedia for quantum computing)

```
open Machine Learning
```
(Opens the Machine Learning Wikipedia article)

### Knowledge Extraction

After opening an article, extract structured information:

```
extract all titles from the page
```
(Gets all section headings from the article)

```
extract links from the page
```
(Gets all internal Wikipedia links)

```
extract references from the page
```
(Gets bibliography and citation information)

```
extract key paragraphs from the page
```
(Extracts main content sections)

### AI-Powered Analysis

```
intelligently analyze this article
```
(AI summarizes the main concepts)

```
analyze the structure of this article
```
(AI describes how information is organized)

```
extract key facts about this topic
```
(AI identifies and lists important facts)

## Supported Commands

### Navigation Commands
- `open <topic>` - Open Wikipedia article about a topic
- `search <query>` - Search Wikipedia for a query
- `go to <article>` - Navigate to a specific Wikipedia article

### Knowledge Extraction Commands
- `extract titles` - Extract all section headings
- `extract links` - Extract all internal links
- `extract references` - Extract bibliography and citations
- `extract paragraphs` - Extract main content
- `extract tables` - Extract data tables
- `extract infobox` - Extract article infobox data

### Analysis Commands
- `intelligently analyze` - AI-powered article analysis
- `summarize this article` - Get article summary
- `extract key facts` - Identify important information
- `analyze structure` - Understand article organization

## Architecture

```
┌─────────────────┬─────────────────┐
│  Wikipedia      │   AI Research   │
│  Viewer         │   Assistant     │
│  (React)        │   (React)       │
│                 │                 │
│  Displays:      │  User inputs    │
│  - Articles     │  research       │
│  - Extracted    │  commands       │
│    knowledge    │                 │
└────────┬────────┴────────┬────────┘
         │                 │
         │   WebSocket     │
         │   (Port 8788)   │
         │                 │
    ┌────┴─────────────────┴────┐
    │   Zypher Agent Core        │
    │   ═══════════════════      │
    │   Intent Recognition       │
    │   Task Planning            │
    │   Tool Orchestration       │
    │   ───────────────────      │
    │                            │
    │   Integrated Tools:        │
    │   ├─ Wikipedia Navigator   │
    │   ├─ Content Extractor     │
    │   │   (Cheerio Parser)     │
    │   ├─ AI Analyzer           │
    │   │   (OpenAI GPT-4o-mini) │
    │   └─ Data Structurer       │
    └────────────────────────────┘
```

### Component Roles

1. **Zypher Agent (Brain)**
   - Central intelligence coordinator
   - Interprets natural language
   - Plans execution strategy
   - Manages tool lifecycle

2. **Wikipedia Navigator**
   - Search and article discovery
   - URL construction
   - Link following

3. **Content Extractor**
   - HTML parsing with Cheerio
   - Section identification
   - Reference extraction
   - Structured data output

4. **AI Analyzer**
   - Summarization
   - Key concept extraction
   - Content understanding
   - Question answering

5. **WebSocket Layer**
   - Real-time communication
   - Streaming responses
   - Event broadcasting

## Configuration

### Change Default Homepage

Edit `src/BrowserView.tsx`:

```typescript
const [url, setUrl] = useState("https://your-site.com");
```

### Change AI Model

Edit `agent.ts`:

```typescript
const events = agent.runTask(task, "gpt-4o");  // Change model here
```

### Change WebSocket Port

Edit `ws_server.ts`:

```typescript
Deno.serve({ port: 8788 }, (req) => {  // Change port here
```

And update frontend connection in `BrowserView.tsx` and `ChatPanel.tsx`:

```typescript
const ws = new WebSocket("ws://127.0.0.1:8788");  // Update port
```

## Troubleshooting

### Issue: "OPENAI_API_KEY environment variable is not set"

**Solution**: Set the environment variable before running the agent:

```bash
export OPENAI_API_KEY=your-key-here
deno run --allow-all agent.ts
```

### Issue: "Address already in use" (Port 8788)

**Solution**: Kill the process using the port:

**Windows:**
```cmd
netstat -ano | findstr :8788
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -ti:8788 | xargs kill -9
```

### Issue: Browser shows "Failed to connect"

**Solution**: 
1. Ensure the backend agent is running
2. Check that no firewall is blocking port 8788
3. Verify WebSocket connection in browser console

### Issue: Webpage doesn't load in iframe

**Cause**: Some websites block iframe embedding (X-Frame-Options)

**Solution**: 
- Use websites that allow iframes (Wikipedia, GitHub, MDN, Stack Overflow)
- Google, Facebook, Twitter block iframes and won't work

### Issue: Data extraction returns empty results

**Solution**:
1. Ensure you've opened a webpage first
2. Wait for the page to fully load
3. Try different extraction keywords

## Development

### Add New Extraction Features

Edit `agent.ts`, add to `extractCustomData()` function:

```typescript
if (lowerInstruction.includes("your-keyword")) {
  result.yourData = $('your-selector').map(/* ... */).get();
}
```

### Add New Frontend Components

1. Create component in `src/components/`
2. Import in `App.tsx`
3. Add to layout

### Debugging

Enable debug logs in browser console:

```typescript
// In BrowserView.tsx
console.log("Debug:", data);
```

Backend logs automatically print to terminal.

## Current Scope: Wikipedia Only

This system is currently designed exclusively for Wikipedia research:

### Why Wikipedia Only?

1. **Focused Use Case**: Optimized for academic and research workflows
2. **Reliable Structure**: Wikipedia's consistent formatting enables accurate extraction
3. **Open Access**: No authentication or paywalls to handle
4. **Rich Content**: Comprehensive knowledge base across all domains
5. **Stable Platform**: Consistent API and structure

### What Works

✅ All Wikipedia language versions (en.wikipedia.org, zh.wikipedia.org, etc.)
✅ Article navigation and search
✅ Knowledge extraction and structuring
✅ Cross-reference following
✅ AI-powered content analysis

## Future Expansion Directions

The architecture is designed to be extensible. Future versions could support:

### Phase 2: Academic Resources
- **arXiv.org** - Research paper repository
- **PubMed** - Medical research database
- **Google Scholar** - Academic search and citations
- **JSTOR** - Academic journal archive
- **ResearchGate** - Research publication platform

### Phase 3: Technical Documentation
- **MDN Web Docs** - Web development reference
- **Stack Overflow** - Programming Q&A
- **GitHub Documentation** - Code repositories and wikis
- **Read the Docs** - Software documentation
- **API Documentation Sites** - RESTful API references

### Phase 4: Knowledge Bases
- **Encyclopedia Britannica** - General encyclopedia
- **Scholarpedia** - Expert-reviewed articles
- **Stanford Encyclopedia of Philosophy** - Philosophy reference
- **Internet Archive** - Digital library
- **Open Library** - Book catalog

### Phase 5: News and Media
- **Reuters** - News articles
- **BBC News** - International news
- **The Guardian** - News and analysis
- **Nature News** - Scientific news
- **Science Daily** - Research news

### Phase 6: Specialized Databases
- **IMDb** - Film and TV database
- **MusicBrainz** - Music encyclopedia
- **GeoNames** - Geographic database
- **Wikidata** - Structured data repository
- **DBpedia** - Structured Wikipedia data

### Technical Expansion Requirements

To support additional platforms, the following enhancements would be needed:

1. **Authentication System**
   - OAuth integration
   - API key management
   - Session handling

2. **Enhanced Parsing**
   - Site-specific extractors
   - Dynamic content handling
   - JavaScript rendering

3. **Rate Limiting**
   - Request throttling
   - Queue management
   - Caching layer

4. **Data Normalization**
   - Cross-platform schemas
   - Unified data models
   - Format converters

5. **Browser Automation**
   - Playwright integration
   - Screenshot capture
   - Interactive elements

### Contributing

To add support for a new platform:

1. Create a new extractor module
2. Define extraction patterns
3. Add command handlers
4. Update documentation
5. Submit pull request

See `CONTRIBUTING.md` for detailed guidelines.

## Use Cases

### Current (Wikipedia-focused)

- **Academic Research**: Gather background information on topics
- **Student Learning**: Explore concepts with AI assistance
- **Content Creation**: Research for articles and presentations
- **Fact Checking**: Verify information from Wikipedia
- **Knowledge Management**: Build personal knowledge bases

### Future (Multi-platform)

- **Literature Review**: Aggregate research from multiple academic sources
- **Technical Learning**: Cross-reference documentation and tutorials
- **News Analysis**: Compare coverage across multiple outlets
- **Media Research**: Gather information from specialized databases
- **Competitive Intelligence**: Monitor industry developments

## Current Limitations

- **Wikipedia Only**: Currently supports Wikipedia encyclopedia exclusively
- **Language Support**: Optimized for English and Chinese Wikipedia
- **AI API Costs**: Analysis features consume OpenAI API credits
- **Extraction Depth**: Limited to visible content (no edit history or metadata)
- **Rate Limiting**: Subject to Wikipedia's rate limits for automated access

## Design Decisions

### Why iframe for Wikipedia?

- Wikipedia allows iframe embedding
- Provides visual context while researching
- Enables quick navigation and verification
- Maintains familiar Wikipedia interface

### Why Not Full Browser Automation?

For the Wikipedia-focused use case:
- iframe is sufficient and lightweight
- No need for complex interactions
- Faster and more resource-efficient
- Simpler deployment and maintenance

For future expansion to other platforms, Playwright integration is planned.

## Technologies Used

### AI Agent Framework
- **Zypher Agent Framework** ⭐ - Core AI orchestration layer
  - Natural language understanding
  - Task planning and execution
  - Tool coordination and management
  - Context and memory handling
  
- **OpenAI GPT-4o-mini** - Language model backend
  - Powers Zypher agent's reasoning
  - Content analysis and summarization
  - Question answering capabilities

### Core Technologies
- **Frontend**: React, TypeScript, Vite
- **Backend Runtime**: Deno (secure TypeScript runtime)
- **Web Scraping**: Cheerio (fast HTML parsing)
- **Communication**: WebSocket (real-time bidirectional)

### Wikipedia Integration
- **Wikipedia API**: Article search and metadata
- **MediaWiki Parser**: Content extraction
- **Wikitext Processing**: Formatted content handling
- **Cross-language Support**: Multi-wiki navigation

### Development Stack
- **TypeScript**: Type-safe development
- **Deno**: Modern JavaScript runtime with built-in tooling
- **React**: Component-based UI framework
- **Vite**: Fast build tool and dev server

### Future Technology Stack
- **Playwright**: Browser automation (Phase 5)
- **PostgreSQL**: Knowledge graph storage (Phase 4)
- **Redis**: Response caching (Phase 3)
- **Elasticsearch**: Full-text search across sources (Phase 3)
- **GraphQL**: Unified query API (Phase 4)

### Why This Stack?

**Zypher + Deno + TypeScript**:
- Type safety throughout the stack
- Modern async/await patterns
- Secure by default (Deno permissions)
- Easy AI agent development
- Excellent developer experience

## License

MIT

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review console logs (browser F12 and terminal)
3. Ensure all prerequisites are installed
4. Verify API key is set correctly

## Quick Start Summary

```bash
# Terminal 1 - Backend
export OPENAI_API_KEY=your-key
deno run --allow-all agent.ts

# Terminal 2 - Frontend  
npm run dev

# Browser
# Open http://localhost:5173
# Type: "open quantum computing"
# Type: "extract titles from the page"
# Type: "intelligently analyze this article"
```

## Research Workflow Example

1. **Discover**: `search artificial intelligence`
2. **Explore**: Navigate to relevant article
3. **Extract**: `extract all section titles`
4. **Analyze**: `intelligently analyze this article`
5. **Follow**: Click related links to continue research
6. **Summarize**: `extract key facts about AI`

## Wikipedia Research Tips

### Effective Commands

- Use specific topic names: `open Machine Learning` rather than `search ML`
- Extract before analyzing: Get structure first, then use AI
- Follow references: Extract links to explore related topics
- Use language prefixes: `open zh:人工智能` for Chinese articles

### Best Practices

1. Start with broad topics, narrow down based on extracted links
2. Extract section titles to understand article structure
3. Use AI analysis for complex technical articles
4. Save extracted data for future reference
5. Cross-reference multiple articles for comprehensive research

## Advanced Features

### Custom Selectors

For advanced users, you can modify extraction logic to target specific CSS selectors or XPath queries.

### API Integration

The system can be extended to integrate with other APIs for enhanced functionality.

### Batch Operations

Process multiple pages by extending the command parser to handle batch commands.

## Roadmap

### Version 1.0 (Current) - Wikipedia Foundation
- [x] Natural language Wikipedia navigation
- [x] Knowledge extraction from articles
- [x] AI-powered content analysis
- [x] Real-time research interface
- [x] Multi-language Wikipedia support

### Version 1.5 - Enhanced Wikipedia Features
- [ ] Wikipedia citation export (BibTeX, APA, MLA)
- [ ] Article version comparison
- [ ] Related articles suggestion
- [ ] Topic clustering and visualization
- [ ] Offline article caching

### Version 2.0 - Academic Expansion
- [ ] arXiv paper integration
- [ ] PubMed search and extraction
- [ ] Google Scholar citation tracking
- [ ] Cross-reference validation
- [ ] Bibliography management

### Version 3.0 - Technical Documentation
- [ ] MDN documentation support
- [ ] Stack Overflow integration
- [ ] GitHub repository exploration
- [ ] API documentation parsing
- [ ] Code example extraction

### Version 4.0 - Multi-Source Research
- [ ] Multiple knowledge base support
- [ ] Cross-platform search
- [ ] Unified data schema
- [ ] Advanced filtering and sorting
- [ ] Export to note-taking apps

### Version 5.0 - Advanced Automation
- [ ] Playwright browser automation
- [ ] JavaScript-heavy site support
- [ ] Screenshot and PDF export
- [ ] Automated testing workflows
- [ ] Browser extension version

## Contributors

Your team/name here

## Changelog

### v1.0.0
- Initial release
- Basic navigation and extraction
- AI analysis integration
- WebSocket communication
