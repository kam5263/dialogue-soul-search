
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp } from '@/contexts/AppContext';
import { ChevronLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const mbtiOptions = [
  'ISTJ', 'ISFJ', 'INFJ', 'INTJ',
  'ISTP', 'ISFP', 'INFP', 'INTP',
  'ESTP', 'ESFP', 'ENFP', 'ENTP',
  'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'
];

const UserInfoPage: React.FC = () => {
  const { state, setUserInfo, goToStep, startAnalysis } = useApp();
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate user names (required)
    if (!state.userInfo.user.name.trim()) {
      toast({
        title: "입력 오류",
        description: "사용자 이름을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }
    
    if (!state.userInfo.partner.name.trim()) {
      toast({
        title: "입력 오류",
        description: "상대방 이름을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }
    
    // Start the analysis
    startAnalysis();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 animate-fade-in">
      <Card className="w-full max-w-md p-6 shadow-card">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => goToStep('upload')}
            className="mr-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">사용자 정보 입력</h1>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* User Section */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h2 className="text-lg font-medium mb-3 text-blue-800">나의 정보</h2>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="userName">이름 (필수)</Label>
                  <Input
                    id="userName"
                    placeholder="사용자 이름"
                    value={state.userInfo.user.name}
                    onChange={(e) => setUserInfo('user', { name: e.target.value })}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="userMbti">MBTI (선택)</Label>
                    <Select
                      value={state.userInfo.user.mbti || ""}
                      onValueChange={(value) => setUserInfo('user', { mbti: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">선택 안함</SelectItem>
                        {mbtiOptions.map((option) => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="userGender">성별 (선택)</Label>
                    <Select
                      value={state.userInfo.user.gender || ""}
                      onValueChange={(value: any) => setUserInfo('user', { gender: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">선택 안함</SelectItem>
                        <SelectItem value="male">남성</SelectItem>
                        <SelectItem value="female">여성</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Partner Section */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h2 className="text-lg font-medium mb-3 text-purple-800">상대방 정보</h2>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="partnerName">이름 (필수)</Label>
                  <Input
                    id="partnerName"
                    placeholder="상대방 이름"
                    value={state.userInfo.partner.name}
                    onChange={(e) => setUserInfo('partner', { name: e.target.value })}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="partnerMbti">MBTI (선택)</Label>
                    <Select
                      value={state.userInfo.partner.mbti || ""}
                      onValueChange={(value) => setUserInfo('partner', { mbti: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">선택 안함</SelectItem>
                        {mbtiOptions.map((option) => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="partnerGender">성별 (선택)</Label>
                    <Select
                      value={state.userInfo.partner.gender || ""}
                      onValueChange={(value: any) => setUserInfo('partner', { gender: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">선택 안함</SelectItem>
                        <SelectItem value="male">남성</SelectItem>
                        <SelectItem value="female">여성</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={state.isAnalyzing}>
              {state.isAnalyzing ? '분석중...' : '분석하기'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default UserInfoPage;
