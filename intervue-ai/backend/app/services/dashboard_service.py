from app.schemas.user import DashboardSummaryResponse, InterviewSessionSummary, SkillScore

class DashboardService:
    @staticmethod
    def get_dashboard_summary(user_id: str, target_role: str) -> DashboardSummaryResponse:
        return DashboardSummaryResponse(
            readiness_score=86,
            interviews_completed=12,
            hours_practiced=8.5,
            target_role=target_role or "Full Stack Engineer",
            recent_sessions=[
                InterviewSessionSummary(
                    id="sess_01",
                    title="Frontend Systems & React Virtual DOM",
                    domain="Technical",
                    date="2026-08-10",
                    duration="32 mins",
                    score=88,
                    status="Completed"
                ),
                InterviewSessionSummary(
                    id="sess_02",
                    title="LRU Cache & Algorithmic Optimization",
                    domain="Coding",
                    date="2026-08-08",
                    duration="45 mins",
                    score=91,
                    status="Completed"
                ),
                InterviewSessionSummary(
                    id="sess_03",
                    title="STAR Method Leadership & Team Conflict",
                    domain="Behavioral",
                    date="2026-08-05",
                    duration="25 mins",
                    score=79,
                    status="Completed"
                ),
                InterviewSessionSummary(
                    id="sess_04",
                    title="Distributed Caching & Sharding Architecture",
                    domain="System Design",
                    date="2026-08-02",
                    duration="40 mins",
                    score=84,
                    status="Completed"
                )
            ],
            skills=[
                SkillScore(category="Technical Depth", score=88),
                SkillScore(category="Coding Efficiency", score=91),
                SkillScore(category="Communication Clarity", score=74),
                SkillScore(category="Problem Solving", score=86),
                SkillScore(category="System Architecture", score=82)
            ],
            recommended_topics=[
                "React 19 Concurrent Rendering & Suspense",
                "MongoDB Indexing & Aggregation Pipelines",
                "Distributed System Consensus (Raft/Paxos)",
                "STAR Technique: High-Pressure Incident Resolution"
            ]
        )
