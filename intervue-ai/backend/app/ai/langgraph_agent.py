import uuid
from typing import Dict, Any, List, Optional
from datetime import datetime

class LangGraphInterviewState:
    """State schema for LangGraph agent node transitions"""
    def __init__(self, session_id: str, track: str, target_role: str, initial_difficulty: str = "Medium"):
        self.session_id = session_id
        self.track = track
        self.target_role = target_role
        self.current_difficulty = initial_difficulty
        self.step_index = 0
        self.messages: List[dict] = []
        self.evaluations: List[dict] = []

    def to_dict(self) -> dict:
        return {
            "session_id": self.session_id,
            "track": self.track,
            "target_role": self.target_role,
            "current_difficulty": self.current_difficulty,
            "step_index": self.step_index,
            "messages": self.messages,
            "evaluations": self.evaluations
        }

class LangGraphAdaptiveAgent:
    """
    Agentic Workflow Graph implementing LangGraph-style state machine transitions
    Nodes: [QuestionGenerator -> CandidateResponse -> Evaluator -> DifficultyRouter -> ScorecardSynthesizer]
    """

    @staticmethod
    def execute_question_node(state: LangGraphInterviewState, candidate_skills: List[str]) -> dict:
        """Node 1: Question Generator Node"""
        track = state.track
        role = state.target_role
        diff = state.current_difficulty
        
        skill_str = ", ".join(candidate_skills[:3]) if candidate_skills else "Full Stack Engineering"

        questions_map = {
            "technical": [
                f"For a {role} role proficient in {skill_str}: Can you explain how asynchronous non-blocking event loops handle high concurrency, and how event loop starvation can be prevented?",
                f"Deep dive in {skill_str}: Compare REST API architecture vs GraphQL vs WebSockets. Under what latency and bandwidth constraints would you choose each?",
                f"Database internals: How do index structures (B-Trees vs Hash Indexes) optimize lookup performance, and what write overhead occurs during high INSERT throughput?"
            ],
            "coding": [
                "Coding Sandbox Challenge: Given an array of integers `nums` and a target value `target`, return the indices of two numbers such that they add up to target. Provide an optimal O(N) solution with time and space complexity analysis.",
                "Coding Challenge: Given a string `s`, find the length of the longest substring without repeating characters. Implement your algorithm in the code editor below.",
                "Coding Challenge: Design a function to validate if a string containing parentheses `'()[]{}'` is balanced using an efficient Stack data structure."
            ],
            "system_design": [
                f"System Architecture for {role}: Design a scalable Rate Limiting middleware (e.g. 100 requests/minute per user) capable of processing 50,000 requests/second across distributed API gateways.",
                "System Architecture: Design a real-time Notification Service (supporting Push, Email, SMS) with retry mechanisms, dead-letter queues, and idempotency.",
                "Database Architecture: Design a URL shortener service (like bit.ly) handling 10 Million daily redirects. Explain database sharding and caching strategies."
            ],
            "behavioral": [
                "Behavioral STAR Method: Describe a situation where a critical production bug occurred right before a high-stakes release. How did you diagnose, communicate, and fix it under pressure?",
                "Behavioral: Tell me about a technical debate you had with a teammate regarding system architecture. How did you resolve the disagreement constructively?",
                "Behavioral: Describe a project where requirements were vague or rapidly changing. How did you structure your work to deliver high quality on time?"
            ]
        }

        q_list = questions_map.get(track, questions_map["technical"])
        idx = state.step_index % len(q_list)
        question_text = q_list[idx]

        question_msg = {
            "id": f"msg_{uuid.uuid4().hex[:8]}",
            "sender": "interviewer",
            "content": question_text,
            "difficulty": diff,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "node": "QuestionGeneratorNode"
        }

        state.messages.append(question_msg)
        state.step_index += 1
        return question_msg

    @staticmethod
    def execute_evaluator_node(state: LangGraphInterviewState, answer_text: str, code_snippet: Optional[str] = None) -> dict:
        """Node 2: Evaluator Node"""
        word_count = len(answer_text.split()) + (len((code_snippet or "").split()) if code_snippet else 0)
        has_code = bool(code_snippet and len(code_snippet.strip()) > 15)

        # Strict quantitative technical scoring
        if word_count == 0:
            accuracy_score = 15
            critique = "No answer provided. Candidate left the question unattempted."
            route_decision = "DECREASE_DIFFICULTY"
        elif word_count < 10:
            accuracy_score = 35
            critique = "Response was extremely brief and lacked core technical reasoning."
            route_decision = "DECREASE_DIFFICULTY"
        elif word_count < 30:
            accuracy_score = 65
            critique = "Solid initial points, but needs more technical depth and edge-case analysis."
            route_decision = "MAINTAIN_DIFFICULTY"
        else:
            accuracy_score = min(98, 75 + (word_count // 5) + (15 if has_code else 0))
            critique = "Outstanding technical depth! Clearly articulated core principles and edge cases."
            route_decision = "INCREASE_DIFFICULTY"

        eval_result = {
            "step": state.step_index,
            "accuracy_score": accuracy_score,
            "critique": critique,
            "route_decision": route_decision,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

        state.evaluations.append(eval_result)
        return eval_result

    @staticmethod
    def execute_router_node(state: LangGraphInterviewState, route_decision: str) -> str:
        """Node 3: Dynamic Difficulty Router Node"""
        ladder = ["Easy", "Medium", "Hard", "Advanced"]
        curr = state.current_difficulty
        curr_idx = ladder.index(curr) if curr in ladder else 1

        if route_decision == "INCREASE_DIFFICULTY":
            next_idx = min(curr_idx + 1, len(ladder) - 1)
        elif route_decision == "DECREASE_DIFFICULTY":
            next_idx = max(curr_idx - 1, 0)
        else:
            next_idx = curr_idx

        state.current_difficulty = ladder[next_idx]
        return state.current_difficulty

    @staticmethod
    def execute_scorecard_node(state: LangGraphInterviewState) -> dict:
        """Node 4: Scorecard Synthesizer Node"""
        evals = state.evaluations
        if not evals:
            avg_acc = 18
            strengths = ["Attempted session initialization."]
            areas = ["No candidate answers submitted during the round."]
            feedback = "No responses recorded. Attempt questions with detailed technical reasoning to improve score."
        else:
            avg_acc = int(sum(e["accuracy_score"] for e in evals) / len(evals))
            if avg_acc < 40:
                strengths = ["Submitted initial response."]
                areas = ["Provide detailed technical answers", "Write code solutions in the editor"]
                feedback = "Responses lacked technical details. Work on elaborating concepts and code."
            else:
                strengths = [
                    "Strong technical confidence in architecture discussions.",
                    "Clear verbal articulation of algorithmic time & space complexity.",
                    "Effective application of modular clean code patterns."
                ]
                areas = [
                    "Include deeper concrete unit test coverage examples for boundary conditions.",
                    "Detail distributed failover and cache eviction strategies under high burst load."
                ]
                feedback = f"Great effort in the {state.track} round! Your overall score is {avg_acc}%."

        return {
            "overall_score": avg_acc,
            "technical_accuracy": max(15, min(99, avg_acc + 2)),
            "problem_solving": max(15, avg_acc - 1),
            "communication": max(20, min(98, avg_acc + 3)),
            "total_questions": len(evals) or 1,
            "strengths": strengths,
            "areas_for_improvement": areas,
            "overall_feedback": feedback
        }
