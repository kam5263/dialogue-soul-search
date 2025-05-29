
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from '@/contexts/AppContext';
import { ArrowLeft, Brain, Heart, MessageSquare, BarChart2, CheckSquare, Lightbulb } from 'lucide-react';
import PersonalityTab from './analysis-tabs/PersonalityTab';
import AffinityTab from './analysis-tabs/AffinityTab';
import PatternTab from './analysis-tabs/PatternTab';
import ContentTab from './analysis-tabs/ContentTab';
import SummaryTab from './analysis-tabs/SummaryTab';

const AnalysisPage: React.FC = () => {
  const { state, goToStep, setAnalysisTab, resetApp } = useApp();
  
  if (state.isAnalyzing) {
    return <div className="text-center p-6 text-gray-500">분석 중입니다...</div>;
  }
  
  if (!state.analysisData) {
    console.log('⚠️ state.analysisData is null in AnalysisPage:', state);
    return <div>분석 데이터가 없습니다.</div>;
  }
  
  const handleTabChange = (value: string) => {
    setAnalysisTab(value as any);
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-6 lg:p-8 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => goToStep('info')}
                className="mr-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl md:text-3xl font-bold">
                대화 분석 결과
              </h1>
            </div>
            <p className="text-gray-500 mt-1" style={{marginLeft: "48px"}}>
              {state.userInfo.user.name}님과 {state.userInfo.partner.name}님의 대화 분석 결과입니다.
            </p>
          </div>
          
          <Button variant="outline" onClick={resetApp}>
            새 분석 시작하기
          </Button>
        </div>
        
        <Tabs 
          defaultValue="personality" 
          value={state.analysisTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <div className="rounded-lg p-4 mb-6 shadow-lg overflow-x-auto">
            <TabsList className="grid grid-cols-5 gap-2 !overflow-visible" >
              <TabsTrigger value="personality" className="flex items-center gap-2">
                <Brain className="h-4 w-4" /> <span className="hidden md:inline">성향 분석</span><span className="md:hidden">성향</span>
              </TabsTrigger>
              <TabsTrigger value="affinity" className="flex items-center gap-2">
                <Heart className="h-4 w-4" /> <span className="hidden md:inline">호감도 분석</span><span className="md:hidden">호감도</span>
              </TabsTrigger>
              <TabsTrigger value="pattern" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" /> <span className="hidden md:inline">대화 패턴</span><span className="md:hidden">패턴</span>
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4" /> <span className="hidden md:inline">대화 내용</span><span className="md:hidden">내용</span>
              </TabsTrigger>
              <TabsTrigger value="summary" className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" /> <span className="hidden md:inline">맞춤형 솔루션</span><span className="md:hidden">요약</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <Card className="shadow-card">
            <TabsContent value="personality" className="m-0">
              <PersonalityTab />
            </TabsContent>
            
            <TabsContent value="affinity" className="m-0">
              <AffinityTab />
            </TabsContent>
            
            <TabsContent value="pattern" className="m-0">
              <PatternTab />
            </TabsContent>
            
            <TabsContent value="content" className="m-0">
              <ContentTab />
            </TabsContent>
            
            <TabsContent value="summary" className="m-0">
              <SummaryTab />
            </TabsContent>
          </Card>
        </Tabs>
      </div>
    </div>
  );
};

export default AnalysisPage;
