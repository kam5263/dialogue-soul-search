import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Clock } from 'lucide-react';
import type { TimeLabel } from '@/types/index.ts'

const PatternTab: React.FC = () => {
  const { state } = useApp();
  const data = state.analysisData!;
  const { user, partner } = state.userInfo;

  // Prepare message ratio data for pie chart
  const userRatio = data.pattern.message_ratio[user.name];
  const partnerRatio = data.pattern.message_ratio[partner.name];
  const userTime = data.pattern.avg_reply_time[user.name] ?? 0;
  const partnerTime = data.pattern.avg_reply_time[partner.name] ?? 0;
  
  const COLORS = ['#3B82F6', '#8B5CF6'];

  const timeLabels: TimeLabel[] = [
    "새벽(00~06시)",
    "오전(06~12시)",
    "오후(12~18시)",
    "밤(18~00시)"
  ];
  const timeBlocks = ["🌙 새벽", "☀️ 오전", "🕒 오후", "🌆 밤"];

  const userTimeData = data.pattern.timeframe_ratio[user.name]
  const partnerTimeData = data.pattern.timeframe_ratio[partner.name]
  const timeData = {
    A: { "🌙 새벽": userTimeData?.[timeLabels[0]], "☀️ 오전": userTimeData?.[timeLabels[1]], "🕒 오후": userTimeData?.[timeLabels[2]], "🌆 밤": userTimeData?.[timeLabels[3]] },
    B: { "🌙 새벽": partnerTimeData?.[timeLabels[0]], "☀️ 오전": partnerTimeData?.[timeLabels[1]], "🕒 오후": partnerTimeData?.[timeLabels[2]], "🌆 밤": partnerTimeData?.[timeLabels[3]] }
  }

  const getUserName = (u) => u === 'A' ? user.name : partner.name;

  const getGradientStyle = (value, speaker) => {
    const intensity = Math.max(0.1, value / 100);
    if (speaker === 'A') {
      return {
        background: `linear-gradient(135deg, rgba(99, 102, 241, ${intensity}) 0%, rgba(168, 85, 247, ${intensity * 0.8}) 100%)`,
        boxShadow: `0 4px 20px rgba(99, 102, 241, ${intensity * 0.3})`
      };
    } else {
      return {
        background: `linear-gradient(135deg, rgba(16, 185, 129, ${intensity}) 0%, rgba(5, 150, 105, ${intensity * 0.8}) 100%)`,
        boxShadow: `0 4px 20px rgba(16, 185, 129, ${intensity * 0.3})`
      };
    }
  };

  const getTimeIcon = (block) => {
    switch(block) {
      case "🌙 새벽": return "🌙";
      case "☀️ 오전": return "☀️";
      case "🕒 오후": return "🕒";
      case "🌆 밤": return "🌆";
      default: return "⏰";
    }
  };
  
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Message Ratio Card */}
        <Card>
          <CardHeader>
            <CardTitle><h2 className="text-2xl font-bold">✉ 메시지 비율</h2></CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center ">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8">
              {/* Main VS Container */}
              <div className="relative bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-2xl p-0.5 shadow-2xl">
                <div className="flex items-center bg-white rounded-2xl overflow-hidden">
                  
                  {/* Left Side - Indigo */}
                  <div className="flex-1 bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700 p-6 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                    <div className="relative z-10 text-center">
                      <div className="flex items-center justify-center mb-2">
                        <span className="text-lg font-bold">{user.name}</span>
                      </div>
                      <div className="text-3xl font-black tracking-tight">{userRatio}%</div>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/5 rounded-full"></div>
                    <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-white/5 rounded-full"></div>
                  </div>

                  {/* VS Circle */}
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                    <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-gray-100">
                      <span className="text-gray-600 font-bold text-sm">VS</span>
                    </div>
                  </div>

                  {/* Right Side - Emerald */}
                  <div className="flex-1 bg-gradient-to-bl from-emerald-500 via-emerald-600 to-emerald-700 p-6 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-bl from-white/10 to-transparent"></div>
                    <div className="relative z-10 text-center">
                      <div className="flex items-center justify-center mb-2">
                        <span className="text-lg font-bold">{partner.name}</span>
                      </div>
                      <div className="text-3xl font-black tracking-tight">{partnerRatio}%</div>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute -top-4 -left-4 w-16 h-16 bg-white/5 rounded-full"></div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white/5 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Progress Bar Effect */}
              <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-1000 ease-out" 
                    style={{width: '100%'}}></div>
              </div>

              {/* Animated particles effect */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-4 left-8 w-1 h-1 bg-indigo-300 rounded-full animate-pulse"></div>
                <div className="absolute top-8 right-12 w-1 h-1 bg-emerald-300 rounded-full animate-pulse delay-300"></div>
                <div className="absolute bottom-6 left-16 w-1 h-1 bg-indigo-400 rounded-full animate-pulse delay-700"></div>
                <div className="absolute bottom-4 right-8 w-1 h-1 bg-emerald-400 rounded-full animate-pulse delay-1000"></div>
              </div>

              <div className="mt-4 text-center">
                <p className="text-gray-500 text-sm">
                  {user.name}님이 전체 대화의 <strong>{userRatio}%</strong>를,<br />
                  {partner.name}님이 <strong>{partnerRatio}%</strong>를 차지하고 있습니다.
                </p>
              </div>
            </div>         
            
          </CardContent>
        </Card>
        
        {/* Response Time Card */}
        <Card>
          <CardHeader>
            <CardTitle><h2 className="text-2xl font-bold">⏰ 평균 응답 시간</h2></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8">
        
              {/* Response Time Grid */}
              <div className="grid grid-cols-2 gap-6">
                {/* Left Side - User (Indigo) */}
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 via-indigo-50 to-indigo-100 flex items-center justify-center mb-4 shadow-lg border border-indigo-200/50 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                    <div className="text-center relative z-10">
                      <Clock className="h-6 w-6 text-indigo-600 mx-auto mb-1" />
                      <span className="block text-xl font-black text-indigo-600 tracking-tight">{userTime}분</span>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-indigo-200/30 rounded-full"></div>
                  </div>
                  <p className="text-sm text-center font-medium text-gray-700">{user.name}</p>
                </div>
                
                {/* Right Side - Partner (Emerald) */}
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-bl from-emerald-100 via-emerald-50 to-emerald-100 flex items-center justify-center mb-4 shadow-lg border border-emerald-200/50 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-bl from-white/20 to-transparent"></div>
                    <div className="text-center relative z-10">
                      <Clock className="h-6 w-6 text-emerald-600 mx-auto mb-1" />
                      <span className="block text-xl font-black text-emerald-600 tracking-tight">{partnerTime}분</span>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute -top-2 -left-2 w-8 h-8 bg-emerald-200/30 rounded-full"></div>
                  </div>
                  <p className="text-sm text-center font-medium text-gray-700">{partner.name}</p>
                </div>
              </div>
              
              {/* Analysis Section */}
              <div className="pt-6 border-gray-100">                
                {userTime < partnerTime ? (
                  <div className="bg-gradient-to-r from-indigo-50 to-indigo-100/50 p-4 rounded-xl border border-indigo-200/50 relative overflow-hidden text-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"></div>
                    <p className="text-sm relative z-10 text-indigo-800 font-medium">
                      {user.name}님이 {partner.name}님보다 평균 <span className="font-black text-indigo-700">{(partnerTime - userTime).toFixed(1)}분</span> 더 빠르게 <br></br>응답하고 있습니다.
                    </p>
                  </div>
                ) : userTime > partnerTime ? (
                  <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 p-4 rounded-xl border border-emerald-200/50 relative overflow-hidden text-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"></div>
                    <p className="text-sm relative z-10 text-emerald-800 font-medium">
                      {partner.name}님이 {user.name}님보다 평균 <span className="font-black text-emerald-700">{(userTime - partnerTime).toFixed(1)}분</span> 더 빠르게 <br></br>응답하고 있습니다.
                    </p>
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 p-4 rounded-xl border border-gray-200/50 relative overflow-hidden text-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"></div>
                    <p className="text-sm relative z-10 text-gray-800 font-medium">
                      두 사람의 응답 시간이 유사하여 <span className="font-black text-gray-700">대화의 호흡이 잘 맞는</span> 것으로 보입니다.
                    </p>
                  </div>
                )}
              </div>

              {/* Animated particles effect */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-12 left-16 w-1 h-1 bg-indigo-300 rounded-full animate-pulse"></div>
                <div className="absolute top-20 right-16 w-1 h-1 bg-emerald-300 rounded-full animate-pulse delay-300"></div>
                <div className="absolute bottom-20 left-20 w-1 h-1 bg-indigo-400 rounded-full animate-pulse delay-700"></div>
                <div className="absolute bottom-12 right-20 w-1 h-1 bg-emerald-400 rounded-full animate-pulse delay-1000"></div>
              </div>
            </div>
          </CardContent>
        </Card>


      </div>
      
      {/* Time Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle><h2 className="text-2xl font-bold">🕒 시간대별 활동 패턴 분석</h2></CardTitle>
        </CardHeader>
        <CardContent>
          {/* 메인 카드 */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8">
          <div className="space-y-8">
            {["A", "B"].map((speaker, userIndex) => (
              <div key={speaker} className="group">
                {/* 사용자 헤더 */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ${
                    speaker === 'A' 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500' 
                      : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                  }`}>
                    {speaker}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{getUserName(speaker)}</h3>
                    <p className="text-sm text-gray-500">활동 패턴 분석</p>
                  </div>
                </div>

                {/* 히트맵 그리드 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {timeBlocks.map((block, index) => {
                    const value = timeData[speaker][block];
                    const style = getGradientStyle(value, speaker);
                    
                    return (
                      <div
                        key={block}
                        className="group/item relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 cursor-pointer"
                        style={style}
                        title={`${block} 활동 비율: ${value}%`}
                      >
                        {/* 배경 패턴 */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                        
                        {/* 컨텐츠 */}
                        <div className="relative p-6 text-center">
                          <div className="text-3xl mb-2 group-hover/item:scale-110 transition-transform duration-200">
                            {getTimeIcon(block)}
                          </div>
                          <div className="text-sm font-medium text-gray-700 mb-1">
                            {block.split(' ')[1]}
                          </div>
                          <div className="text-2xl font-bold text-gray-800">
                            {value}%
                          </div>
                        </div>

                        {/* 호버 효과 */}
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/item:opacity-100 transition-opacity duration-200"></div>
                        
                        {/* 글로우 효과 */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/item:opacity-100 blur transition-opacity duration-300"></div>
                      </div>
                    );
                  })}
                </div>

                {/* 구분선 (마지막 사용자가 아닌 경우) */}
                {userIndex < 1 && (
                  <div className="mt-8 flex items-center">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                    <div className="mx-4 text-gray-400 text-sm">VS</div>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatternTab;
