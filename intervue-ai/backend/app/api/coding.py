from fastapi import APIRouter, HTTPException, Depends
from app.schemas.coding import CodeExecutionRequest, CodeExecutionResponse, CodeSubmissionRequest
from app.services.code_executor import CodeExecutionEngine
from app.services.interview_service import InterviewService

router = APIRouter(prefix="/coding", tags=["Coding Sandbox"])

@router.post("/run", response_model=CodeExecutionResponse)
async def run_code(req: CodeExecutionRequest):
    """Execute code snippet in sandboxed engine and return output, errors, and test results"""
    try:
        res = await CodeExecutionEngine.execute_code(req)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Code execution error: {str(e)}")

@router.post("/submit")
async def submit_code(req: CodeSubmissionRequest):
    """Submit code solution for active interview session, run sandbox validation and trigger AI code evaluation"""
    try:
        exec_req = CodeExecutionRequest(code=req.code, language=req.language)
        exec_res = await CodeExecutionEngine.execute_code(exec_req)
        
        # Submit code to active session
        session_res = InterviewService.submit_answer(
            user_id="default_user",
            session_id=req.session_id,
            answer_text=f"Submitted {req.language} code solution.",
            code_snippet=req.code,
            code_language=req.language
        )
        
        return {
            "execution": exec_res,
            "session": session_res
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
