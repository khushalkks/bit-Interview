import uuid
import os
import httpx
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
        self.stage = "ICEBREAKER" # ICEBREAKER -> INTRO -> RESUME_DEEP_DIVE -> JD_SKILL_GAPS -> TECHNICAL_CODING -> ADAPTIVE_FOLLOWUP
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

    @classmethod
    def from_dict(cls, data: dict):
        state = cls(
            session_id=data.get("session_id", ""),
            track=data.get("track", "technical"),
            target_role=data.get("target_role", "Full Stack Engineer"),
            initial_difficulty=data.get("current_difficulty", "Medium"),
            candidate_name=data.get("candidate_name", "Candidate"),
            company_name=data.get("company_name", "Target Company"),
            matched_skills=data.get("matched_skills"),
            skill_gaps=data.get("skill_gaps"),
            persona=data.get("persona", "Sarah"),
            duration=data.get("duration", "30 min"),
            target_level=data.get("target_level", "Senior SWE")
        )
        state.step_index = data.get("step_index", 0)
        state.stage = data.get("stage", "ICEBREAKER")
        state.messages = data.get("messages", [])
        state.evaluations = data.get("evaluations", [])
        state.topics_covered = data.get("topics_covered", [])
        state.weak_topics = data.get("weak_topics", [])
        state.strong_topics = data.get("strong_topics", [])
        state.interruption_count = data.get("interruption_count", 0)
        return state

class LangGraphAdaptiveAgent:
    """
    Agentic Workflow Graph implementing LangGraph-style state machine transitions
    Nodes:
      1. QuestionGeneratorNode (Intro -> Resume Projects -> Adaptive Follow-Ups -> Coding)
      2. CandidateResponseNode
      3. InterruptionCheckNode (Silence/Ramble/Vague Interruption Loop)
      4. EvaluatorNode (Technical Accuracy & Complexity Scoring)
      5. DecisionEngineNode (Routing Signals: CONTINUE | FOLLOW_UP | ADJUST_DIFFICULTY | INTERRUPT)
      6. DifficultyRouterNode (Easy -> Medium -> Hard -> Advanced)
      7. ScorecardSynthesizerNode
    """

    @staticmethod
    def _generate_llm_adaptive_question(state: LangGraphInterviewState, candidate_last_answer: str = "") -> Optional[str]:
        """Call LLM API (Gemini or OpenAI) to generate a 100% dynamic, context-aware follow-up question."""
        gemini_key = os.getenv("GEMINI_API_KEY")
        openai_key = os.getenv("OPENAI_API_KEY")

        if not gemini_key and not openai_key:
            return None

        # Build prompt with conversation context
        messages_summary = []
        for m in state.messages[-6:]:
            sender = m.get("sender", "interviewer")
            content = m.get("content", "")
            if sender and content:
                messages_summary.append(f"{sender.capitalize()}: {content[:250]}")
        
        chat_history = "\n".join(messages_summary)
        already_asked = "; ".join(state.topics_covered[-5:]) if state.topics_covered else "None"
        
        prompt = f"""You are an expert AI technical interviewer named {state.persona} conducting a {state.track} interview round for a {state.target_role} ({state.target_level}) position at {state.company_name}.
Candidate Name: {state.candidate_name}
Target Role: {state.target_role}
Current Difficulty Level: {state.current_difficulty}
Candidate Resume Skills: {', '.join(state.matched_skills[:5])}
Skill Gaps to test: {', '.join(state.skill_gaps[:3])}

Topics / Questions Already Covered (DO NOT REPEAT):
{already_asked}

Recent Conversation Transcript:
{chat_history}

Candidate's Latest Response:
"{candidate_last_answer}"

REQUIREMENTS FOR YOUR NEXT QUESTION:
1. Provide a brief 1-sentence acknowledgment of their latest answer.
2. Formulate ONE clear, highly specific follow-up question.
3. If this is step 1 after candidate intro, ask them about a technical project on their resume or core architectural experience.
4. If candidate mentioned a specific technology (e.g. React, Python, PostgreSQL, Microservices), probe into trade-offs, edge cases, failure modes, or performance tuning.
5. NEVER repeat any question already asked in the conversation.
6. Keep tone professional, engaging, and concise (2-4 sentences total).

Return ONLY the response text."""

        # Try Gemini API if key is present
        if gemini_key and gemini_key != "your_gemini_api_key_here":
            try:
                import google.generativeai as genai
                genai.configure(api_key=gemini_key)
                model = genai.GenerativeModel('gemini-1.5-flash')
                response = model.generate_content(prompt)
                if response and response.text:
                    return response.text.strip()
            except Exception as e:
                print(f"[AI Agent] Gemini API call skipped/failed: {e}")

        # Try OpenAI API if key is present
        if openai_key and openai_key != "your_openai_api_key_here":
            try:
                url = "https://api.openai.com/v1/chat/completions"
                headers = {"Authorization": f"Bearer {openai_key}", "Content-Type": "application/json"}
                payload = {
                    "model": "gpt-4o-mini",
                    "messages": [{"role": "user", "content": prompt}],
                    "max_tokens": 300,
                    "temperature": 0.7
                }
                res = httpx.post(url, headers=headers, json=payload, timeout=8.0)
                if res.status_code == 200:
                    data = res.json()
                    return data["choices"][0]["message"]["content"].strip()
            except Exception as e:
                print(f"[AI Agent] OpenAI API call skipped/failed: {e}")

        return None

    @staticmethod
    def execute_question_node(state: LangGraphInterviewState, candidate_last_answer: str = "") -> dict:
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
            "Daniel": f"Good day {name}. I'm Daniel. We'll be conducting a structured assessment today.",
            "Fin": f"Alright {name}, I'm Fin. Let's jump straight into business.",
            "Clyde": f"Welcome {name}. I'm Clyde. I'll be scrutinizing your technical claims today."
        }
        opener = persona_openers.get(persona, f"Hello {name}!")

        question_text = ""

        # STEP 0: ALWAYS START WITH CANDIDATE INTRODUCTION FOR ALL TRACKS ("Phele introduce karega")
        if step == 0:
            state.stage = "INTRO"
            track_name = track.replace("_", " ").title()
            question_text = (
                f"{opener} Welcome to your **{track_name}** round for the **{role}** position at **{company}**.\n\n"
                f"To get started, please introduce yourself! Give me a brief summary of your technical background, "
                f"and highlight 1-2 major projects or engineering challenges you've recently worked on."
            )

        # STEP 1: FOLLOW UP ON INTRODUCTION & RESUME PROJECTS
        elif step == 1:
            state.stage = "RESUME_INTRO_FOLLOWUP"
            question_text = (
                f"Thank you for that introduction, {name}! Based on your background with **{top_skill}** and **{second_skill}**:\n\n"
                f"Could you walk me through the overall architecture of a key production system you built with **{top_skill}**? "
                f"What core technical decisions, trade-offs, or database choices did you make during its design?"
            )

        # STEP 2+: ADAPTIVE DYNAMIC FOLLOW-UPS (LLM or Context-Aware Fallback Engine)
        else:
            # 1. Attempt LLM generation
            llm_question = LangGraphAdaptiveAgent._generate_llm_adaptive_question(state, candidate_last_answer)
            
            if llm_question:
                state.stage = "ADAPTIVE_LLM_QUESTION"
                question_text = llm_question
            else:
                # 2. Dynamic Fallback Question Pool (Ensuring NO duplicate question is EVER repeated)
                state.stage = f"ADAPTIVE_STEP_{step}"
                
                # Check candidate's answer text for keyword triggers
                ans_lower = (candidate_last_answer or "").lower()

                # Topic pools
                topic_options = []

                if "database" in ans_lower or "sql" in ans_lower or "postgres" in ans_lower or "mongo" in ans_lower:
                    topic_options.append((
                        "database_indexing",
                        f"You mentioned working with database layers. When scaling read queries under high volume, "
                        f"how do you design B-Tree or Composite Indexes in your database, and how do you detect and fix slow un-indexed queries?"
                    ))
                    topic_options.append((
                        "database_transactions",
                        f"In distributed backend services, how do you handle database transaction isolation levels, "
                        f"and what strategies (like optimistic vs pessimistic locking) do you use to prevent race conditions?"
                    ))

                if "async" in ans_lower or "event" in ans_lower or "api" in ans_lower or "microservice" in ans_lower:
                    topic_options.append((
                        "async_concurrency",
                        f"Digging into asynchronous I/O and microservices: How do you handle non-blocking event loops and CPU-bound thread pool starvation when processing high-burst background tasks?"
                    ))
                    topic_options.append((
                        "api_rate_limiting",
                        f"To protect your downstream services from thundering herd attacks or API abuse, how would you implement a Token Bucket or Leaky Bucket rate limiter using Redis?"
                    ))

                if track == "behavioral":
                    topic_options.extend([
                        ("star_conflict", f"Using the **STAR method** (Situation, Task, Action, Result): Describe a situation where you had a strong disagreement with a team member over system architecture or code quality. How did you handle it and build alignment?"),
                        ("star_outage", f"Tell me about a high-stress production outage or P0 incident you managed. What immediate steps did you take to triage the bug, communicate with stakeholders, and prevent recurrence?"),
                        ("star_tech_debt", f"Describe a project where you had to compromise on technical debt to meet a tight deadline. How did you plan the refactoring later?")
                    ])
                elif track == "system_design" or "system" in track:
                    topic_options.extend([
                        ("design_caching", f"When designing high-throughput distributed systems, how do you structure your caching strategy (Cache-Aside vs Read-Through) and handle cache invalidation and stampede issues using **{gap_skill}**?"),
                        ("design_sharding", f"If write traffic scales 50x beyond single-database limits, how would you approach horizontal database sharding and cross-shard querying?"),
                        ("design_monitoring", f"How do you instrument distributed tracing (OpenTelemetry) and p99 latency alerts to detect bottlenecks across microservices?")
                    ])
                else: # Technical / Resume Deep Dive
                    topic_options.extend([
                        ("tech_performance_tuning", f"Following up on your system architecture: What profiling tools or metrics do you inspect when diagnosing memory leaks, garbage collection spikes, or high latency in **{top_skill}** applications?"),
                        ("tech_fault_tolerance", f"How do you implement graceful degradation, circuit breakers, and retries with exponential backoff when downstream third-party APIs fail?"),
                        ("tech_gap_challenge", f"Looking at high-scale requirements for **{role}**, one key technology is **{gap_skill}**. What is your architectural intuition regarding **{gap_skill}**, and how would you integrate it?")
                    ])

                # Filter out topics already asked
                unasked = [t for t in topic_options if t[0] not in state.topics_covered]
                
                if unasked:
                    chosen_topic, chosen_text = unasked[0]
                else:
                    # Generic fallback if all candidates exhausted
                    chosen_topic = f"generic_probe_step_{step}"
                    chosen_text = (
                        f"That's a solid explanation. Stepping up to **{diff}** level: "
                        f"How would your proposed solution change if we constrained memory footprint to 512MB RAM and required sub-50ms latency guarantees under 100,000 concurrent requests?"
                    )

                state.topics_covered.append(chosen_topic)
                question_text = chosen_text

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
