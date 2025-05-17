
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
      <h2 className="text-2xl font-bold mb-6">요약 및 추천</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Overall Summary */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">분석 요약</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
              <h3 className="font-medium text-lg mb-4">
                {user.name}님과 {partner.name}님의 대화 분석 결과
              </h3>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  <span className="font-medium">MBTI 성향:</span> {user.name}님은 {data.predictedMbti.user} 타입,
                  {partner.name}님은 {data.predictedMbti.partner} 타입으로 예측됩니다.
                </p>
                
                <p>
                  <span className="font-medium">호감도:</span> {user.name}님은 {data.affinityScores.user}점,
                  {partner.name}님은 {data.affinityScores.partner}점으로 
                  {Math.abs(data.affinityScores.user - data.affinityScores.partner) <= 10 ? 
                    '서로 비슷한 수준의 호감을 가지고 있습니다.' : 
                    `${data.affinityScores.user > data.affinityScores.partner ? user.name : partner.name}님의 호감도가 더 높습니다.`}
                </p>
                
                <p>
                  <span className="font-medium">대화 패턴:</span> {user.name}님이 {data.messageRatio.user}%,
                  {partner.name}님이 {data.messageRatio.partner}%의 메시지를 주고 받으며,
                  평균 응답 시간은 {user.name}님이 {data.responseTime.user}분, {partner.name}님이 {data.responseTime.partner}분입니다.
                </p>
                
                <p>
                  <span className="font-medium">주요 주제:</span> 주로 {data.topics.slice(0, 3).map(t => t.name).join(', ')}에 대한 
                  대화가 이루어지고 있습니다.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
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
