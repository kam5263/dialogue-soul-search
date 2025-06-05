import React, { useState } from 'react';
import WordCloudHeart from '../ui/WordCloudHeart';
import { CardTitle } from '@/components/ui/card';
import {
    PieChart, Pie, Cell,
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer
} from 'recharts';
import '@/ContentTab.css';

const pastelColors = ['#C4B5FD', '#6EE7B7', '#FCD34D', '#FCA5A5'];

const WordCloud = ({ words }: { words: { word: string; count: number }[] }) => {
    const maxCount = Math.max(...words.map(w => w.count));
    const getFontSize = (count: number) => 14 + (count / maxCount) * 24;
    return (
        <div className="relative h-64 bg-white rounded-xl p-4 border border-gray-200 shadow-md overflow-hidden">
            {words.map((w, i) => (
                <span
                    key={i}
                    style={{
                        position: 'absolute',
                        left: `${15 + Math.random() * 70}%`,
                        top: `${15 + Math.random() * 70}%`,
                        fontSize: `${getFontSize(w.count)}px`,
                        fontWeight: 500,
                        color: pastelColors[i % pastelColors.length],
                    }}
                >
                    {w.word}
                </span>
            ))}
            {[...Array(4)].map((_, i) => (
                <div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-red-200 opacity-70 animate-pulse-soft"
                    style={{
                        left: `${10 + Math.random() * 80}%`,
                        top: `${10 + Math.random() * 80}%`,
                    }}
                ></div>
            ))}
        </div>
    );
};

const GradientCard = ({ children, animateOnHover = false }: { children: React.ReactNode; animateOnHover?: boolean }) => (
    <div className={`rounded-2xl border border-gray-200 p-[1px] bg-white shadow-md transition-transform ${animateOnHover ? 'hover:scale-[1.015]' : ''}`}>
        <div className="bg-white rounded-[inherit] p-5">{children}</div>
    </div>
);

const ContentTab: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'user' | 'partner'>('user');

    const data = {
        wordFrequency: {
            user: [
                { word: '오늘', count: 34 },
                { word: '진짜', count: 30 },
                { word: '테스트', count: 21 },
                { word: '사진', count: 21 },
                { word: '언니', count: 18 }
            ],
            partner: [
                { word: '하나', count: 16 },
                { word: '사람', count: 16 },
                { word: '이모티콘', count: 15 },
                { word: '우리', count: 14 },
                { word: '수업', count: 12 }
            ]
        },
        topics: [
            { name: '일상', percentage: 0.4, color: '#60A5FA' },
            { name: '감정', percentage: 0.3, color: '#FCA5A5' },
            { name: '취미', percentage: 0.3, color: '#8B5CF6' }
        ],
        topicTimeline: {
            timestamps: ['월', '화', '수', '목', '금', '토', '일'],
            topics: {
                일상: [10, 20, 15, 30, 25, 10, 5],
                감정: [5, 10, 20, 15, 10, 30, 40],
                취미: [10, 5, 10, 15, 20, 25, 30]
            }
        }
    };

    const user = { name: '영희', mbti: 'INFP', gender: '여' };
    const partner = { name: '철수', mbti: 'ENTJ', gender: '남' };

    const topicTimelineData = data.topicTimeline.timestamps.map((timestamp, i) => {
        const point: any = { name: timestamp };
        for (const topic in data.topicTimeline.topics) {
            point[topic] = data.topicTimeline.topics[topic][i];
        }
        return point;
    });

    return (
        <div className="p-8 bg-white min-h-screen font-sans">
            <h2 className="text-2xl font-bold mb-6 text-black">💬 대화 내용 분석</h2>

            <GradientCard>
                <CardTitle className="text-lg font-semibold text-black flex items-center gap-2 mb-2">
                    <span>💖</span>자주 사용한 단어
                </CardTitle>
                <WordCloudHeart leftWords={data.wordFrequency.user} rightWords={data.wordFrequency.partner} />
                <div className="flex items-center justify-center gap-4 mt-3">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                        <span className="inline-block w-3 h-3 rounded-full bg-[#C084FC]" /> 영희
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                        <span className="inline-block w-3 h-3 rounded-full bg-[#34D399]" /> 철수
                    </div>
                </div>
            </GradientCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
                <GradientCard animateOnHover>
                    <CardTitle className="text-lg text-black mb-2">🧩 주요 대화 주제</CardTitle>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                className="transition-transform hover:scale-[1.03]"
                                data={data.topics}
                                dataKey="percentage"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                            >
                                {data.topics.map((entry, idx) => (
                                    <Cell key={`cell-${idx}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="text-sm text-blue-900 mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                        가장 많이 언급된 주제는 <b className="text-blue-600">{data.topics[0].name}</b>입니다.
                    </div>
                </GradientCard>

                <GradientCard>
                    <CardTitle className="text-lg text-black mb-2">📈 시간에 따른 주제 변화</CardTitle>
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={topicTimelineData} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey="name" tick={{ fill: '#4B5563' }} />
                            <YAxis tick={{ fill: '#4B5563' }} />
                            <Tooltip />
                            <Legend formatter={(value) => {
                                const colors: Record<string, string> = {
                                    일상: '#60A5FA',
                                    감정: '#FCA5A5',
                                    취미: '#8B5CF6',
                                };
                                return (
                                    <span
                                        className="transition-transform hover:scale-[1.1]"
                                        style={{
                                            display: 'inline-block',
                                            padding: '2px 12px',
                                            borderRadius: '9999px',
                                            backgroundColor: colors[value] || '#F3F4F6',
                                            color: '#1F2937',
                                            fontSize: '12px',
                                            fontWeight: 'bold'
                                        }}>
                                        {value}
                                    </span>
                                );
                            }} />
                            {Object.keys(data.topicTimeline.topics).map((topic) => (
                                <Line
                                    key={topic}
                                    type="monotone"
                                    dataKey={topic}
                                    stroke={data.topics.find(t => t.name === topic)?.color || "#8884d8"}
                                    strokeWidth={3}
                                    dot={{ r: 4 }}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </GradientCard>
            </div>

            <GradientCard animateOnHover>
                <CardTitle className="text-lg text-black mb-2">📝 대화 내용 총평</CardTitle>
                <div className="text-sm text-gray-700 leading-relaxed space-y-3">
                    <div className="bg-[#F5F5F5] text-[#4B5563] px-4 py-3 rounded-xl shadow-sm transition-transform hover:scale-[1.01]">
                        💬 두 사람의 대화는
                        <span className="font-semibold mx-1 text-[#60A5FA]">일상</span>,
                        <span className="font-semibold mx-1 text-[#FCA5A5]">감정</span>,
                        <span className="font-semibold mx-1 text-[#8B5CF6]">취미</span> 중심으로 이루어졌어요.
                    </div>
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="flex-1 bg-[#F3ECFF] text-[#6B21A8] px-4 py-3 rounded-xl shadow-sm transition-transform hover:scale-[1.01]">
                            <span className="font-semibold">{user.name}</span> 님은
                            <span className="font-semibold mx-1">"{data.wordFrequency.user[0].word}"</span>라는 단어를 가장 자주 사용했어요.
                        </div>
                        <div className="flex-1 bg-[#E1F8F4] text-[#047857] px-4 py-3 rounded-xl shadow-sm transition-transform hover:scale-[1.01]">
                            <span className="font-semibold">{partner.name}</span> 님은
                            <span className="font-semibold mx-1">"{data.wordFrequency.partner[0].word}"</span>라는 단어를 가장 자주 사용했어요.
                        </div>
                    </div>
                </div>
            </GradientCard>
        </div>
    );
};

export default ContentTab;