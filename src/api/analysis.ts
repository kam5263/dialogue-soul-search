// src/api/analysis.ts
import { API_URL } from '@/config.js';
//const DOMAIN = 'https://sogang-heart-insight-bo-production.up.railway.app'
const DOMAIN = API_URL

export const fetchEmotionAnalysis = async (fileName: string) => {
  const response = await fetch(DOMAIN + `/nlp/sample`);
  if (!response.ok) {
    throw new Error('Failed to fetch emotion analysis data');
  }
  return response.json();
};


export const fetchMetrics = async (fileName: string) => {
  const response = await fetch(DOMAIN + `/pattern/` + fileName);
  if (!response.ok) {
    throw new Error('Failed to fetch emotion analysis data');
  }
  return response.json();
};

export const fetchTopic = async (fileName: string) => {
  const response = await fetch(DOMAIN + `/topic/` + fileName);
  //const response = await fetch(DOMAIN + `/topic/`);
  if (!response.ok) {
    throw new Error('Failed to fetch emotion analysis data');
  }
  return response.json();
};

export const fetchLLM = async (id: number) => {
  const response = await fetch(DOMAIN + `/analyze-mbti/` + id);
  //const response = await fetch(DOMAIN + `/llm/sample`);
  if (!response.ok) {
    throw new Error('Failed to fetch emotion analysis data');
  }
  return response.json();
};