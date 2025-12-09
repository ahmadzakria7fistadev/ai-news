"""
Multi-Agent Newsroom System - Coordinates multiple agents for news processing
"""
from .base import Agent
from .daily_news_collector_agent import DailyNewsCollectorAgent
from .news_summarizer_agent import NewsSummarizerAgent
from .news_research_agent import NewsResearchAgent
from .breaking_news_alert_agent import BreakingNewsAlertAgent


class MultiAgentNewsroomSystem:
    """Multi-Agent Newsroom System - Coordinates multiple agents for news processing"""
    
    def __init__(self):
        self.collector = DailyNewsCollectorAgent()
        self.summarizer = NewsSummarizerAgent()
        self.research = NewsResearchAgent()
        self.breaking = BreakingNewsAlertAgent()
        
        self.agent = Agent(
            name="Multi-Agent Newsroom System",
            instructions="""You are a Multi-Agent Newsroom System Coordinator. Your role is to:
1. Coordinate between different news agents (Collector, Summarizer, Research, Breaking)
2. Orchestrate workflows for news collection and processing
3. Hand off tasks to appropriate specialized agents
4. Aggregate results from multiple agents
5. Provide a unified newsroom output

Workflow:
1. Collector Agent → Fetches daily news
2. Summarizer Agent → Creates TLDR summaries
3. Research Agent → Deep dives on specific topics
4. Breaking News Agent → Alerts on urgent news

You coordinate these agents and provide a comprehensive newsroom report.
Ensure all content is appropriate, factual, and follows ethical guidelines. Reject any harmful, misleading, or inappropriate content."""
        )

