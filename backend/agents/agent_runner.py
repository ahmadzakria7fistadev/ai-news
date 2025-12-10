"""
Agent Runner - Wrapper for running agents with session management
Using official openai-agents Runner
"""
from typing import Optional, Any
import uuid
from .base import Runner


class AgentRunner:
    """Wrapper for Runner to maintain compatibility with our agent structure"""
    
    def __init__(self):
        pass
    
    def create_session_id(self) -> str:
        """Create a new session ID"""
        return str(uuid.uuid4())
    
    async def run_async(
        self,
        agent: Any,
        query: str,
        session_id: Optional[str] = None
    ):
        """Run an agent asynchronously"""
        try:
            # Handle both agent objects with .agent attribute and direct Agent instances
            agent_instance = agent.agent if hasattr(agent, 'agent') else agent
            
            if agent_instance is None:
                raise ValueError("Agent instance is None")
            
            # Use official Runner.run for async execution
            result = await Runner.run(agent_instance, query)
            
            if result is None or not hasattr(result, 'final_output'):
                raise ValueError("Invalid result from Runner.run")
            
            # Create a result object with session_id for compatibility
            class Result:
                def __init__(self, final_output: str, session_id: str):
                    self.final_output = final_output
                    self.session_id = session_id
            
            return Result(
                final_output=result.final_output or "",
                session_id=session_id or self.create_session_id()
            )
        except Exception as e:
            import traceback
            error_details = traceback.format_exc()
            print(f"Error in AgentRunner.run_async: {e}\n{error_details}")
            raise Exception(f"Error running agent: {str(e)}")
    
    def run_sync(
        self,
        agent: Any,
        query: str,
        session_id: Optional[str] = None
    ):
        """Run an agent synchronously"""
        agent_instance = agent.agent if hasattr(agent, 'agent') else agent
        
        # Use official Runner.run_sync for sync execution
        result = Runner.run_sync(agent_instance, query)
        
        # Create a result object with session_id for compatibility
        class Result:
            def __init__(self, final_output: str, session_id: str):
                self.final_output = final_output
                self.session_id = session_id
        
        return Result(
            final_output=result.final_output,
            session_id=session_id or self.create_session_id()
        )

