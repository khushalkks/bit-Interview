const BASE_URL = 'http://localhost:8000/api';

/**
 * Custom fetch wrapper with automatic JWT token attachment
 */
export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('bit_interview_token');

  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  // Only set Content-Type to application/json if body is not FormData
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  
  if (response.status === 204) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'An unexpected error occurred');
  }

  return data;
}

export const authAPI = {
  login: (email, password) =>
    apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (name, email, password, targetRole) =>
    apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, target_role: targetRole }),
    }),

  getMe: () => apiFetch('/auth/me'),
};

export const dashboardAPI = {
  getSummary: () => apiFetch('/dashboard/summary'),
};

export const resumeAPI = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiFetch('/resume/upload', {
      method: 'POST',
      body: formData,
    });
  },

  getMe: () => apiFetch('/resume/me'),

  delete: () =>
    apiFetch('/resume/me', {
      method: 'DELETE',
    }),
};

export const interviewAPI = {
  start: (
    track = 'technical',
    difficulty = 'Medium',
    targetRole = 'Full Stack Engineer',
    candidateName = null,
    companyName = null,
    resumeText = null,
    jdText = null,
    persona = 'Sarah',
    duration = '30 min',
    targetLevel = 'Senior SWE'
  ) =>
    apiFetch('/interview/start', {
      method: 'POST',
      body: JSON.stringify({
        track,
        difficulty,
        target_role: targetRole,
        candidate_name: candidateName,
        company_name: companyName,
        resume_text: resumeText,
        jd_text: jdText,
        persona,
        duration,
        target_level: targetLevel,
      }),
    }),

  getSession: (sessionId) => apiFetch(`/interview/${sessionId}`),

  submitAnswer: (sessionId, answerText, codeSnippet = null, codeLanguage = null) =>
    apiFetch(`/interview/${sessionId}/answer`, {
      method: 'POST',
      body: JSON.stringify({
        answer_text: answerText,
        code_snippet: codeSnippet,
        code_language: codeLanguage,
      }),
    }),

  endSession: (sessionId) =>
    apiFetch(`/interview/${sessionId}/end`, {
      method: 'POST',
    }),

  getReport: (sessionId) => apiFetch(`/interview/${sessionId}/report`),

  logProctoringEvent: (sessionId, eventType, details = null) =>
    apiFetch(`/interview/${sessionId}/proctoring-event`, {
      method: 'POST',
      body: JSON.stringify({ event_type: eventType, details }),
    }),

  getAiHint: (sessionId, currentCode = '', level = 1) =>
    apiFetch(`/interview/${sessionId}/ai-hint`, {
      method: 'POST',
      body: JSON.stringify({ current_code: currentCode, level }),
    }),

  getHistory: () => apiFetch('/interview/history'),
};

export const jdAPI = {
  analyze: (jdText, targetRole = 'Software Engineer', companyName = 'Target Company') =>
    apiFetch('/jd/analyze', {
      method: 'POST',
      body: JSON.stringify({ jd_text: jdText, target_role: targetRole, company_name: companyName }),
    }),

  getAnalysis: (id) => apiFetch(`/jd/${id}`),
};

export const recruiterAPI = {
  getLeaderboard: () => apiFetch('/recruiter/leaderboard'),
};

export const codingAPI = {
  runCode: (code, language = 'python', testCases = null) =>
    apiFetch('/coding/run', {
      method: 'POST',
      body: JSON.stringify({ code, language, test_cases: testCases }),
    }),

  submitCode: (sessionId, code, language = 'python') =>
    apiFetch('/coding/submit', {
      method: 'POST',
      body: JSON.stringify({ session_id: sessionId, code, language }),
    }),
};
