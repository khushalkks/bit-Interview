from typing import List
from datetime import datetime
from app.schemas.recruiter import CandidateRankItem, RecruiterDashboardResponse
from app.services.interview_service import SESSIONS_DB
from app.services.auth_service import USERS_DB

class RecruiterService:
    @staticmethod
    def get_dashboard_summary() -> RecruiterDashboardResponse:
        leaderboard_items: List[CandidateRankItem] = []

        # Group completed interview metrics per candidate/user
        user_stats = {}
        for session_id, s in SESSIONS_DB.items():
            u_id = s.get("user_id", "user_1")
            summary = s.get("summary", {})
            if not summary:
                continue

            if u_id not in user_stats:
                user = USERS_DB.get(u_id, {})
                user_stats[u_id] = {
                    "user_id": u_id,
                    "candidate_name": user.get("name", f"Candidate {u_id[:5]}"),
                    "target_role": s.get("target_role", "Software Engineer"),
                    "track_title": s.get("track_title", "Technical Deep-Dive"),
                    "scores": [],
                    "tech_acc": [],
                    "prob_solv": [],
                    "comm": [],
                    "integrity": [],
                    "last_active": s.get("started_at", "Recently")
                }

            user_stats[u_id]["scores"].append(summary.get("overall_score", 75))
            user_stats[u_id]["tech_acc"].append(summary.get("technical_accuracy", 75))
            user_stats[u_id]["prob_solv"].append(summary.get("problem_solving", 75))
            user_stats[u_id]["comm"].append(summary.get("communication", 75))
            user_stats[u_id]["integrity"].append(summary.get("integrity_score", 100))

        # Include default benchmark mock candidates if database is early stage
        if not user_stats:
            mock_candidates = [
                {
                    "user_id": "usr_alex",
                    "candidate_name": "Alex Chen",
                    "target_role": "Senior Full Stack Engineer",
                    "track_title": "Technical Deep-Dive",
                    "overall_score": 94,
                    "technical_accuracy": 96,
                    "problem_solving": 93,
                    "communication": 95,
                    "integrity_score": 100,
                    "completed_sessions": 6,
                    "last_active": "2 hours ago"
                },
                {
                    "user_id": "usr_sarah",
                    "candidate_name": "Sarah Jenkins",
                    "target_role": "Backend Architect",
                    "track_title": "System Design & Architecture",
                    "overall_score": 91,
                    "technical_accuracy": 92,
                    "problem_solving": 90,
                    "communication": 92,
                    "integrity_score": 98,
                    "completed_sessions": 4,
                    "last_active": "5 hours ago"
                },
                {
                    "user_id": "usr_david",
                    "candidate_name": "David Kumar",
                    "target_role": "Lead Frontend Developer",
                    "track_title": "Coding Sandbox",
                    "overall_score": 87,
                    "technical_accuracy": 88,
                    "problem_solving": 86,
                    "communication": 89,
                    "integrity_score": 100,
                    "completed_sessions": 5,
                    "last_active": "1 day ago"
                },
                {
                    "user_id": "usr_priya",
                    "candidate_name": "Priya Sharma",
                    "target_role": "DevOps / SRE Lead",
                    "track_title": "Technical Deep-Dive",
                    "overall_score": 85,
                    "technical_accuracy": 86,
                    "problem_solving": 84,
                    "communication": 87,
                    "integrity_score": 95,
                    "completed_sessions": 3,
                    "last_active": "2 days ago"
                }
            ]
            for mc in mock_candidates:
                leaderboard_items.append(CandidateRankItem(**mc))
        else:
            for u_id, st in user_stats.items():
                avg_score = int(sum(st["scores"]) / len(st["scores"]))
                avg_tech = int(sum(st["tech_acc"]) / len(st["tech_acc"]))
                avg_prob = int(sum(st["prob_solv"]) / len(st["prob_solv"]))
                avg_comm = int(sum(st["comm"]) / len(st["comm"]))
                avg_integ = int(sum(st["integrity"]) / len(st["integrity"]))

                leaderboard_items.append(CandidateRankItem(
                    user_id=u_id,
                    candidate_name=st["candidate_name"],
                    target_role=st["target_role"],
                    track_title=st["track_title"],
                    overall_score=avg_score,
                    technical_accuracy=avg_tech,
                    problem_solving=avg_prob,
                    communication=avg_comm,
                    integrity_score=avg_integ,
                    completed_sessions=len(st["scores"]),
                    last_active=st["last_active"]
                ))

        # Sort leaderboard descending by overall score
        leaderboard_items.sort(key=lambda x: x.overall_score, reverse=True)

        total_cand = len(leaderboard_items)
        avg_score_val = int(sum(c.overall_score for c in leaderboard_items) / total_cand) if total_cand > 0 else 82
        top_performers = len([c for c in leaderboard_items if c.overall_score >= 85])

        recent_searches = [
            {"role": "Senior Full Stack Engineer", "company": "Stripe", "matches": "14 candidates"},
            {"role": "Backend System Architect", "company": "Vercel", "matches": "9 candidates"},
            {"role": "Frontend React Specialist", "company": "Linear", "matches": "21 candidates"}
        ]

        return RecruiterDashboardResponse(
            total_candidates_assessed=total_cand,
            avg_score=avg_score_val,
            top_performers_count=top_performers,
            active_job_roles=5,
            leaderboard=leaderboard_items,
            recent_jd_searches=recent_searches
        )
