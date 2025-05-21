
import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Clock, MessageSquare, Target, Lightbulb } from 'lucide-react';

const SummaryTab: React.FC = () => {
  const { state } = useApp();
  const data = state.analysisData!;
  const { user, partner } = state.userInfo;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">맞춤형 솔루션</h2>
      
      {/* Custom Solutions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">맞춤형 솔루션</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mt-1 mr-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-800 mb-1">최적 시간대 제안</h4>
                  <p className="text-sm">{data.solutions.timing}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-start">
                <div className="bg-purple-100 p-2 rounded-full mt-1 mr-3">
                  <Target className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-purple-800 mb-1">행동 제안</h4>
                  <p className="text-sm">{data.solutions.actions}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mt-1 mr-3">
                  <Lightbulb className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-green-800 mb-1">주제 제안</h4>
                  <p className="text-sm">{data.solutions.topics}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-amber-50 p-4 rounded-lg">
              <div className="flex items-start">
                <div className="bg-amber-100 p-2 rounded-full mt-1 mr-3">
                  <MessageSquare className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-medium text-amber-800 mb-1">응답 패턴 제안</h4>
                  <p className="text-sm">{data.solutions.responses}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Action Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">맞춤형 액션 플랜</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            {user.name}님과 {partner.name}님의 관계를 개선하기 위한 구체적인 실천 계획입니다.
          </p>
          
          <div className="space-y-3">
            {data.actionPlan.map((action, index) => (
              <div key={index} className="flex items-start bg-gray-50 p-3 rounded-md">
                <div className="bg-primary p-1 rounded-full mr-3 mt-0.5">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <p className="text-sm flex-1">{action}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryTab;
