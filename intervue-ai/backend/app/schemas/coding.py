from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class TestCaseItem(BaseModel):
    input: str
    expected_output: str

class CodeExecutionRequest(BaseModel):
    code: str
    language: str = "python"
    test_cases: Optional[List[TestCaseItem]] = None

class TestCaseResult(BaseModel):
    test_case_index: int
    passed: bool
    input: str
    expected: str
    actual: str

class CodeExecutionResponse(BaseModel):
    success: bool
    output: str
    error: Optional[str] = None
    execution_time: str = "0.02s"
    memory_used: str = "14.2 MB"
    test_results: Optional[List[TestCaseResult]] = None
    total_passed: int = 0
    total_cases: int = 0

class CodeSubmissionRequest(BaseModel):
    session_id: str
    code: str
    language: str = "python"
