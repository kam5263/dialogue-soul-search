import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Clock } from 'lucide-react';
import { fetchMetrics } from '@/api/analysis';
import classNames from "classnames";
import type { TimeLabel } from '@/types/index.ts'

const PatternTab: React.FC = () => {
  const { state } = useApp();
  const data = state.analysisData!;
  const { user, partner } = state.userInfo;

  // Prepare message ratio data for pie chart
  const messageRatioData = [
    { name: user.name, value: data.pattern.message_ratio[user.name] ?? 0 },
    { name: partner.name, value: data.pattern.message_ratio[partner.name] ?? 0 }
  ];

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
      <h2 className="text-2xl font-bold mb-6">대화 패턴 분석</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Message Ratio Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">메시지 비율</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center ">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={messageRatioData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {messageRatioData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-gray-500 text-sm">
                {user.name}님이 전체 대화의 <strong>{data.pattern.message_ratio[user.name]}%</strong>를,<br />
                {partner.name}님이 <strong>{data.pattern.message_ratio[partner.name]}%</strong>를 차지하고 있습니다.
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Response Time Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">평균 응답 시간</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <div className="text-center">
                    <Clock className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                    <span className="block text-xl font-bold text-blue-600">{userTime}분</span>
                  </div>
                </div>
                <p className="text-sm text-center">{user.name}</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <div className="text-center">
                    <Clock className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                    <span className="block text-xl font-bold text-purple-600">{partnerTime}분</span>
                  </div>
                </div>
                <p className="text-sm text-center">{partner.name}</p>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <h4 className="font-medium text-sm mb-2">응답 패턴 분석</h4>
              {userTime < partnerTime ? (
                <p className="text-sm bg-blue-50 p-3 rounded">
                  {user.name}님이 {partner.name}님보다 평균 {(partnerTime - userTime).toFixed(1)}분 더 빠르게 응답하고 있습니다.
                </p>
              ) : userTime > partnerTime ? (
                <p className="text-sm bg-purple-50 p-3 rounded">
                  {partner.name}님이 {user.name}님보다 평균 {(userTime - partnerTime).toFixed(1)}분 더 빠르게 응답하고 있습니다.
                </p>
              ) : (
                <p className="text-sm bg-green-50 p-3 rounded">
                  두 사람의 응답 시간이 유사하여 대화의 호흡이 잘 맞는 것으로 보입니다.
                </p>
              )}

            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Time Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">🕒 시간대별 활동 패턴 분석</CardTitle>
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
