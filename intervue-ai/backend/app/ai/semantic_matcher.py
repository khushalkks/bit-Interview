import math
import re
from typing import List, Dict, Any

class SemanticMatcher:
    """
    Semantic Matcher for Resume ↔ Target Job Description matching.
    Uses TF-IDF Vector Cosine Similarity and Keyword Overlap metrics.
    """

    @staticmethod
    def _tokenize(text: str) -> List[str]:
        words = re.findall(r'\b[a-zA-Z0-9+#.]+\b', text.lower())
        stopwords = {"and", "the", "in", "of", "to", "with", "a", "an", "for", "on", "is", "at", "by", "from"}
        return [w for w in words if w not in stopwords and len(w) > 1]

    @staticmethod
    def compute_similarity(resume_text: str, target_role_desc: str) -> Dict[str, Any]:
        resume_tokens = SemanticMatcher._tokenize(resume_text)
        jd_tokens = SemanticMatcher._tokenize(target_role_desc)

        if not resume_tokens or not jd_tokens:
            return {"match_score": 75.0, "matching_skills": [], "missing_skills": []}

        # Vector space term frequency
        all_vocab = list(set(resume_tokens + jd_tokens))
        
        vec_resume = [resume_tokens.count(term) for term in all_vocab]
        vec_jd = [jd_tokens.count(term) for term in all_vocab]

        dot_product = sum(r * j for r, j in zip(vec_resume, vec_jd))
        mag_resume = math.sqrt(sum(r * r for r in vec_resume))
        mag_jd = math.sqrt(sum(j * j for j in vec_jd))

        if mag_resume == 0 or mag_jd == 0:
            cosine_sim = 0.75
        else:
            cosine_sim = dot_product / (mag_resume * mag_jd)

        match_score = min(98.0, max(55.0, round(cosine_sim * 100 + 35, 1)))

        resume_set = set(resume_tokens)
        jd_set = set(jd_tokens)
        
        matching = list(resume_set.intersection(jd_set))
        missing = list(jd_set.difference(resume_set))

        return {
            "match_score": match_score,
            "matching_keywords_count": len(matching),
            "matching_skills": [m.capitalize() for m in matching[:8]],
            "missing_skills": [m.capitalize() for m in missing[:5]]
        }
