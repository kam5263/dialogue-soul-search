// src/api/analysis.ts

const DOMAIN = 'http://localhost:8000'

export const fetchEmotionAnalysis = async (fileName: string) => {
  const response = await fetch(DOMAIN + `/nlp`);
  if (!response.ok) {
    throw new Error('Failed to fetch emotion analysis data');
  }
  return response.json();
};

export const fetchMetrics = async (fileName: string) => {
  const response = await fetch(DOMAIN + `/metrics/` + fileName);
  if (!response.ok) {
    throw new Error('Failed to fetch emotion analysis data');
  }
  return response.json();
};

export const fetchLLM = async (fileName: string) => {
  const response = await fetch(DOMAIN + `/llm/`);
  if (!response.ok) {
    throw new Error('Failed to fetch emotion analysis data');
  }
  return response.json();
};