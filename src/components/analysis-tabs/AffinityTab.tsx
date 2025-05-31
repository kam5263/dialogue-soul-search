
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, UserRound, ArrowLeft, ArrowRight } from 'lucide-react';

const AffinityTab: React.FC = () => {
  const { state } = useApp();
  const data = state.analysisData!;
  const { user, partner } = state.userInfo;
  
  const [animatedScore1, setAnimatedScore1] = useState(0);
  const [animatedScore2, setAnimatedScore2] = useState(0);

  // Calculate push-pull percentage for display
  const userPushPullPercentage = data.pattern.mildang_index[user.name]
  // 호감도 코멘트
  const parsedComments = data.likability_comments.map(comment => {
    const [title, content] = comment.split("\n");
    return { title, content };
  });
  //호감도 데이터
  const userScore = parseInt(data.likability_score.user);
  const partnerScore = parseInt(data.likability_score.partner);

  const getUserAffinityComment = (score) => {
    if(score >= 80) return '상대방에게 매우 높은 호감을 가지고 있습니다.';
    else if(score >= 60) return '상대방에게 호감을 가지고 있습니다.';
    else if(score >= 40) return '상대방에게 보통 수준의 호감을 가지고 있습니다.';
    else return '상대방에게 낮은 수준의 호감을 가지고 있습니다.';
  }

  const getPartnerAffinityComment = (score) => {
    if(score >= 80) return '당신에게 매우 높은 호감을 가지고 있습니다.';
    else if(score >= 60) return '당신에게 호감을 가지고 있습니다.';
    else if(score >= 40) return '당신에게 보통 수준의 호감을 가지고 있습니다.';
    else return '당신에게 낮은 수준의 호감을 가지고 있습니다.';
  }
  
  const userData = {
    name: user.name,
    score: userScore,
    message: getUserAffinityComment(userScore),
    color: 'indigo'
  };
  
  const partnerData = {
    name: partner.name,
    score: partnerScore,
    message: getPartnerAffinityComment(partnerScore),
    color: 'emerald'
  };

  // 애니메이션 효과
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore1(userData.score);
      setAnimatedScore2(partnerData.score);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);


  const getScoreColor = (score) => {
    if (score >= 80) return { bg: 'from-pink-500 to-rose-500', text: 'text-pink-600', glow: 'pink' };
    else if (score >= 60) return { bg: 'from-orange-500 to-amber-500', text: 'text-orange-600', glow: 'orange' };
    else if (score >= 40) return { bg: 'from-yellow-500 to-orange-500', text: 'text-yellow-600', glow: 'yellow' };
    return { bg: 'from-gray-400 to-gray-500', text: 'text-gray-600', glow: 'gray' };
  };

  const getScoreEmoji = (score) => {
    if (score >= 80) return '💖';
    else if (score >= 60) return '😊';
    else if (score >= 40) return '🙂';
    return '😐';
  };

  const getScoreText = (score) => {
    if (score >= 80) return '매우 높음';
    if (score >= 60) return '높음';
    if (score >= 40) return '보통';
    return '낮음';
  };

    const GaugeChart = ({ data, animatedScore, isLeft }) => {
    const colors = data.color === 'indigo' ? 
      { primary: 'indigo', secondary: 'purple' } : 
      { primary: 'emerald', secondary: 'teal' };
    
    const scoreColor = getScoreColor(data.score);
    const circumference = 2 * Math.PI * 45;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (animatedScore / 100) * circumference;
    const gradientId = `gradient-${data.name.replace(/\s+/g, '-')}-${data.color}`;

    return (
      <div className={`group relative ${isLeft ? 'animate-fade-in-left' : 'animate-fade-in-right'}`}>
        {/* 메인 카드 */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 transition-all duration-300 hover:shadow-2xl hover:scale-105">
          {/* 헤더 */}
          <div className="text-center mb-6">
            <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r ${
              colors.primary === 'indigo' ? 'from-indigo-100 to-purple-100' : 'from-emerald-100 to-teal-100'
            }`}>
              <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${
                colors.primary === 'indigo' ? 'from-indigo-500 to-purple-500' : 'from-emerald-500 to-teal-500'
              } flex items-center justify-center text-white font-bold text-sm`}>
                {data.name.charAt(0)}
              </div>
              <span className="font-semibold text-gray-800">{data.name}의 호감도</span>
            </div>
          </div>

          {/* 게이지 차트 */}
          <div className="relative flex justify-center mb-6">
            <div className="relative">
              {/* 배경 원 */}
              <svg width="160" height="160" className="transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="45"
                  stroke="rgba(229, 231, 235, 0.3)"
                  strokeWidth="8"
                  fill="transparent"
                  className="drop-shadow-sm"
                />
                {/* 프로그레스 원 */}
                <circle
                  cx="80"
                  cy="80"
                  r="45"
                  stroke={`url(#${gradientId})`}
                  strokeWidth="8"
                  fill="transparent"
                  strokeLinecap="round"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-2000 ease-out drop-shadow-lg"
                  style={{
                    filter: `drop-shadow(0 0 10px rgba(${colors.primary === 'indigo' ? '99, 102, 241' : '16, 185, 129'}, 0.5))`
                  }}
                />
                <defs>
                  <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={colors.primary === 'indigo' ? '#6366F1' : '#10B981'} />
                    <stop offset="100%" stopColor={colors.primary === 'indigo' ? '#A855F7' : '#059669'} />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* 중앙 컨텐츠 */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-4xl mb-1 animate-bounce">
                  {getScoreEmoji(data.score)}
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-1">
                  {animatedScore}점
                </div>
                <div className={`text-sm font-medium px-3 py-1 rounded-full bg-gradient-to-r ${scoreColor.bg} text-white shadow-lg`}>
                  {getScoreText(data.score)}
                </div>
              </div>
            </div>
          </div>

          {/* 메시지 */}
          <div className={`p-4 rounded-2xl bg-gradient-to-r ${
            colors.primary === 'indigo' ? 'from-indigo-50 to-purple-50' : 'from-emerald-50 to-teal-50'
          } border ${
            colors.primary === 'indigo' ? 'border-indigo-100' : 'border-emerald-100'
          }`}>
            <div className="flex items-start gap-3">
              <div className="text-xl">💭</div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {data.message}
              </p>
            </div>
          </div>
        </div>

        {/* 플로팅 파티클 효과 */}
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full animate-ping opacity-30"></div>
        <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full animate-ping opacity-30 animation-delay-1000"></div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-2xl font-bold">💖 호감도 분석</h2>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8 mb-4">
            <GaugeChart data={userData} animatedScore={animatedScore1} isLeft={true} />
            <GaugeChart data={partnerData} animatedScore={animatedScore2} isLeft={false} />
          </div>
        </CardContent>  
      </Card>
      {/* Push-Pull Index (Tug of War Style) */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-2xl font-bold">🙌🏼 밀당 지수</h2>
        </CardHeader>
        <CardContent>
          <div className="mb-4 bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 transition-all duration-300 hover:shadow-2xl hover:scale-105">

            {/* Tug of war visualization with avatars on the sides */}
            <div className="relative my-8">
              {/* User side (left) */}
              <div className="flex items-center absolute left-0 top-1/2 -translate-y-2/3">
                <div className="relative flex flex-col items-center">
                  <Avatar className="h-12">
                    <AvatarImage src="/user.png" alt={`${user.name} 아바타`} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium mt-1 text-blue-600">{user.name}</span>
                </div>
              </div>
              
              {/* Partner side (right) */}
              <div className="flex items-center absolute right-0 top-1/2 -translate-y-2/3">
                <div className="relative flex flex-col items-center">                  
                  <Avatar className="h-12">
                    <AvatarImage src="/partner.png" alt={`${partner.name} 아바타`} />
                    <AvatarFallback>{partner.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium mt-1 text-purple-600">{partner.name}</span>
                </div>
              </div>
              
              {/* The rope (progress bar) */}
              <div className="mx-16 mb-2"> {/* Add margin to make space for avatars */}
                <div className="relative h-6">
                  {/* Base track */}
                  <div className="h-6 w-full bg-gray-200 rounded-full">
                    {/* User's pull */}
                    <div 
                      className="absolute left-0 h-full bg-blue-500 rounded-l-full transition-all duration-500"
                      style={{ width: `${userPushPullPercentage}%` }}
                    >                      
                    </div>
                    
                    {/* Partner's pull */}
                    <div 
                      className="absolute right-0 h-full bg-purple-500 rounded-r-full transition-all duration-500"
                      style={{ width: `${100 - userPushPullPercentage}%` }}
                    >                      
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between text-xs mt-2">
                  <span className="pl-1">{userPushPullPercentage}%</span>
                  <span className="pr-1">{100 - userPushPullPercentage}%</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              {Math.abs(data.pattern.mildang_index[user.name] - data.pattern.mildang_index[partner.name] ) > 30 ? (
                <div className="bg-amber-50 backdrop-blur-sm rounded-3xl p-4 text-amber-800">
                  <p className="font-medium">밀당 불균형이 감지되었습니다</p>
                  <p className="text-sm mt-1">
                    대화의 주도권이 {data.pattern.mildang_index[user.name] > data.pattern.mildang_index[partner.name] ? user.name : partner.name}에게 많이 치우쳐 있습니다. 
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
      
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">💡 관계 인사이트</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 transition-all duration-300 hover:shadow-2xl hover:scale-105">
            {parsedComments.map((c, i) => (
              <div key={i} className={`p-4 rounded-3xl ${i === 0 ? 'bg-blue-50' : i === 1 ? 'bg-purple-50' : 'bg-indigo-50'}`}>
                <h3 className="font-medium mb-2 text-gray-800">{c.title}</h3>
                <p className="text-sm text-gray-600">{c.content}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AffinityTab;
