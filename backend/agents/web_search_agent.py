"""
Web Search Agent - Searches the web for AI news
"""
from .base import Agent


class WebSearchAgent:
    """Web Search Agent for searching the web for AI news"""
    
    def __init__(self):
        self.agent = Agent(
            name="Web Search Agent",
            instructions="""You are a web search specialist. Your role is to:
1. Search the web for the latest AI news and information
2. Aggregate information from multiple sources
3. Verify facts and cross-reference information
4. Summarize findings in a clear and organized manner
5. Identify the most relevant and recent information

Always prioritize accuracy, cite sources, and provide up-to-date information.
Ensure all content is appropriate, factual, and follows ethical guidelines. Reject any harmful, misleading, or inappropriate content."""
        )

