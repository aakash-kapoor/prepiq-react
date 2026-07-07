import { useState } from 'react';

export const useGemini = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
  // Read once at hook init — safe, this is just reading a constant env value.
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

  // Helper to strip markdown formatting backticks from AI string responses
  const cleanJsonResponse = (rawText: string) => {
    let cleanText = rawText.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.substring(7);
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.substring(3);
    }
    if (cleanText.endsWith('```')) {
      cleanText = cleanText.substring(0, cleanText.length - 3);
    }
    return JSON.parse(cleanText.trim());
  };

  // Method 1: Job Description Analyzer
  const analyzeJobDescription = async (jdText: string) => {
    if (!apiKey) {
      setError('Gemini API key is not configured. Please set VITE_GEMINI_API_KEY.');
      return null;
    }
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
      const response = await fetch(`${baseUrl}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemPrompt}\n\nJob Description:\n${jdText}` }] }]
        })
      });

      if (!response.ok) throw new Error('Failed to reach Gemini API');

      const data = await response.json();
      const textResponse = data.candidates[0].content.parts[0].text;
      return cleanJsonResponse(textResponse);
    } catch (err: any) {
      console.error('Error parsing JD:', err);
      setError(err.message || 'Something went wrong');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Method 2: Question Generator (With dynamic quantity capability)
  const generateQuestions = async (roleTitle: string, skills: any[], focusAreas: string[], count: number = 15) => {
    if (!apiKey) {
      setError('Gemini API key is not configured. Please set VITE_GEMINI_API_KEY.');
      return null;
    }
    setIsLoading(true);
    setError(null);
    
    // Injected the dynamic "count" directly into the core rules definition
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
      const response = await fetch(`${baseUrl}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemPrompt}\n\nCandidate Prep Context:\n${contextMessage}` }] }]
        })
      });
      if (!response.ok) throw new Error(`Failed to generate ${count} interview questions.`);
      const data = await response.json();
      const textResponse = data.candidates[0].content.parts[0].text;
      return cleanJsonResponse(textResponse);
    } catch (err: any) {
      console.error('Error creating questions:', err);
      setError(err.message || 'Failed to populate question deck.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  // Method 3: Study Plan Generator
  const generateStudyPlan = async (roleTitle: string, weakTopics: string[], daysRemaining: number) => {
    if (!apiKey) {
      setError('Gemini API key is not configured. Please set VITE_GEMINI_API_KEY.');
      return null;
    }
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
      const response = await fetch(`${baseUrl}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }]
        })
      });
      if (!response.ok) throw new Error(`Failed to generate study plan.`);
      const data = await response.json();
      const textResponse = data.candidates[0].content.parts[0].text;
      return cleanJsonResponse(textResponse);
    } catch (err: any) {
      console.error('Error creating study plan:', err);
      setError(err.message || 'Failed to generate study plan.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { analyzeJobDescription, generateQuestions, generateStudyPlan, isLoading, error };
};