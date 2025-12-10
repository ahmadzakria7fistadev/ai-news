"""
AI News Backend - FastAPI application with OpenAI Agents SDK
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel
from typing import Optional, List
import os
from dotenv import load_dotenv
from utils.helpers import generate_pdf_report, generate_voice_summary, generate_trend_graph

from agents import (
    SEOAgent,
    YouTubeAgent,
    ForbesAgent,
    WebSearchAgent,
    DailyNewsCollectorAgent,
    BreakingNewsAlertAgent,
    NewsResearchAgent,
    NewsSummarizerAgent,
    MultiAgentNewsroomSystem,
    UltimateAINewsAgent,
    LiveNewsAgent,
    AgentRunner
)

# Try to load environment variables (ignore errors if .env file has issues)
try:
    # Try to load from current directory
    load_dotenv('.env')
    # Also try default location
    load_dotenv()
except Exception:
    pass  # Environment variables may already be set

app = FastAPI(
    title="AI News API",
    description="AI News Backend with OpenAI Agents SDK",
    version="1.0.0"
)

# CORS middleware
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
environment = os.getenv("ENVIRONMENT", "development")

# Build allowed origins list
allowed_origins = [
    frontend_url,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# CORS Configuration - Allow all origins for production
# This ensures all Vercel preview and production domains work

# Check if we're in production (Vercel deployment)
is_production = os.getenv("ENVIRONMENT") == "production" or os.getenv("VERCEL") == "1"

if is_production:
    # Production: Allow all origins (Vercel uses different domains for previews)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Allow all origins in production
        allow_credentials=False,  # Must be False when using "*"
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        allow_headers=["*"],
        expose_headers=["*"],
        max_age=3600,
    )
else:
    # Development: Allow localhost and specific origins
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        allow_headers=["*"],
        expose_headers=["*"],
    )

# Request/Response models
class AgentRequest(BaseModel):
    query: str
    agent_type: str  # "seo", "youtube", "forbes", "web_search"
    session_id: Optional[str] = None

class AgentResponse(BaseModel):
    result: str
    session_id: str
    agent_type: str

class NewsRequest(BaseModel):
    query: str
    agents: Optional[List[str]] = None  # List of agents to use
    session_id: Optional[str] = None

class NewsResponse(BaseModel):
    results: dict
    session_id: str

class DailyNewsRequest(BaseModel):
    topics: Optional[List[str]] = None  # ["ai", "crypto", "politics", "health", "pakistan", "sports"]
    session_id: Optional[str] = None

class BreakingNewsRequest(BaseModel):
    query: Optional[str] = None
    session_id: Optional[str] = None

class ResearchRequest(BaseModel):
    topic: str  # e.g., "Pakistan economic crisis summary"
    session_id: Optional[str] = None

class SummarizeRequest(BaseModel):
    content: str
    summary_type: Optional[str] = "medium"  # "ultra-short", "short", "medium"
    session_id: Optional[str] = None

class NewsroomRequest(BaseModel):
    query: str
    session_id: Optional[str] = None

class UltimateNewsRequest(BaseModel):
    query: str
    features: Optional[List[str]] = None  # ["daily_collection", "summaries", "trends", "bilingual"]
    language: Optional[str] = "english"  # "english", "urdu", "bilingual"
    session_id: Optional[str] = None

class LiveNewsRequest(BaseModel):
    categories: Optional[List[str]] = None  # ["ai", "crypto", "politics", "health", "pakistan", "sports", "world"]
    session_id: Optional[str] = None

# Initialize all agents
seo_agent = SEOAgent()
youtube_agent = YouTubeAgent()
forbes_agent = ForbesAgent()
web_search_agent = WebSearchAgent()
daily_news_collector = DailyNewsCollectorAgent()
breaking_news_alert = BreakingNewsAlertAgent()
news_research = NewsResearchAgent()
news_summarizer = NewsSummarizerAgent()
multi_agent_newsroom = MultiAgentNewsroomSystem()
ultimate_ai_news = UltimateAINewsAgent()
live_news_agent = LiveNewsAgent()
agent_runner = AgentRunner()

@app.options("/{full_path:path}")
async def options_handler(full_path: str):
    """Handle OPTIONS requests for CORS preflight"""
    return JSONResponse(
        content={},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Credentials": "true",
        }
    )

@app.get("/")
async def root():
    return {"message": "AI News API", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/api/agent", response_model=AgentResponse)
async def run_agent(request: AgentRequest):
    """Run a specific agent"""
    try:
        agent_map = {
            "seo": seo_agent,
            "youtube": youtube_agent,
            "forbes": forbes_agent,
            "web_search": web_search_agent,
            "daily_news_collector": daily_news_collector,
            "breaking_news_alert": breaking_news_alert,
            "news_research": news_research,
            "news_summarizer": news_summarizer,
            "multi_agent_newsroom": multi_agent_newsroom,
            "ultimate_ai_news": ultimate_ai_news,
            "live_news": live_news_agent,
        }
        
        if request.agent_type not in agent_map:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid agent type. Must be one of: {list(agent_map.keys())}"
            )
        
        agent = agent_map[request.agent_type]
        result = await agent_runner.run_async(
            agent=agent,
            query=request.query,
            session_id=request.session_id
        )
        
        return AgentResponse(
            result=result.final_output,
            session_id=result.session_id,
            agent_type=request.agent_type
        )
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Error in run_agent: {error_details}")  # Log to console
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/api/news", response_model=NewsResponse)
async def get_news(request: NewsRequest):
    """Get news from multiple agents"""
    try:
        agents_to_use = request.agents or ["seo", "youtube", "forbes", "web_search"]
        results = {}
        
        agent_map = {
            "seo": seo_agent,
            "youtube": youtube_agent,
            "forbes": forbes_agent,
            "web_search": web_search_agent,
            "daily_news_collector": daily_news_collector,
            "breaking_news_alert": breaking_news_alert,
            "news_research": news_research,
            "news_summarizer": news_summarizer,
            "multi_agent_newsroom": multi_agent_newsroom,
            "ultimate_ai_news": ultimate_ai_news,
            "live_news": live_news_agent,
        }
        
        session_id = request.session_id or agent_runner.create_session_id()
        
        for agent_name in agents_to_use:
            if agent_name in agent_map:
                agent = agent_map[agent_name]
                result = await agent_runner.run_async(
                    agent=agent,
                    query=request.query,
                    session_id=session_id
                )
                results[agent_name] = result.final_output
        
        return NewsResponse(
            results=results,
            session_id=session_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/daily-news")
async def get_daily_news(request: DailyNewsRequest):
    """Get daily news collection on specified topics"""
    try:
        topics = request.topics or ["ai", "crypto", "politics", "health", "pakistan", "sports"]
        query = f"Collect today's news on these topics: {', '.join(topics)}"
        
        result = await agent_runner.run_async(
            agent=daily_news_collector,
            query=query,
            session_id=request.session_id
        )
        
        return {
            "result": result.final_output,
            "session_id": result.session_id,
            "topics": topics
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/breaking-news")
async def get_breaking_news(request: BreakingNewsRequest):
    """Get breaking news alerts"""
    try:
        query = request.query or "Check for breaking news and high-impact events"
        
        result = await agent_runner.run_async(
            agent=breaking_news_alert,
            query=query,
            session_id=request.session_id
        )
        
        return {
            "result": result.final_output,
            "session_id": result.session_id,
            "alert_type": "breaking_news"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/research")
async def research_topic(request: ResearchRequest):
    """Deep research on a specific topic"""
    try:
        result = await agent_runner.run_async(
            agent=news_research,
            query=f"Research this topic in detail: {request.topic}",
            session_id=request.session_id
        )
        
        return {
            "result": result.final_output,
            "session_id": result.session_id,
            "topic": request.topic
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/summarize")
async def summarize_news(request: SummarizeRequest):
    """Create TLDR summaries of news content"""
    try:
        query = f"Create a {request.summary_type} summary of this content:\n\n{request.content}"
        
        result = await agent_runner.run_async(
            agent=news_summarizer,
            query=query,
            session_id=request.session_id
        )
        
        return {
            "result": result.final_output,
            "session_id": result.session_id,
            "summary_type": request.summary_type
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/newsroom")
async def newsroom_system(request: NewsroomRequest):
    """Multi-agent newsroom system"""
    try:
        result = await agent_runner.run_async(
            agent=multi_agent_newsroom,
            query=request.query,
            session_id=request.session_id
        )
        
        return {
            "result": result.final_output,
            "session_id": result.session_id,
            "system": "multi_agent_newsroom"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ultimate-news")
async def ultimate_news_agent(request: UltimateNewsRequest):
    """Ultimate AI News Agent - All-in-One"""
    try:
        features = request.features or ["daily_collection", "summaries", "trends"]
        language_note = f" (Respond in {request.language})" if request.language != "english" else ""
        
        query = f"{request.query}\n\nUse features: {', '.join(features)}{language_note}"
        
        result = await agent_runner.run_async(
            agent=ultimate_ai_news,
            query=query,
            session_id=request.session_id
        )
        
        response_data = {
            "result": result.final_output,
            "session_id": result.session_id,
            "features": features,
            "language": request.language
        }
        
        # Generate PDF if requested
        if "pdf_report" in features:
            pdf_path = generate_pdf_report(result.final_output, title="AI News Report")
            response_data["pdf_path"] = pdf_path
        
        # Generate voice summary if requested
        if "voice_summary" in features:
            voice_path = generate_voice_summary(result.final_output, language=request.language)
            response_data["voice_path"] = voice_path
        
        # Generate trend graph if requested
        if "trend_graph" in features:
            # Example trend data - in production, this would come from actual analytics
            trend_data = {
                "dates": ["2024-01-01", "2024-01-02", "2024-01-03", "2024-01-04", "2024-01-05"],
                "values": [10, 15, 13, 17, 20]
            }
            graph_path = generate_trend_graph(trend_data)
            response_data["graph_path"] = graph_path
        
        return response_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/download-pdf/{filename}")
async def download_pdf(filename: str):
    """Download generated PDF file"""
    file_path = f"reports/{filename}"
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="application/pdf", filename=filename)
    raise HTTPException(status_code=404, detail="PDF file not found")

@app.get("/api/download-audio/{filename}")
async def download_audio(filename: str):
    """Download generated audio file"""
    file_path = f"audio/{filename}"
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="audio/mpeg", filename=filename)
    raise HTTPException(status_code=404, detail="Audio file not found")

@app.post("/api/live-news")
async def get_live_news(request: LiveNewsRequest):
    """Get live news updates in real-time - AI news only"""
    try:
        # Force AI category only - ignore other categories
        query = "Get the latest AI (Artificial Intelligence) related news updates from the web. Search for real AI news from sources like TechCrunch, The Verge, MIT Technology Review, Reuters Tech, and BBC Technology. Focus ONLY on: Machine Learning, Deep Learning, Neural Networks, AI Research, AI Companies, AI Tools, AI Ethics, AI Regulations, AI Breakthroughs, and AI Applications. Provide the news in the readable format as specified in your instructions. Include actual headlines, summaries, sources, URLs, and timestamps. Filter out any non-AI content. DO NOT mention JSON format - directly provide the news."
        
        result = await agent_runner.run_async(
            agent=live_news_agent,
            query=query,
            session_id=request.session_id
        )
        
        return {
            "result": result.final_output,
            "session_id": result.session_id,
            "categories": ["ai"],  # Always AI only
            "update_time": "live"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

