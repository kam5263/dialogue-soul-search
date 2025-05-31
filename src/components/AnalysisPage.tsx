
import React, { useRef } from 'react';
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
import html2canvas from "html2canvas";

const AnalysisPage: React.FC = () => {
  const { state, goToStep, setAnalysisTab } = useApp();

  const personalityRef = useRef<HTMLDivElement>(null);
  const affinityRef = useRef<HTMLDivElement>(null);
  const patternRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  const captureAllTabs = async () => {
    const refs = [
      { ref: personalityRef, name: "성향 분석" },
      { ref: affinityRef, name: "호감도 분석" },
      { ref: patternRef, name: "대화 패턴" },
      { ref: contentRef, name: "대화 내용" },
      { ref: summaryRef, name: "맞춤형 솔루션" }
    ];

    for (const { ref, name } of refs) {
      if (ref.current) {
        const canvas = await html2canvas(ref.current, {
          scale: 2, // 고화질
        });
        const imgData = canvas.toDataURL("image/png");

        const link = document.createElement("a");
        link.href = imgData;
        link.download = `${name}.png`;
        link.click();
      }
    }
  }
  
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
        {/* <p className="text-gray-500 mt-1" style={{marginLeft: "48px"}}>
              {state.userInfo.user.name}님과 {state.userInfo.partner.name}님의 대화 분석 결과입니다.
            </p> */}
        {/* 결과 제목 + 공유 버튼 영역 */}
<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
  <div className="flex items-center justify-between">
    <Button 
      variant="ghost" 
      size="icon"
      onClick={() => goToStep('info')}
      className="mr-2"
    >
      <ArrowLeft className="h-5 w-5" />
    </Button>
    <div>
      <h1 className="text-2xl md:text-3xl font-bold">
        대화 분석 결과
      </h1>
      <p className="text-gray-500 mt-1 hidden md:block">
        {state.userInfo.user.name}님과 {state.userInfo.partner.name}님의 대화 분석 결과입니다.
      </p>
    </div>
    {/* 📱 모바일용: 현재 탭 공유하기 */}
    <Button
      onClick={async () => {
        const tabRefMap = {
          personality: personalityRef,
          affinity: affinityRef,
          pattern: patternRef,
          content: contentRef,
          summary: summaryRef,
        };
        const ref = tabRefMap[state.analysisTab];
        if (ref?.current) {
          const canvas = await html2canvas(ref.current, { scale: 2 });
          const blob = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob((b) => resolve(b), "image/png")
          );
          if (!blob) return;
          const file = new File([blob], `${state.analysisTab}.png`, { type: "image/png" });

          if (navigator.canShare?.({ files: [file] })) {
            await navigator.share({
              title: "Heart Insight 결과",
              text: "우리 대화 분석 결과야!",
              files: [file],
            });
          } else {
            alert("공유를 지원하지 않는 브라우저입니다.");
          }
        }
      }}
      className="ml-2 bg-[#FFF7F5] text-black border border-[#FFDACF] rounded-full text-sm font-medium px-3 py-1.5 hover:bg-[#ffeae4] transition md:hidden"
    >
      현재 탭 공유하기
    </Button>
  </div>

  {/* 💻 데스크탑용: 전체 탭 이미지 저장 */}
  <Button
    onClick={captureAllTabs}
    className="bg-[#FFF7F5] text-black border border-[#FFDACF] rounded-full text-sm font-medium px-4 py-2 hover:bg-[#ffeae4] transition hidden md:block"
  >
    전체 탭 이미지 저장
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
        {/* 숨겨진 탭 콘텐츠 - 실제로는 렌더링됨 */}
        <div style={{ position: "absolute", top: 0, left: "-9999px" }}>
          <div ref={personalityRef}><PersonalityTab /></div>
          <div ref={affinityRef}><AffinityTab /></div>
          <div ref={patternRef}><PatternTab /></div>
          <div ref={contentRef}><ContentTab /></div>
          <div ref={summaryRef}><SummaryTab /></div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
