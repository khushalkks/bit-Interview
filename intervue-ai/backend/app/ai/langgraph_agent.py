import uuid
from typing import Dict, Any, List, Optional
from datetime import datetime

class LangGraphInterviewState:
    """State schema for LangGraph agent node transitions"""
    def __init__(self, session_id: str, track: str, target_role: str, initial_difficulty: str = "Medium", candidate_name: str = "Candidate", matched_skills: List[str] = None, skill_gaps: List[str] = None, company_name: str = "Target Company", persona: str = "Sarah", duration: str = "30 min", target_level: str = "Senior SWE"):
        self.session_id = session_id
        self.track = track
        self.target_role = target_role
        self.current_difficulty = initial_difficulty
        self.candidate_name = candidate_name
        self.company_name = company_name
        self.persona = persona
        self.duration = duration
        self.target_level = target_level
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
            "persona": self.persona,
            "duration": self.duration,
            "target_level": self.target_level,
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
        """Node 1: Tailored Question Generator Node using Candidate Resume + Track + Persona State"""
        track = state.track
        role = state.target_role
        diff = state.current_difficulty
        name = state.candidate_name
        company = state.company_name
        persona = state.persona or "Sarah"
        skills = state.matched_skills or ["Python", "React", "FastAPI", "REST API", "SQL"]
        gaps = state.skill_gaps or ["Distributed Caching", "Kafka Microservices", "System Scaling"]
        step = state.step_index

        top_skill = skills[0] if skills else "Software Engineering"
        second_skill = skills[1] if len(skills) > 1 else "Web Applications"
        third_skill = skills[2] if len(skills) > 2 else "Database Management"
        gap_skill = gaps[0] if gaps else "High Concurrency Scaling"

        # Persona tone prefixes
        persona_openers = {
            "Sarah": f"Hello {name}! I'm Sarah. I'm excited to dive into your background today.",
            "Daniel": f"Good day {name}. I'm Daniel. We'll be conducting a structured assessment.",
            "Fin": f"Alright {name}, I'm Fin. Let's jump straight to business.",
            "Clyde": f"Welcome {name}. I'm Clyde. I'll be scrutinizing your technical claims today."
        }
        opener = persona_openers.get(persona, f"Hello {name}!")

        # Format-specific question generation (Behavioral vs Technical vs Resume Deep Dive)
        if track == "behavioral":
            if step == 0:
                state.stage = "BEHAVIORAL_INTRO"
                question_text = (
                    f"{opener} Welcome to your Behavioral Interview round for {role} at {company}.\n\n"
                    f"To begin, please introduce yourself and share a situation where you took ownership of a critical, ambiguous engineering project."
                )
            elif step == 1:
                state.stage = "STAR_CONFLICT_RESOLUTION"
                question_text = (
                    f"Using the **STAR method** (Situation, Task, Action, Result):\n\n"
                    f"Describe a situation where you had a major technical disagreement with a team member or product manager regarding system architecture. How did you resolve it?"
                )
            elif step == 2:
                state.stage = "STAR_PRODUCTION_INCIDENT"
                question_text = (
                    f"Describe a high-pressure production incident or outage that occurred right before a key release.\n\n"
                    f"What immediate triage actions did you take, how did you communicate under pressure, and what root-cause fix was implemented?"
                )
            else:
                state.stage = "STAR_LEADERSHIP_TRADEOFF"
                question_text = (
                    f"Share an example where you had to compromise on technical quality to meet a strict business deadline.\n\n"
                    f"What technical debt was introduced, and how did you manage its refactoring later?"
                )

        elif track == "resume_deep_dive" or "resume" in track.lower():
            if step == 0:
                state.stage = "RESUME_PROJECT_PROBE"
                question_text = (
                    f"{opener} I've thoroughly analyzed your CV for the {role} track at {company}.\n\n"
                    f"I see strong hands-on experience in **{top_skill}**, **{second_skill}**, and **{third_skill}**. "
                    f"Could you walk me through the architecture and technical highlights of your primary production project built with **{top_skill}**?"
                )
            elif step == 1:
                state.stage = "RESUME_BOTTLENECK_PROBE"
                question_text = (
                    f"Digging deeper into your resume experience with **{top_skill}** and **{second_skill}**:\n\n"
                    f"What was the most challenging performance or asynchronous I/O bottleneck you encountered in that system, and how did you measure and resolve it?"
                )
            elif step == 2:
                state.stage = "RESUME_FAULT_TOLERANCE"
                question_text = (
                    f"Looking at your profile's focus on **{second_skill}**:\n\n"
                    f"How did you implement error boundaries, data caching, and graceful fallback mechanisms under high concurrent user traffic?"
                )
            else:
                state.stage = "RESUME_REARCHITECTURE_CHALLENGE"
                question_text = (
                    f"If you were tasked with re-architecting your **{top_skill}** project today to handle 100x traffic volume, "
                    f"how would you integrate **{gap_skill}** to eliminate single points of failure?"
                )

        else: # Default Technical Round
            if step == 0:
                state.stage = "ICEBREAKER"
                question_text = (
                    f"{opener} Welcome to your Technical Deep-Dive round for {role} at {company}.\n\n"
                    f"I reviewed your profile highlighting expertise in **{top_skill}** and **{second_skill}**. "
                    f"To kick off, please briefly introduce yourself and highlight a complex engineering feature you delivered using {top_skill}."
                )
            elif step == 1:
                state.stage = "RESUME_DEEP_DIVE"
                question_text = (
                    f"Thanks! Digging deeper into **{top_skill}**:\n\n"
                    f"When designing systems with {top_skill}, how do you manage memory footprint, garbage collection, and async I/O bottlenecks under heavy load?"
                )
            elif step == 2:
                state.stage = "JD_SKILL_GAPS"
                question_text = (
                    f"Looking at high-scale requirements for **{role}**, one key technology expected is **{gap_skill}**.\n\n"
                    f"What is your architectural intuition regarding {gap_skill}? How would you design fault tolerance and cache eviction for it?"
                )
            else:
                state.stage = "TECHNICAL_CODING"
                question_text = (
                    f"Coding Challenge for {role}: Implement an LRU Cache data structure supporting get(key) and put(key, value) in O(1) time. "
                    f"Switch to the Monaco Code Editor tab to write your solution."
                )

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
        """Node 4: Evaluator Node - Rigorous Technical Evaluation"""
        ans_clean = (answer_text or "").strip()
        code_clean = (code_snippet or "").strip()
        
        words = ans_clean.split()
        word_count = len(words)
        has_code = len(code_clean) > 20

        # Technical keyword check to filter out non-technical fluff
        tech_keywords = [
            "python", "javascript", "react", "node", "fastapi", "sql", "redis", "kafka", "docker", 
            "microservices", "complexity", "o(1)", "o(n)", "cache", "async", "database", "api", 
            "function", "class", "state", "concurrency", "thread", "latency", "architecture", 
            "index", "query", "design", "structure", "algorithm", "pointer", "hash", "loop"
        ]
        text_lower = ans_clean.lower()
        matched_keywords = [kw for kw in tech_keywords if kw in text_lower]
        keyword_density = len(matched_keywords)

        if word_count == 0 and not has_code:
            accuracy_score = 10
            critique = "No response submitted for this question."
            route_decision = "DECREASE_DIFFICULTY"
        elif word_count < 12 and not has_code:
            accuracy_score = 25
            critique = "Response was extremely brief (under 12 words) and lacked technical reasoning."
            route_decision = "DECREASE_DIFFICULTY"
        elif word_count < 30 and not has_code:
            if keyword_density >= 2:
                accuracy_score = 52
                critique = "Good initial technical keywords used, but response needs deeper architectural elaboration and code."
                route_decision = "MAINTAIN_DIFFICULTY"
            else:
                accuracy_score = 38
                critique = "Answer is general and brief. Missing domain-specific technical concepts and complexity analysis."
                route_decision = "DECREASE_DIFFICULTY"
        else:
            # Longer answer or contains code
            base_score = 45
            if has_code:
                base_score += 25
            base_score += min(20, keyword_density * 4)
            base_score += min(10, word_count // 15)

            accuracy_score = max(35, min(95, base_score))

            if accuracy_score >= 75:
                critique = "Strong technical depth! Clear articulation of core engineering concepts and solution architecture."
                route_decision = "INCREASE_DIFFICULTY"
            elif accuracy_score >= 55:
                critique = "Fair technical explanation. Expand further on system trade-offs, Big-O metrics, and boundary conditions."
                route_decision = "MAINTAIN_DIFFICULTY"
            else:
                critique = "Response contains length but lacks concrete technical depth and algorithm details."
                route_decision = "DECREASE_DIFFICULTY"

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
            avg_acc = 15
            strengths = ["Attempted session initialization."]
            areas = ["No candidate answers submitted during the round."]
            feedback = "No responses recorded. Attempt questions with detailed technical reasoning to receive evaluation."
        else:
            avg_acc = int(sum(e["accuracy_score"] for e in evals) / len(evals))
            if avg_acc < 45:
                strengths = ["Attempted basic interview interactions."]
                areas = [
                    "Provide comprehensive technical explanations rather than short single-line answers.",
                    "Include concrete Big-O Time & Space complexity analysis.",
                    "Use Monaco Editor to write functional code implementations."
                ]
                feedback = f"Overall Score: {avg_acc}%. Performance indicates significant gaps in technical depth and explanation detail."
            elif avg_acc < 70:
                strengths = [
                    "Demonstrated foundational understanding of general concepts.",
                    "Basic domain terminology used during responses."
                ]
                areas = [
                    "Deepen technical specificity regarding scalability and concurrency.",
                    "Include edge-case test suite examples and code solutions."
                ]
                feedback = f"Overall Score: {avg_acc}%. Fair attempt in the {state.track} round. Focus on expanding architecture trade-offs to reach senior standards."
            else:
                strengths = [
                    "Strong technical confidence in system architecture discussions.",
                    "Clear verbal articulation of algorithmic complexity.",
                    "Effective application of modular clean code patterns."
                ]
                areas = [
                    "Include deeper concrete unit test coverage examples for boundary conditions.",
                    "Detail distributed failover and cache eviction strategies under high burst load."
                ]
                feedback = f"Strong technical performance in the {state.track} round! Your overall score is {avg_acc}%."

        return {
            "overall_score": avg_acc,
            "technical_accuracy": max(10, min(98, avg_acc)),
            "problem_solving": max(10, min(95, avg_acc - 2)),
            "communication": max(15, min(98, avg_acc + 2)),
            "total_questions": len(evals) or 1,
            "strengths": strengths,
            "areas_for_improvement": areas,
            "overall_feedback": feedback
        }
