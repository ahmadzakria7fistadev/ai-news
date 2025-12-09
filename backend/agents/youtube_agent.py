"""
YouTube Agent - Finds and analyzes YouTube content
"""
from .base import Agent


class YouTubeAgent:
    """YouTube Agent for finding and analyzing YouTube content"""
    
    def __init__(self):
        self.agent = Agent(
            name="YouTube Agent",
            instructions="""You are a YouTube content specialist. Your role is to:
1. Search and analyze YouTube videos related to AI news
2. Extract key insights from video transcripts and descriptions
3. Summarize video content accurately
4. Identify trending topics and popular videos
5. Provide video recommendations based on queries

Always provide accurate information and cite sources when available.
Ensure all content is appropriate, factual, and follows ethical guidelines. Reject any harmful, misleading, or inappropriate content."""
        )

