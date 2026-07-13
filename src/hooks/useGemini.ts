import { useState } from 'react';
import { auth } from '../config/firebase';

export const useGemini = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const proxyUrl = import.meta.env.VITE_GEMINI_PROXY_URL as string | undefined;

  const cleanJsonResponse = (rawText: string) =>
    JSON.parse(rawText.replace(/^```(?:json)?\n?/, '').replace(/```$/, '').trim());

  const callProxy = async (action: string, body: object): Promise<Response> => {
    const idToken = auth.currentUser ? await auth.currentUser.getIdToken() : '';
    return fetch(proxyUrl!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Action-Type': action,
        ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
      },
      body: JSON.stringify(body),
    });
  };

  const guardProxy = (): boolean => {
    if (!proxyUrl) {
      setError('Gemini proxy URL is not configured. Please set VITE_GEMINI_PROXY_URL.');
      return false;
    }
    return true;
  };

  const analyzeJobDescription = async (jdText: string) => {
    if (!guardProxy()) return null;
    setIsLoading(true);
    setError(null);

    const systemPrompt = `You are a technical recruiter and senior developer. Analyze this job description and return ONLY a valid JSON object with no markdown, no explanation, no backticks. Structure:
    {
      "extractedSkills": [{ "skill": "string", "priority": 5, "category": "Core/NiceToHave/RedFlag" }],
      "focusAreas": ["string"],
      "redFlags": ["string"],
      "estimatedDifficulty": "string (Junior, Mid-Level, Senior)",
      "roleTitle": "string",
      "companyType": "string"
    }`;

    try {
      const response = await callProxy('analyze', {
        contents: [{ parts: [{ text: `${systemPrompt}\n\nJob Description:\n${jdText}` }] }],
      });

      if (response.status === 429) {
        throw new Error('You have reached your daily limit of 5 analyses. Please try again tomorrow.');
      }
      if (!response.ok) throw new Error('Failed to reach Gemini proxy server');

      const data = await response.json();
      return cleanJsonResponse(data.candidates[0].content.parts[0].text);
    } catch (err: any) {
      console.error('Error parsing JD:', err);
      setError(err.message || 'Something went wrong');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const generateQuestions = async (roleTitle: string, skills: any[], focusAreas: string[], count: number = 15) => {
    if (!guardProxy()) return null;
    setIsLoading(true);
    setError(null);

    const systemPrompt = `You are a senior technical interviewer at a top tech company. 
    Generate exactly ${count} technical interview questions based on this role and skill list. 
    Return ONLY a valid JSON array. Do not wrap it in anything else.
    Each object inside the array must exactly look like this:
    {
      "question": "The question string",
      "idealAnswer": "A robust 3-5 sentence answer written in the first person or as a direct technical explanation, answering the question directly as a top candidate would (do NOT use meta-phrases like 'a strong answer would' or 'the candidate should explain').",
      "topic": "The general category name (e.g., RxJS, Database, UI Layout)",
      "difficulty": "Easy, Medium, or Hard",
      "type": "Conceptual, Practical, or Scenario"
    }`;

    const skillsSummary = skills.map(s => `${s.skill} (${s.category})`).join(', ');
    const contextMessage = `Role: ${roleTitle}\nSkills to cover: ${skillsSummary}\nFocus areas: ${focusAreas.join(', ')}`;

    try {
      const response = await callProxy('generate-questions', {
        contents: [{ parts: [{ text: `${systemPrompt}\n\nCandidate Prep Context:\n${contextMessage}` }] }],
      });
      if (response.status === 429) {
        throw new Error('You have reached your daily limit of questions. Please try again tomorrow.');
      }
      if (!response.ok) throw new Error(`Failed to generate ${count} interview questions.`);
      const data = await response.json();
      return cleanJsonResponse(data.candidates[0].content.parts[0].text);
    } catch (err: any) {
      console.error('Error creating questions:', err);
      setError(err.message || 'Failed to populate question deck.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Note: evaluateAnswer deliberately does NOT call setIsLoading — each Quiz
  // question manages its own `isEvaluating` state so that the global loading
  // flag (used by Analyze / Questions / StudyPlan) is never incorrectly set.
  const evaluateAnswer = async (
    question: string,
    idealAnswer: string,
    userAnswer: string
  ): Promise<{ score: number; feedback: string } | null> => {
    if (!guardProxy()) return null;
    setError(null);

    // Cap input length to prevent runaway token usage and reduce the surface
    // area for prompt-injection attacks embedded in a very long answer.
    const MAX_ANSWER_CHARS = 2000;
    const sanitisedAnswer = userAnswer.slice(0, MAX_ANSWER_CHARS);

    // XML delimiters in the prompt below prevent injected content (especially
    // in candidate_answer) from escaping its context and overriding instructions.
    const systemPrompt = `You are a strict but fair technical interview evaluator.

You will be given:
1. A technical interview question
2. The ideal reference answer
3. The candidate's actual answer

Your job is to score the candidate's answer on a scale of 1 to 5:
  1 — Completely wrong or blank
  2 — Major gaps; only superficial understanding shown
  3 — Partially correct; key concepts present but explanation is weak or incomplete
  4 — Mostly correct; minor omissions or imprecision only
  5 — Excellent; accurate, complete, and clearly explained

Rules:
- Be strict about technical accuracy, but reward correct intuition even if phrasing is imperfect.
- If the candidate's answer is blank, empty, or says anything equivalent to "I don't know" / "not sure" / "skip", the score MUST be 1 regardless of anything else.
- Do NOT invent information the candidate did not mention.
- Return ONLY a valid JSON object — no markdown, no backticks, no commentary.

Schema:
{
  "score": <integer 1–5>,
  "feedback": "<one sentence, max 25 words, explaining the score — start with what the candidate got right or wrong>"
}

<question>${question}</question>

<ideal_answer>${idealAnswer}</ideal_answer>

<candidate_answer>${sanitisedAnswer}</candidate_answer>`;

    try {
      const response = await callProxy('evaluate-answer', {
        contents: [{ parts: [{ text: systemPrompt }] }],
      });

      if (response.status === 429) {
        throw new Error('Evaluation limit reached. Please try again later.');
      }
      if (!response.ok) throw new Error('Failed to evaluate answer.');

      const data = await response.json();
      const parsed = cleanJsonResponse(data.candidates[0].content.parts[0].text);

      // Clamp and round: Gemini occasionally returns floats, out-of-range values,
      // or non-numeric types (null, undefined, "five"). Number() coerces strings
      // like "4" correctly; Number.isFinite guards against NaN reaching Firestore.
      const rawScore = Number(parsed.score);
      const score = Number.isFinite(rawScore)
        ? Math.min(5, Math.max(1, Math.round(rawScore)))
        : 1; // safe default: treat unparseable score as worst case
      const feedback = typeof parsed.feedback === 'string' ? parsed.feedback.trim() : 'No feedback provided.';

      return { score, feedback };
    } catch (err: any) {
      console.error('Error evaluating answer:', err);
      setError(err.message || 'Failed to evaluate your answer.');
      return null;
    }
  };

  const generateStudyPlan = async (roleTitle: string, weakTopics: string[], daysRemaining: number) => {
    if (!guardProxy()) return null;
    setIsLoading(true);
    setError(null);

    const systemPrompt = `You are an expert technical career coach. Create a ${daysRemaining}-day study plan for a ${roleTitle} role.

    The candidate is weakest in these topics: ${weakTopics.join(', ')}.

    Rules:
    - Return ONLY a valid JSON array. No markdown, no backticks, no commentary.
    - Return exactly ${daysRemaining} objects — one per day, no grouping.
    - Distribute day types roughly: 70% "review", 20% "mock", 10% "final". Use "final" only in the last 10% of days.
    - Prioritise weak topics early. Revisit them before mock days.
    - For each day's description: write 2-3 sentences covering what to study, a specific resource type, and one concrete practice task.

    Return this exact schema for every object:
    {
      "dayNumber": 1,
      "title": "Short catchy title (max 5 words)",
      "focusTopics": ["Topic 1", "Topic 2"],
      "type": "review",
      "description": "2-3 sentences: what to study, resource, practice task."
    }`;

    try {
      const response = await callProxy('generate-study-plan', {
        contents: [{ parts: [{ text: systemPrompt }] }],
      });
      if (response.status === 429) {
        throw new Error('You have reached your daily limit of 5 study plans. Please try again tomorrow.');
      }
      if (!response.ok) throw new Error(`Failed to generate study plan.`);
      const data = await response.json();
      return cleanJsonResponse(data.candidates[0].content.parts[0].text);
    } catch (err: any) {
      console.error('Error creating study plan:', err);
      setError(err.message || 'Failed to generate study plan.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { analyzeJobDescription, generateQuestions, generateStudyPlan, evaluateAnswer, isLoading, error };
};