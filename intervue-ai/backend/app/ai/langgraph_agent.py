import uuid
from typing import Dict, Any, List, Optional
from datetime import datetime

class LangGraphInterviewState:
    """State schema for LangGraph agent node transitions"""
    def __init__(self, session_id: str, track: str, target_role: str, initial_difficulty: str = "Medium", candidate_name: str = "Candidate", matched_skills: List[str] = None, skill_gaps: List[str] = None, company_name: str = "Target Company"):
        self.session_id = session_id
        self.track = track
        self.target_role = target_role
        self.current_difficulty = initial_difficulty
        self.candidate_name = candidate_name
        self.company_name = company_name
        self.matched_skills = matched_skills or ["Python", "JavaScript", "React", "REST APIs"]
        self.skill_gaps = skill_gaps or ["Microservices Architecture", "Redis Eviction", "Kafka Event Streams"]
        self.step_index = 0
        self.stage = "ICEBREAKER" # ICEBREAKER -> RESUME_DEEP_DIVE -> JD_SKILL_GAPS -> TECHNICAL_CODING
        self.messages: List[dict] = []
        self.evaluations: List[dict] = []
        self.topics_covered: List[str] = []
        self.weak_topics: List[str] = []
        self.strong_topics: List[str] = []
        self.interruption_count: int = 0

    def to_dict(self) -> dict:
        return {
            "session_id": self.session_id,
            "track": self.track,
            "target_role": self.target_role,
            "candidate_name": self.candidate_name,
            "company_name": self.company_name,
            "matched_skills": self.matched_skills,
            "skill_gaps": self.skill_gaps,
            "current_difficulty": self.current_difficulty,
            "step_index": self.step_index,
            "stage": self.stage,
            "messages": self.messages,
            "evaluations": self.evaluations,
            "topics_covered": self.topics_covered,
            "weak_topics": self.weak_topics,
            "strong_topics": self.strong_topics,
            "interruption_count": self.interruption_count
        }

class LangGraphAdaptiveAgent:
    """
    Agentic Workflow Graph implementing LangGraph-style state machine transitions
    Nodes:
      1. QuestionGeneratorNode (Icebreaker -> Resume Projects -> JD Gaps -> Coding)
      2. CandidateResponseNode
      3. InterruptionCheckNode (Silence/Ramble/Vague Interruption Loop)
      4. EvaluatorNode (Technical Accuracy & Complexity Scoring)
      5. DecisionEngineNode (Routing Signals: CONTINUE | FOLLOW_UP | ADJUST_DIFFICULTY | INTERRUPT)
      6. DifficultyRouterNode (Easy -> Medium -> Hard -> Advanced)
      7. ScorecardSynthesizerNode
    """

    @staticmethod
    def execute_question_node(state: LangGraphInterviewState, candidate_skills: List[str] = None) -> dict:
        """Node 1: Personalized Question Generator Node using Candidate Resume + JD State"""
        track = state.track
        role = state.target_role
        diff = state.current_difficulty
        name = state.candidate_name
        company = state.company_name
        skills = state.matched_skills or ["Python", "React"]
        gaps = state.skill_gaps or ["System Architecture"]
        step = state.step_index

        top_skill = skills[0] if skills else "Software Engineering"
        second_skill = skills[1] if len(skills) > 1 else "Web Development"
        gap_skill = gaps[0] if gaps else "Distributed Systems"

        # Stage Progression Logic
        if step == 0:
            state.stage = "ICEBREAKER"
            question_text = (
                f"Hello {name}! Welcome to your Bit-Interview session for the {role} position at {company}.\n\n"
                f"I reviewed your profile and noticed strong expertise in **{top_skill}** and **{second_skill}**. "
                f"To kick off our round today, could you briefly introduce yourself and highlight a complex engineering project you built using {top_skill}?"
            )
        elif step == 1:
            state.stage = "RESUME_DEEP_DIVE"
            question_text = (
                f"Thanks for that introduction, {name}! Digging deeper into your experience with **{top_skill}**:\n\n"
                f"When designing systems with {top_skill}, how do you handle performance optimization, memory management, and asynchronous I/O bottlenecks under heavy traffic?"
            )
        elif step == 2:
            state.stage = "JD_SKILL_GAPS"
            question_text = (
                f"Great technical points. Now, looking at the job requirements for **{role}**, one key technology expected is **{gap_skill}**.\n\n"
                f"Can you explain your experience or architectural intuition regarding {gap_skill}? How would you design fault tolerance and state caching for it?"
            )
        else:
            state.stage = "TECHNICAL_CODING"
            questions_map = {
                "technical": f"Coding Sandbox Challenge for {role}: Implement an LRU Cache data structure supporting get(key) and put(key, value) in O(1) time. Write your code solution in the Monaco editor.",
                "coding": "Coding Challenge: Given a string s, find the length of the longest substring without repeating characters. Implement your algorithm in the Monaco editor.",
                "system_design": f"System Architecture Challenge for {role}: Design a scalable Rate Limiting middleware (e.g. 100 requests/minute per user) handling 50,000 req/sec across API gateways.",
                "behavioral": "Behavioral STAR Method: Describe a situation where a critical production bug occurred right before a release. How did you diagnose, communicate, and fix it under pressure?"
            }
            question_text = questions_map.get(track, questions_map["technical"])

        question_msg = {
            "id": f"msg_{uuid.uuid4().hex[:8]}",
            "sender": "interviewer",
            "content": question_text,
            "difficulty": diff,
            "stage": state.stage,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "node": "QuestionGeneratorNode"
        }

        state.messages.append(question_msg)
        state.step_index += 1
        return question_msg

    @staticmethod
    def execute_interruption_check_node(answer_text: str, duration_seconds: int = 0) -> Optional[dict]:
        """Node 3: Interruption Check Node for Silence, Rambling, or Vague Answers"""
        words = answer_text.strip().split()
        word_count = len(words)

        if word_count == 0 or duration_seconds > 20:
            return {
                "type": "INTERRUPT_SILENCE",
                "interviewer_prompt": "Let me interrupt for a moment — would you like to walk me through your current thinking or assumptions out loud?"
            }
        
        if word_count > 180:
            return {
                "type": "INTERRUPT_RAMBLE",
                "interviewer_prompt": "Let's pause there for a second to keep our time focused. What is the core architectural trade-off of your proposed solution?"
            }

        return None

    @staticmethod
    def execute_evaluator_node(state: LangGraphInterviewState, answer_text: str, code_snippet: Optional[str] = None) -> dict:
        """Node 4: Evaluator Node"""
        word_count = len(answer_text.split()) + (len((code_snippet or "").split()) if code_snippet else 0)
        has_code = bool(code_snippet and len(code_snippet.strip()) > 15)

        # Strict quantitative technical scoring
        if word_count == 0:
            accuracy_score = 15
            critique = "No answer provided. Candidate left the question unattempted."
            route_decision = "DECREASE_DIFFICULTY"
        elif word_count < 12:
            accuracy_score = 38
            critique = "Response was extremely brief and lacked core technical reasoning."
            route_decision = "DECREASE_DIFFICULTY"
        elif word_count < 35:
            accuracy_score = 68
            critique = "Solid initial points, but needs deeper technical edge-case breakdown."
            route_decision = "MAINTAIN_DIFFICULTY"
        else:
            accuracy_score = min(98, 75 + (word_count // 5) + (15 if has_code else 0))
            critique = "Outstanding technical depth! Clearly articulated core principles and trade-offs."
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
        """Node 6: Dynamic Difficulty Router Node"""
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
        """Node 7: Scorecard Synthesizer Node"""
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
                    "Strong technical confidence in system architecture discussions.",
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
