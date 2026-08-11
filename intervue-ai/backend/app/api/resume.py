from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, status
from app.schemas.resume import ResumeProfileResponse
from app.services.resume_service import ResumeService
from app.api.auth import get_current_user

router = APIRouter(prefix="/resume", tags=["Resume Intelligence"])

@router.post("/upload", response_model=ResumeProfileResponse, status_code=status.HTTP_201_CREATED)
async def upload_resume(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files (.pdf) are currently supported for resume parsing."
        )

    try:
        content = await file.read()
        extracted_text = ResumeService.extract_text_from_pdf_bytes(content)
        profile_data = ResumeService.parse_resume_text(extracted_text, file_name=file.filename)
        ResumeService.save_user_resume(current_user["id"], profile_data)
        return profile_data
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to process resume: {str(e)}")

@router.get("/me", response_model=ResumeProfileResponse)
def get_my_resume(current_user: dict = Depends(get_current_user)):
    resume = ResumeService.get_user_resume(current_user["id"])
    if not resume:
        # Fallback to default demo profile if none uploaded yet
        demo_text = f"Resume of {current_user['name']}. Skills: React, Python, FastAPI, MongoDB, Data Structures."
        demo_profile = ResumeService.parse_resume_text(demo_text, file_name="Khushal_Resume.pdf")
        return demo_profile
    return resume

@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_my_resume(current_user: dict = Depends(get_current_user)):
    ResumeService.delete_user_resume(current_user["id"])
    return None
