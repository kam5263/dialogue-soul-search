import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    PieChart, Pie, Cell,
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer
} from 'recharts';

const pastelColors = ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

const WordCloud = ({ words }: { words: { word: string; count: number }[] }) => {
    const maxCount = Math.max(...words.map(w => w.count));
    const getFontSize = (count: number) => 14 + (count / maxCount) * 24;
    return (
        <div className="relative h-64 bg-white rounded-xl p-4 border border-gray-100 shadow-md overflow-hidden">
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
        </div>
    );
};

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
            { name: '일상', percentage: 0.4, color: '#3B82F6' },
            { name: '감정', percentage: 0.3, color: '#EF4444' },
            { name: '취미', percentage: 0.3, color: '#6366F1' }
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
        <div className="p-8 bg-[#F9FAFB] min-h-screen font-sans">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">💬 대화 내용 분석</h2>

            {/* 자주 사용한 단어 */}
            <Card className="mb-8 bg-white shadow-md rounded-2xl border border-gray-100">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-800">✨ 자주 사용한 단어</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="user" onValueChange={(val) => setActiveTab(val as 'user' | 'partner')}>
                        <TabsList className="mb-4 bg-gray-100 p-1 rounded-lg">
                            <TabsTrigger value="user">{user.name}</TabsTrigger>
                            <TabsTrigger value="partner">{partner.name}</TabsTrigger>
                        </TabsList>
                        <TabsContent value="user"><WordCloud words={data.wordFrequency.user} /></TabsContent>
                        <TabsContent value="partner"><WordCloud words={data.wordFrequency.partner} /></TabsContent>
                    </Tabs>
                    <div className="mt-4 text-sm text-gray-600">
                        {activeTab === 'user' ? (
                            <>
                                <b className="text-purple-600">{user.name}</b>님은{' '}
                                <b>{data.wordFrequency.user.slice(0, 3).map(w => w.word).join(', ')}</b> 등의 단어를 자주 사용합니다.
                            </>
                        ) : (
                            <>
                                <b className="text-green-600">{partner.name}</b>님은{' '}
                                <b>{data.wordFrequency.partner.slice(0, 3).map(w => w.word).join(', ')}</b> 등의 단어를 자주 사용합니다.
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* 주제 분석 및 변화 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <Card className="bg-white shadow-md rounded-2xl border border-gray-100">
                    <CardHeader><CardTitle className="text-lg text-gray-800">🧩 주요 대화 주제</CardTitle></CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
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
                        <div className="text-sm text-gray-600 mt-2">
                            가장 많이 언급된 주제는 <b className="text-blue-600">{data.topics[0].name}</b>입니다.
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white shadow-md rounded-2xl border border-gray-100">
                    <CardHeader><CardTitle className="text-lg text-gray-800">📈 시간에 따른 주제 변화</CardTitle></CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={topicTimelineData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                {Object.keys(data.topicTimeline.topics).map((topic) => (
                                    <Line
                                        key={topic}
                                        type="monotone"
                                        dataKey={topic}
                                        stroke={data.topics.find(t => t.name === topic)?.color || "#8884d8"}
                                        strokeWidth={2}
                                        dot={{ r: 3 }}
                                    />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* 총평 */}
            <Card className="bg-white shadow-md rounded-2xl border border-gray-100">
                <CardHeader><CardTitle className="text-lg text-gray-800">📝 대화 내용 총평</CardTitle></CardHeader>
                <CardContent>
                    <div className="text-sm text-gray-700 leading-relaxed">
                        두 사람의 대화는 <b>{data.topics.map(t => t.name).join(', ')}</b> 주제를 중심으로 이루어집니다.
                        <br />
                        <b className="text-purple-600">{user.name}</b>님은 <b>{data.wordFrequency.user[0].word}</b>,
                        <b className="text-green-600">{partner.name}</b>님은 <b>{data.wordFrequency.partner[0].word}</b>를 가장 자주 사용합니다.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ContentTab;
