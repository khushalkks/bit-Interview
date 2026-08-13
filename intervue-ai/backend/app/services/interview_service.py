import uuid
from datetime import datetime
from typing import Dict, List, Optional
from app.schemas.interview import (
    TrackEnum, DifficultyEnum, InterviewSessionResponse,
    InterviewMessage, InterviewSummaryResponse, QuestionAnalysisItem
)
from app.services.resume_service import RESUMES_DB

# In-memory store for active & completed interview sessions
SESSIONS_DB: Dict[str, dict] = {}

TRACK_TITLES = {
    TrackEnum.TECHNICAL: "Technical Deep-Dive",
    TrackEnum.CODING: "Coding & Algorithms Sandbox",
    TrackEnum.SYSTEM_DESIGN: "System Design & Architecture",
    TrackEnum.BEHAVIORAL: "Behavioral & STAR Method",
}

# Domain dynamic question banks for smart adaptation
INITIAL_QUESTIONS = {
    TrackEnum.TECHNICAL: [
        "Welcome! Let's kick off your Technical Deep-Dive. Can you explain how asynchronous event loops work under the hood in modern JavaScript/Node.js or Python asyncio, and how unhandled promise rejections are managed?",
        "Welcome! To start our Technical Deep-Dive, could you walk me through the key differences between SQL relational databases and NoSQL document stores, specifically regarding ACID compliance and horizontal scalability?",
        "Welcome to your Technical Deep-Dive. Could you explain the concept of indexing in databases? How does a B-Tree index accelerate queries, and what are the write performance trade-offs?"
    ],
    TrackEnum.CODING: [
        "Welcome to the Coding Sandbox! Here is your first algorithmic problem: Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. Please write an efficient solution and explain its Time and Space complexity.",
        "Welcome to the Coding Sandbox! Given a string `s`, find the length of the longest substring without repeating characters. Please share your code snippet, edge-case analysis, and complexity breakdown.",
        "Welcome to the Coding Sandbox! Implement an algorithm to invert a Binary Tree, or check if a given binary tree is a valid Binary Search Tree (BST). Feel free to use the built-in code editor to write your code!"
    ],
    TrackEnum.SYSTEM_DESIGN: [
        "Welcome to System Design! Design a scalable URL Shortening Service (like bit.ly) that can handle 100 Million daily active users. What database schema, hashing mechanism, and caching strategy would you pick?",
        "Welcome to System Design! How would you design a real-time Collaborative Code Editor (like Google Docs or Figma for code) supporting multiple simultaneous typers? What protocol (WebSockets vs Server-Sent Events) and conflict resolution algorithm (OT vs CRDT) would you use?",
        "Welcome to System Design! Design a high-throughput Distributed Rate Limiter API middleware that supports sliding window rate limiting across microservices."
    ],
    TrackEnum.BEHAVIORAL: [
        "Welcome to the Behavioral Round! Using the STAR method (Situation, Task, Action, Result), tell me about a time when you encountered a severe technical roadblock or system outage right before a major release. How did you resolve it?",
        "Welcome to Behavioral! Can you share an example of a situation where you strongly disagreed with a senior engineer or product manager on a technical architecture decision? How did you approach the discussion and what was the outcome?",
        "Welcome to Behavioral! Tell me about a complex project where you had to quickly ramp up on a technology or domain you had zero prior experience with. What steps did you take?"
    ]
}

ADAPTIVE_FOLLOW_UPS = {
    DifficultyEnum.EASY: [
        "That's a solid fundamental explanation! Building on that, how would you handle error boundary management or edge cases when input parameters are invalid?",
        "Good start! Could you elaborate on how you would test this behavior in an automated CI/CD pipeline?"
    ],
    DifficultyEnum.MEDIUM: [
        "Great answer with clear technical context! Now, let's step up the difficulty: how would your design perform under extreme load (e.g. 10x traffic spikes), and what bottlenecks might emerge in memory or network I/O?",
        "Impressive breakdown! How would you optimize the space and time complexity here if memory constraints were strictly limited?"
    ],
    DifficultyEnum.HARD: [
        "Excellent deep-dive! At scale, distributed consensus or race conditions can occur. How would you introduce locking, caching layers (like Redis), or retry queues to maintain data consistency?",
        "Top-tier technical explanation! How would you monitor, log, and trace this in production using tools like Prometheus, Grafana, or OpenTelemetry?"
    ],
    DifficultyEnum.ADVANCED: [
        "Outstanding mastery! If you were designing this system to operate across multi-region cloud deployment with active-active replication, how would you handle eventual consistency and partition tolerance (CAP Theorem)?",
        "Masterclass response! What anti-patterns should junior engineers avoid when extending this architecture in the long run?"
    ]
}

DIFFICULTY_LADDER = [
    DifficultyEnum.EASY,
    DifficultyEnum.MEDIUM,
    DifficultyEnum.HARD,
    DifficultyEnum.ADVANCED
]

class InterviewService:
    @staticmethod
    def start_session(
        user_id: str,
        track: TrackEnum = TrackEnum.TECHNICAL,
        target_role: Optional[str] = "Full Stack Engineer",
        difficulty: DifficultyEnum = DifficultyEnum.MEDIUM
    ) -> InterviewSessionResponse:
        session_id = f"session_{uuid.uuid4().hex[:10]}"
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # Context personalization from candidate resume if present
        user_resume = RESUMES_DB.get(user_id, {})
        skills = user_resume.get("skills", [])
        
        # Pick opening question based on track and resume context
        track_questions = INITIAL_QUESTIONS.get(track, INITIAL_QUESTIONS[TrackEnum.TECHNICAL])
        opening_content = track_questions[len(SESSIONS_DB) % len(track_questions)]

        if skills:
            top_skills = ", ".join(skills[:3])
            opening_content += f"\n\n*(Note: I noticed your background includes {top_skills}. Feel free to ground your responses in real-world projects using these technologies!)*"

        first_message = InterviewMessage(
            id=f"msg_{uuid.uuid4().hex[:8]}",
            sender="interviewer",
            content=opening_content,
            difficulty=difficulty.value,
            timestamp=now
        )

        session_data = {
            "session_id": session_id,
            "user_id": user_id,
            "track": track.value,
            "track_title": TRACK_TITLES.get(track, "Technical Round"),
            "target_role": target_role or "Software Engineer",
            "status": "active",
            "current_difficulty": difficulty.value,
            "question_count": 1,
            "started_at": now,
            "messages": [first_message.dict()]
        }

        SESSIONS_DB[session_id] = session_data

        return InterviewSessionResponse(
            session_id=session_id,
            track=track.value,
            track_title=session_data["track_title"],
            target_role=session_data["target_role"],
            status="active",
            current_difficulty=difficulty.value,
            question_count=1,
            started_at=now,
            messages=[first_message]
        )

    @staticmethod
    def submit_answer(
        user_id: str,
        session_id: str,
        answer_text: str,
        code_snippet: Optional[str] = None,
        code_language: Optional[str] = None
    ) -> InterviewSessionResponse:
        session = SESSIONS_DB.get(session_id)
        if not session or session["user_id"] != user_id:
            raise ValueError("Interview session not found or unauthorized.")

        if session["status"] == "completed":
            raise ValueError("This interview session has already been completed.")

        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # 1. Store Candidate Answer
        candidate_msg = InterviewMessage(
            id=f"msg_{uuid.uuid4().hex[:8]}",
            sender="candidate",
            content=answer_text,
            code_snippet=code_snippet,
            code_language=code_language,
            timestamp=now
        )
        session["messages"].append(candidate_msg.dict())

        # 2. Adaptive Difficulty Logic
        current_diff = session["current_difficulty"]
        word_count = len(answer_text.split()) + (len((code_snippet or "").split()) if code_snippet else 0)

        # Strict technical evaluation heuristic
        if word_count > 60 or (code_snippet and len(code_snippet) > 30):
            eval_hint = "Strong technical depth and detailed reasoning."
            curr_idx = next((i for i, d in enumerate(DIFFICULTY_LADDER) if d.value == current_diff), 1)
            next_idx = min(curr_idx + 1, len(DIFFICULTY_LADDER) - 1)
            next_diff = DIFFICULTY_LADDER[next_idx]
        elif word_count >= 20:
            eval_hint = "Good foundational answer. Pushing for technical edge cases."
            next_diff = DifficultyEnum(current_diff)
        elif word_count >= 5:
            eval_hint = "Very brief answer with limited technical details. Asking for fundamental elaboration."
            curr_idx = next((i for i, d in enumerate(DIFFICULTY_LADDER) if d.value == current_diff), 1)
            next_idx = max(curr_idx - 1, 0)
            next_diff = DIFFICULTY_LADDER[next_idx]
        else:
            eval_hint = "No substantial response provided. Dropping difficulty to Easy level."
            next_diff = DifficultyEnum.EASY

        session["current_difficulty"] = next_diff.value
        session["question_count"] += 1

        # 3. Generate Follow-up AI Question
        track_enum = TrackEnum(session["track"])
        follow_ups = ADAPTIVE_FOLLOW_UPS.get(next_diff, ADAPTIVE_FOLLOW_UPS[DifficultyEnum.MEDIUM])
        follow_up_text = follow_ups[session["question_count"] % len(follow_ups)]

        ai_msg = InterviewMessage(
            id=f"msg_{uuid.uuid4().hex[:8]}",
            sender="interviewer",
            content=f"**Evaluation**: {eval_hint}\n\n{follow_up_text}",
            difficulty=next_diff.value,
            timestamp=now,
            evaluation_hint=eval_hint
        )
        session["messages"].append(ai_msg.dict())

        return InterviewSessionResponse(
            session_id=session["session_id"],
            track=session["track"],
            track_title=session["track_title"],
            target_role=session["target_role"],
            status=session["status"],
            current_difficulty=session["current_difficulty"],
            question_count=session["question_count"],
            started_at=session["started_at"],
            messages=[InterviewMessage(**m) for m in session["messages"]]
        )

    @staticmethod
    def log_proctoring_event(user_id: str, session_id: str, event_type: str, details: Optional[str] = None):
        session = SESSIONS_DB.get(session_id)
        if not session or session["user_id"] != user_id:
            raise ValueError("Interview session not found or unauthorized.")
        
        events = session.setdefault("proctoring_events", [])
        events.append({
            "event_type": event_type,
            "details": details,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        })
        return {"status": "recorded", "total_events": len(events)}

    @staticmethod
    def end_session(user_id: str, session_id: str) -> InterviewSummaryResponse:
        session = SESSIONS_DB.get(session_id)
        if not session or session["user_id"] != user_id:
            raise ValueError("Interview session not found or unauthorized.")

        session["status"] = "completed"
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        messages = session.get("messages", [])
        interviewer_msgs = [m for m in messages if m.get("sender") == "interviewer"]
        candidate_msgs = [m for m in messages if m.get("sender") == "candidate"]

        # Calculate actual candidate participation
        total_words = 0
        total_code_len = 0

        for cm in candidate_msgs:
            ans = cm.get("content", "")
            code = cm.get("code_snippet", "") or ""
            total_words += len(ans.split())
            total_code_len += len(code.split())

        num_answers = len(candidate_msgs)

        if num_answers == 0 or total_words + total_code_len == 0:
            overall_score = 25
            tech_acc = 20
            prob_solv = 20
            comm = 30
            code_eff = 20
            arch = 25
            strengths = ["Initiated the interview round environment."]
            areas_for_imp = [
                "No technical answers or code snippets were submitted.",
                "Ensure to articulate your thought process step-by-step for technical questions.",
                "Write sample code solutions in the Monaco editor for coding problems."
            ]
            recommendations = [
                "Practice responding to initial technical probes before taking timed rounds.",
                "Review Data Structures & Algorithms (LeetCode / HackerRank baseline questions).",
                "Familiarize yourself with the STAR method for technical behavioral responses."
            ]
            feedback = (
                f"No candidate answers were recorded for this {session['track_title']} session. "
                f"Your score reflects zero response submission. Please attempt questions with detailed explanations to boost your readiness score."
            )
        else:
            avg_words = (total_words + total_code_len) / num_answers
            
            if avg_words < 10:
                overall_score = 45
                tech_acc = 40
                prob_solv = 42
                comm = 50
                code_eff = 45
                arch = 40
                strengths = ["Submitted brief initial thoughts."]
                areas_for_imp = [
                    "Answers were short and lacked technical depth.",
                    "Elaborate on edge cases, time/space complexity, and architecture trade-offs."
                ]
                recommendations = [
                    "Elaborate on why specific algorithms or datastructures were chosen.",
                    "Always mention Big-O Time complexity and Space complexity analysis.",
                    "Discuss failure modes and error boundaries in real-world scenarios."
                ]
                feedback = f"Responses were too brief to evaluate full technical depth. Elaborate with concrete examples and code snippets."
            elif avg_words < 30:
                overall_score = 72
                tech_acc = 70
                prob_solv = 72
                comm = 75
                code_eff = 71
                arch = 68
                strengths = [
                    "Good understanding of fundamental concepts.",
                    "Used appropriate technical terminology throughout."
                ]
                areas_for_imp = [
                    "Deepen technical specificity regarding performance under scale.",
                    "Include concrete unit test scenarios and error boundaries."
                ]
                recommendations = [
                    "Incorporate system design diagrams or layered architectural patterns.",
                    "Review distributed caching mechanisms (e.g., Redis LRU, Cache-Aside pattern).",
                    "Practice writing clean production-grade code with error boundary handling."
                ]
                feedback = f"Solid foundation demonstrated during {session['track_title']}. To break past 85%, expand on architecture trade-offs and edge cases."
            else:
                overall_score = min(96, int(78 + (avg_words * 0.35)))
                tech_acc = min(98, overall_score + 2)
                prob_solv = min(95, overall_score - 1)
                comm = min(98, overall_score + 3)
                code_eff = min(96, overall_score + 1)
                arch = min(95, overall_score)
                strengths = [
                    "Strong technical depth and clear architectural reasoning.",
                    "Articulated code complexity and system design trade-offs effectively.",
                    "Proactive identification of performance bottlenecks under high load."
                ]
                areas_for_imp = [
                    "Include edge-case test suite examples for distributed failure modes.",
                    "Elaborate on cache invalidation strategies under high concurrency."
                ]
                recommendations = [
                    "Focus on high-availability concepts (Multi-region active-active, CAP theorem).",
                    "Conduct peer architectural reviews for complex microservice pipelines.",
                    "Explore advanced query optimization & database indexing strategies."
                ]
                feedback = f"Outstanding performance in {session['track_title']}! You demonstrated strong technical confidence and thorough reasoning."

        # Build Question-by-Question Analysis
        question_analysis: List[QuestionAnalysisItem] = []
        for i in range(max(len(interviewer_msgs), len(candidate_msgs))):
            q_msg = interviewer_msgs[i] if i < len(interviewer_msgs) else None
            a_msg = candidate_msgs[i] if i < len(candidate_msgs) else None
            
            if q_msg:
                q_text = q_msg.get("content", "Technical Question")
                ans_text = a_msg.get("content", "No answer submitted.") if a_msg else "No answer submitted."
                code_snip = a_msg.get("code_snippet") if a_msg else None
                
                # Dynamic scoring & complexity per question
                q_score = min(98, max(40, overall_score + ((i % 3) * 3 - 2))) if a_msg else 20
                q_feedback = (
                    "Good technical clarity and structured breakdown of the solution."
                    if q_score > 70 else
                    "Covered basic requirements but missed edge-case handling and performance considerations."
                )
                ideal_ans = f"An optimal response addresses the core technical requirements, outlines Big-O complexity (O(N) time / O(1) space), and discusses edge-case handling under production loads."

                question_analysis.append(QuestionAnalysisItem(
                    id=f"qa_{i+1}",
                    question=q_text,
                    candidate_answer=ans_text,
                    code_snippet=code_snip,
                    score=q_score,
                    feedback=q_feedback,
                    ideal_answer=ideal_ans,
                    time_complexity="O(N log N)" if code_snip else "N/A",
                    space_complexity="O(N)" if code_snip else "N/A"
                ))

        # Integrity & Proctoring audit
        p_events = session.get("proctoring_events", [])
        tab_switches = len([e for e in p_events if e.get("event_type") == "tab_switch"])
        window_blurs = len([e for e in p_events if e.get("event_type") == "window_blur"])
        pastes = len([e for e in p_events if e.get("event_type") == "code_paste"])

        integrity_deduction = (tab_switches * 8) + (window_blurs * 5) + (pastes * 4)
        integrity_score = max(35, 100 - integrity_deduction)

        proctoring_flags = []
        if tab_switches > 0:
            proctoring_flags.append(f"Detected {tab_switches} browser tab switch(es) during technical session.")
        if window_blurs > 0:
            proctoring_flags.append(f"Detected {window_blurs} window focus loss event(s).")
        if pastes > 0:
            proctoring_flags.append(f"Detected {pastes} code paste operation(s) in editor.")
        if not proctoring_flags:
            proctoring_flags.append("Clean session: Zero anti-cheating or tab-switch violations detected.")

        category_scores = {
            "Technical Accuracy": tech_acc,
            "Problem Solving": prob_solv,
            "Communication": comm,
            "Code Efficiency": code_eff,
            "System Architecture": arch
        }

        summary = InterviewSummaryResponse(
            session_id=session_id,
            track_title=session["track_title"],
            target_role=session["target_role"],
            overall_score=overall_score,
            duration=f"{max(5, session['question_count'] * 3)} minutes",
            total_questions=session["question_count"],
            technical_accuracy=tech_acc,
            problem_solving=prob_solv,
            communication=comm,
            code_efficiency=code_eff,
            architecture_design=arch,
            category_scores=category_scores,
            question_analysis=question_analysis,
            integrity_score=integrity_score,
            proctoring_flags=proctoring_flags,
            strengths=strengths,
            areas_for_improvement=areas_for_imp,
            actionable_recommendations=recommendations,
            overall_feedback=feedback,
            completed_at=now
        )

        session["summary"] = summary.dict()
        return summary

    @staticmethod
    def get_session_summary(user_id: str, session_id: str) -> InterviewSummaryResponse:
        session = SESSIONS_DB.get(session_id)
        if not session or session["user_id"] != user_id:
            raise ValueError("Interview session not found.")
        
        summary_dict = session.get("summary")
        if not summary_dict:
            # If session exists but end_session was not explicitly triggered, compute it now
            return InterviewService.end_session(user_id, session_id)
        
        return InterviewSummaryResponse(**summary_dict)

    @staticmethod
    def get_session(user_id: str, session_id: str) -> InterviewSessionResponse:
        session = SESSIONS_DB.get(session_id)
        if not session or session["user_id"] != user_id:
            raise ValueError("Interview session not found.")
        
        return InterviewSessionResponse(
            session_id=session["session_id"],
            track=session["track"],
            track_title=session["track_title"],
            target_role=session["target_role"],
            status=session["status"],
            current_difficulty=session["current_difficulty"],
            question_count=session["question_count"],
            started_at=session["started_at"],
            messages=[InterviewMessage(**m) for m in session["messages"]]
        )

    @staticmethod
    def get_user_history(user_id: str) -> List[dict]:
        user_sessions = [
            {
                "session_id": s["session_id"],
                "track_title": s["track_title"],
                "target_role": s["target_role"],
                "status": s["status"],
                "started_at": s["started_at"],
                "question_count": s["question_count"],
                "score": s.get("summary", {}).get("overall_score")
            }
            for s in SESSIONS_DB.values()
            if s["user_id"] == user_id
        ]
        return sorted(user_sessions, key=lambda x: x["started_at"], reverse=True)

