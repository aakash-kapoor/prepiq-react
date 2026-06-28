import { useState } from 'react';

export const useGemini = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent';
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

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
    setIsLoading(true);
    setError(null);
    
    // Injected the dynamic "count" directly into the core rules definition
    const systemPrompt = `You are a senior technical interviewer at a top tech company. 
    Generate exactly ${count} technical interview questions based on this role and skill list. 
    Return ONLY a valid JSON array. Do not wrap it in anything else.
    Each object inside the array must exactly look like this:
    {
      "question": "The question string",
      "idealAnswer": "A robust 3-5 sentence answer detailing what a great candidate would say.",
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
  return { analyzeJobDescription, generateQuestions, isLoading, error };
};