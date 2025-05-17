
import React, { createContext, useContext, useState } from 'react';
import { AppState } from '../types';
import { generateMockAnalysisData } from '../utils/mockData';

// Define initial state
const initialState: AppState = {
  uploadedFile: null,
  userInfo: {
    user: { name: '', mbti: '', gender: '' },
    partner: { name: '', mbti: '', gender: '' },
  },
  analysisData: null,
  currentStep: 'upload',
  analysisTab: 'personality',
  isAnalyzing: false,
};

type AppContextType = {
  state: AppState;
  setUploadedFile: (file: File | null) => void;
  setUserInfo: (user: 'user' | 'partner', info: Partial<AppState['userInfo']['user']>) => void;
  goToStep: (step: AppState['currentStep']) => void;
  setAnalysisTab: (tab: AppState['analysisTab']) => void;
  startAnalysis: () => void;
  resetApp: () => void;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(initialState);

  const setUploadedFile = (file: File | null) => {
    setState((prev) => ({ ...prev, uploadedFile: file }));
  };

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

  const setAnalysisTab = (tab: AppState['analysisTab']) => {
    setState((prev) => ({ ...prev, analysisTab: tab }));
  };

  const startAnalysis = async () => {
    setState((prev) => ({ ...prev, isAnalyzing: true }));
    
    // Simulate API call with a delay
    setTimeout(() => {
      const mockData = generateMockAnalysisData(state.userInfo);
      
      setState((prev) => ({
        ...prev,
        analysisData: mockData,
        isAnalyzing: false,
        currentStep: 'analysis',
      }));
    }, 2000);
  };

  const resetApp = () => {
    setState(initialState);
  };

  const value = {
    state,
    setUploadedFile,
    setUserInfo,
    goToStep,
    setAnalysisTab,
    startAnalysis,
    resetApp,
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
