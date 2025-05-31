
import React, { createContext, useContext, useState } from 'react';
import { AppState } from '../types';
import { generateMockAnalysisData } from '../utils/mockData';
import { parseJsonData } from '@/utils/parser'
import { fetchEmotionAnalysis, fetchLLM, fetchMetrics } from '@/api/analysis';
import { PartyPopper } from 'lucide-react';
import { API_URL } from '@/config.js';
// Define initial state
const initialState: AppState = {
  uploadedFile: null,
  fileName: null,
  userInfo: {
    user: { name: '', mbti: '', gender: ''},
    partner: { name: '', mbti: '', gender: ''},
  },
  predictedSpeakers: [],
  analysisData: null,
  currentStep: 'upload',
  analysisTab: 'personality',
  isAnalyzing: false,
};

type AppContextType = {
  state: AppState;
  setUserInfo: (user: 'user' | 'partner', info: Partial<AppState['userInfo']['user']>) => void;
  goToStep: (step: AppState['currentStep']) => void;
  goToStepWithFile: (step: AppState['currentStep'], file: File) => void;
  setAnalysisTab: (tab: AppState['analysisTab']) => void;
  startAnalysis: (id:number, file_name: string) => void;
    resetApp: () => void;
    setAnalysisData: (data: AppState['analysisData']) => void; 
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(initialState);

  const setUserInfo = (user: 'user' | 'partner', info: Partial<AppState['userInfo']['user']>) => {
    setState((prev) => ({
      ...prev,
      userInfo: {
        ...prev.userInfo,
        [user]: { ...prev.userInfo[user], ...info },
      },
    }));
  };

  const goToStep = (step: AppState['currentStep']) => {
    setState((prev) => ({ ...prev, currentStep: step }));
  };

    const goToStepWithFile = (step: AppState['currentStep'], file: File) => {
        const formData1 = new FormData();
        formData1.append('chat_file', file);

        const formData2 = new FormData();
        formData2.append('chat_file', file);

        // 기존 서버 업로드
        fetch(API_URL + '/file', {
            method: 'POST',
            body: formData1,
        })
            .then((res) => res.json())
            .then((result) => {
                const speakers = result.speakers;
                setState((prev) => ({
                    ...prev,
                    currentStep: step,
                    uploadedFile: file,
                    predictedSpeakers: speakers,
                    fileName: result.uploaded_filename,
                }));
            });
    };

  const setAnalysisTab = (tab: AppState['analysisTab']) => {
    setState((prev) => ({ ...prev, analysisTab: tab }));
  };
    const setAnalysisData = (data: AppState['analysisData']) => {
        setState((prev) => ({
            ...prev,
            analysisData: data,
        }));
    };

  const startAnalysis = async (id: number, file_name: string) => {
    setState((prev) => ({ ...prev, isAnalyzing: true }));

    const llmResult = await fetchLLM(id);
    const pattern = await fetchMetrics(id);

    const analysisData = {
      ...parseJsonData(llmResult.result),
      pattern,
    };    
    
    console.log("🎯 setState 직전 llmData.result:", analysisData);

    // 먼저 데이터만 설정하고
    setState((prev) => ({
      ...prev,
      analysisData: analysisData,
      isAnalyzing: false,
    }));

    // setTimeout 0을 통해 다음 렌더링 사이클로 밀어넣기
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        currentStep: 'analysis',
      }));
    }, 0);
    console.log("✅ 분석 상태 저장 완료");
  };

  const resetApp = () => {
    setState(initialState);
  };

  const value = {
    state,
    setUserInfo,
    goToStep,
    goToStepWithFile,
    setAnalysisTab,
    startAnalysis,
      resetApp,
      setAnalysisData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
