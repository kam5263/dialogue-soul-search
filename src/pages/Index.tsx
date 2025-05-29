
import React from 'react';
import { AppProvider } from '@/contexts/AppContext';
import { useApp } from '@/contexts/AppContext';
import FileUploadPage from '@/components/FileUploadPage';
import UserInfoPage from '@/components/UserInfoPage';
import AnalysisPage from '@/components/AnalysisPage';
//import UploadPage from '@/pages/UploadPage';
//import FileUploadPage from '@/pages/FileUploadPage';

// 🧠 헤더 컴포넌트 추가
const Header = () => {
  return (
<header className="p-2 text-sm text-gray-500 bg-gray-50 border-b border-gray-200">
  ❤️ Heart Insight
</header>

  );
};
// AppContent component to use the context
const AppContent = () => {
  const { state } = useApp();
  
  // Render different pages based on the current step
  switch (state.currentStep) {
    case 'upload':
      return <FileUploadPage  />;
    case 'info':
      return <UserInfoPage uploadedFile={state.uploadedFile} />;
    case 'analysis':
      return <AnalysisPage />;
    default:
      return <FileUploadPage />;
  }
};

const Layout = () => {
  const { state } = useApp();

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Header />
      <div className="flex-1 flex items-center">
        <div className="w-full">
          <AppContent />
        </div>
      </div>
    </div>
  );
};
// Main index component with context provider
const Index = () => {
  return (
    <AppProvider>
      <Layout />
    </AppProvider>
  );
};

export default Index;
