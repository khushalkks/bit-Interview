import uuid
import re
from datetime import datetime
from typing import Dict, List
from app.schemas.recruiter import JDAnalysisResponse

# In-memory store for analyzed Job Descriptions
JD_STORE: Dict[str, dict] = {}

TECH_KEYWORDS = [
    "Python", "JavaScript", "TypeScript", "React", "Node.js", "FastAPI", "Django", "Flask",
    "PostgreSQL", "MongoDB", "Redis", "Docker", "Kubernetes", "AWS", "GCP", "Azure",
    "GraphQL", "REST API", "Microservices", "Kafka", "Elasticsearch", "CI/CD", "Git",
    "System Design", "Distributed Systems", "SQL", "NoSQL", "TailwindCSS", "Next.js"
]

class JDService:
    @staticmethod
    def analyze_jd(jd_text: str, target_role: str = "Software Engineer", company_name: str = "Target Company") -> JDAnalysisResponse:
        analysis_id = f"jd_{uuid.uuid4().hex[:8]}"
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # Extract technical skills present in text
        extracted_skills = []
        for kw in TECH_KEYWORDS:
            if re.search(rf"\b{re.escape(kw)}\b", jd_text, re.IGNORECASE):
                extracted_skills.append(kw)

        if not extracted_skills:
            extracted_skills = ["Software Architecture", "API Design", "Data Structures", "Problem Solving"]

        # Determine experience level
        text_lower = jd_text.lower()
        if "lead" in text_lower or "principal" in text_lower or "staff" in text_lower:
            exp_level = "Staff / Lead Engineer (7+ yrs)"
            rec_track = "system_design"
        elif "senior" in text_lower or "5+" in text_lower or "6+" in text_lower:
            exp_level = "Senior Engineer (4-6 yrs)"
            rec_track = "technical"
        elif "junior" in text_lower or "entry" in text_lower or "intern" in text_lower:
            exp_level = "Junior / Associate Engineer (0-2 yrs)"
            rec_track = "coding"
        else:
            exp_level = "Mid-Level Engineer (2-4 yrs)"
            rec_track = "technical"

        # Generate key focus areas
        key_focus_areas = [
            f"Production fluency with {', '.join(extracted_skills[:3])}",
            "Distributed systems scaling & caching optimization",
            "Clean code principles, unit testing & CI/CD automation"
        ]

        # Generate custom tailored questions
        top_tech = extracted_skills[0] if extracted_skills else "system design"
        questions = [
            f"How would you design a high-throughput microservice in {top_tech} that gracefully handles database connection pooling and failovers?",
            f"Walk me through a complex production bug you solved involving {extracted_skills[1] if len(extracted_skills) > 1 else 'distributed state'}, and how you prevented regression.",
            f"Given the requirements in this {company_name} JD, what architecture trade-offs would you prioritize for latency vs eventual consistency?"
        ]

        # Calculate JD readiness/match score baseline
        match_score = min(96, max(68, 72 + len(extracted_skills) * 3))

        response = JDAnalysisResponse(
            id=analysis_id,
            target_role=target_role,
            company_name=company_name,
            match_score=match_score,
            experience_level=exp_level,
            extracted_skills=extracted_skills,
            key_focus_areas=key_focus_areas,
            suggested_interview_questions=questions,
            recommended_track=rec_track,
            created_at=now
        )

        JD_STORE[analysis_id] = response.dict()
        return response

    @staticmethod
    def get_analysis(analysis_id: str) -> JDAnalysisResponse:
        data = JD_STORE.get(analysis_id)
        if not data:
            raise ValueError("JD Analysis record not found.")
        return JDAnalysisResponse(**data)
