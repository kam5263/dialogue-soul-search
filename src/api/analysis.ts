// src/api/analysis.ts
export const fetchEmotionAnalysis = async (fileName: string) => {
  const response = await fetch(`http://localhost:9000/nlp`);
  if (!response.ok) {
    throw new Error('Failed to fetch emotion analysis data');
  }
  return response.json();
};
