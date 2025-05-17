
import React from 'react';
import { AppProvider } from '@/contexts/AppContext';
import { useApp } from '@/contexts/AppContext';
import FileUploadPage from '@/components/FileUploadPage';
import UserInfoPage from '@/components/UserInfoPage';
import AnalysisPage from '@/components/AnalysisPage';

// AppContent component to use the context
const AppContent = () => {
  const { state } = useApp();
  
  // Render different pages based on the current step
  switch (state.currentStep) {
    case 'upload':
      return <FileUploadPage />;
    case 'info':
      return <UserInfoPage />;
    case 'analysis':
      return <AnalysisPage />;
    default:
      return <FileUploadPage />;
  }
};

// Main index component with context provider
const Index = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default Index;
