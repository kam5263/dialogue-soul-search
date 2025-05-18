
import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar } from '@/components/ui/avatar';
import { User, UserRound } from 'lucide-react';

const AffinityTab: React.FC = () => {
  const { state } = useApp();
  const data = state.analysisData!;
  const { user, partner } = state.userInfo;
  
  // Calculate push-pull percentage for display
  const userPushPullPercentage = data.pushPullIndex.user;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">호감도 분석</h2>
      
      {/* Affinity Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{user.name}의 호감도</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">호감도 점수</span>
              <span className="text-lg font-bold">{data.affinityScores.user}점</span>
            </div>
            <Progress value={data.affinityScores.user} className="h-3" />
            
            <div className="mt-6 pt-4 border-t">
              <h4 className="font-medium text-sm mb-2">호감도 수준</h4>
              <div className="bg-blue-50 px-4 py-3 rounded-lg">
                {data.affinityScores.user >= 80 && (
                  <p className="text-blue-800">상대방에게 매우 높은 호감을 가지고 있습니다.</p>
                )}
                {data.affinityScores.user >= 60 && data.affinityScores.user < 80 && (
                  <p className="text-blue-800">상대방에게 호감을 가지고 있습니다.</p>
                )}
                {data.affinityScores.user >= 40 && data.affinityScores.user < 60 && (
                  <p className="text-blue-800">상대방에게 보통 수준의 호감을 가지고 있습니다.</p>
                )}
                {data.affinityScores.user < 40 && (
                  <p className="text-blue-800">상대방에게 낮은 수준의 호감을 가지고 있습니다.</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{partner.name}의 호감도</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">호감도 점수</span>
              <span className="text-lg font-bold">{data.affinityScores.partner}점</span>
            </div>
            <Progress value={data.affinityScores.partner} className="h-3" />
            
            <div className="mt-6 pt-4 border-t">
              <h4 className="font-medium text-sm mb-2">호감도 수준</h4>
              <div className="bg-purple-50 px-4 py-3 rounded-lg">
                {data.affinityScores.partner >= 80 && (
                  <p className="text-purple-800">당신에게 매우 높은 호감을 가지고 있습니다.</p>
                )}
                {data.affinityScores.partner >= 60 && data.affinityScores.partner < 80 && (
                  <p className="text-purple-800">당신에게 호감을 가지고 있습니다.</p>
                )}
                {data.affinityScores.partner >= 40 && data.affinityScores.partner < 60 && (
                  <p className="text-purple-800">당신에게 보통 수준의 호감을 가지고 있습니다.</p>
                )}
                {data.affinityScores.partner < 40 && (
                  <p className="text-purple-800">당신에게 낮은 수준의 호감을 가지고 있습니다.</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Push-Pull Index (Single Line with Icons) */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">밀당 지수</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-6">
              밀당 지수는 대화에서 주도권과 적극성을 나타냅니다. 
              높은 값은 대화를 주도하고 먼저 시작하는 경향을, 낮은 값은 반응하는 경향을 의미합니다.
            </p>
            
            <div className="flex items-center justify-between mb-1">
              {/* User avatar */}
              <div className="flex flex-col items-center">
                <Avatar className="h-12 w-12 bg-blue-100 border-2 border-blue-400">
                  {user.gender === 'male' ? (
                    <User className="h-6 w-6 text-blue-600" />
                  ) : user.gender === 'female' ? (
                    <UserRound className="h-6 w-6 text-blue-600" />
                  ) : (
                    <UserRound className="h-6 w-6 text-blue-600" />
                  )}
                </Avatar>
                <span className="text-xs font-medium mt-1 text-blue-600">{user.name}</span>
              </div>
              
              {/* Partner avatar */}
              <div className="flex flex-col items-center">
                <Avatar className="h-12 w-12 bg-purple-100 border-2 border-purple-400">
                  {partner.gender === 'male' ? (
                    <User className="h-6 w-6 text-purple-600" />
                  ) : partner.gender === 'female' ? (
                    <UserRound className="h-6 w-6 text-purple-600" />
                  ) : (
                    <UserRound className="h-6 w-6 text-purple-600" />
                  )}
                </Avatar>
                <span className="text-xs font-medium mt-1 text-purple-600">{partner.name}</span>
              </div>
            </div>
            
            {/* Single progress bar for push-pull index */}
            <div className="relative mb-2 mt-4">
              <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${userPushPullPercentage}%` }}
                />
              </div>
              
              {/* Overlay element to create dual color effect */}
              <div 
                className="absolute top-0 right-0 h-full bg-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${100 - userPushPullPercentage}%` }}
              />
              
              {/* Percentage labels */}
              <div className="flex justify-between text-xs mt-1">
                <span>{userPushPullPercentage}%</span>
                <span>{100 - userPushPullPercentage}%</span>
              </div>
            </div>
            
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>수동적/반응형</span>
              <span>적극적/주도형</span>
            </div>
            
            <div className="mt-8">
              {Math.abs(data.pushPullIndex.user - data.pushPullIndex.partner) > 30 ? (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800">
                  <p className="font-medium">밀당 불균형이 감지되었습니다</p>
                  <p className="text-sm mt-1">
                    대화의 주도권이 {data.pushPullIndex.user > data.pushPullIndex.partner ? user.name : partner.name}에게 많이 치우쳐 있습니다. 
                    더 균형있는 대화를 위해 서로의 대화 방식을 조정해보세요.
                  </p>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
                  <p className="font-medium">밀당 균형이 잘 맞습니다</p>
                  <p className="text-sm mt-1">
                    대화의 주도권이 균형있게 분배되어 있어 건강한 대화 관계를 유지하고 있습니다.
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Core Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">관계 인사이트</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">응답 패턴</h3>
              <p className="text-sm">{data.insights.responsePatterns}</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-medium text-purple-800 mb-2">최적 시간대</h3>
              <p className="text-sm">{data.insights.optimalTimes}</p>
            </div>
            
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="font-medium text-indigo-800 mb-2">관계 균형</h3>
              <p className="text-sm">{data.insights.relationshipBalance}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AffinityTab;
