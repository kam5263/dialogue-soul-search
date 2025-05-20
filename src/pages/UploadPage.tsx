import React, { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';

interface Props {
    uploadedFile: File | null;
}

const UploadPage: React.FC<Props> = ({ uploadedFile }) => {
    const [showToast, setShowToast] = useState(false);

    // 사용자 정보 상태
    const [myName, setMyName] = useState('');
    const [myMbti, setMyMbti] = useState('');
    const [myGender, setMyGender] = useState('');
    const [partnerName, setPartnerName] = useState('');
    const [partnerMbti, setPartnerMbti] = useState('');
    const [partnerGender, setPartnerGender] = useState('');

    useEffect(() => {
        if (uploadedFile) {
            setShowToast(true);
            const timer = setTimeout(() => setShowToast(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [uploadedFile]);

    const handleAnalyze = async () => {
        if (!uploadedFile || !myName || !partnerName) {
            alert('필수 항목을 모두 입력해주세요.');
            return;
        }

        const formData = new FormData();
        formData.append('chat_file', uploadedFile);
        formData.append('my_name', myName);
        formData.append('my_mbti', myMbti);
        formData.append('my_gender', myGender);
        formData.append('partner_name', partnerName);
        formData.append('partner_mbti', partnerMbti);
        formData.append('partner_gender', partnerGender);

        try {
            //server에 POST 요청 파이썬 Flask 서버
            const res = await fetch('http://localhost:5000/analyze', {
                method: 'POST',
                body: formData, //파일 + 사용자정보
            });

            const data = await res.json();
            console.log('서버 응답:', data);
            alert('분석 완료');
        } catch (err) {
            console.error(err);
            alert('서버 연결에 실패했습니다.');
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-[#FFF7F5] font-sans"
            style={{ fontFamily: '"Noto Sans KR", sans-serif' }}
        >
            <div className="bg-white p-8 rounded-2xl shadow-lg w-[400px]">
                <div className="flex items-center mb-6">
                    <ChevronLeft className="mr-2 text-gray-500" />
                    <h2 className="text-xl font-bold">사용자 정보 입력</h2>
                </div>

                {/* 나의 정보 */}
                <div className="bg-blue-50 rounded-xl p-4 mb-4">
                    <h3 className="text-sm font-semibold text-blue-700 mb-2">나의 정보</h3>
                    <label className="block text-xs font-semibold mb-1">이름 (필수)</label>
                    <input
                        type="text"
                        placeholder="사용자 이름"
                        value={myName}
                        onChange={(e) => setMyName(e.target.value)}
                        className="w-full mb-3 px-3 py-2 rounded border text-sm bg-white text-black"
                    />
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="block text-xs font-semibold mb-1">MBTI (선택)</label>
                            <select value={myMbti} onChange={(e) => setMyMbti(e.target.value)} className="w-full px-3 py-2 rounded border text-sm bg-white text-black">
                                <option>선택</option>
                                <option>INTJ</option>
                                <option>INTP</option>
                                <option>ENTJ</option>
                                <option>ENTP</option>
                                <option>INFJ</option>
                                <option>INFP</option>
                                <option>ENFJ</option>
                                <option>ENFP</option>
                                <option>ISTJ</option>
                                <option>ISFJ</option>
                                <option>ESTJ</option>
                                <option>ESFJ</option>
                                <option>ISTP</option>
                                <option>ISFP</option>
                                <option>ESTP</option>
                                <option>ESFP</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-semibold mb-1">성별 (선택)</label>
                            <select value={myGender} onChange={(e) => setMyGender(e.target.value)} className="w-full px-3 py-2 rounded border text-sm bg-white text-black">
                                <option>선택</option>
                                <option>남성</option>
                                <option>여성</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 상대방 정보 */}
                <div className="bg-purple-50 rounded-xl p-4 mb-6">
                    <h3 className="text-sm font-semibold text-purple-700 mb-2">상대방 정보</h3>
                    <label className="block text-xs font-semibold mb-1">이름 (필수)</label>
                    <input
                        type="text"
                        placeholder="상대방 이름"
                        value={partnerName}
                        onChange={(e) => setPartnerName(e.target.value)}
                        className="w-full mb-3 px-3 py-2 rounded border text-sm bg-white text-black"
                    />
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="block text-xs font-semibold mb-1">MBTI (선택)</label>
                            <select value={partnerMbti} onChange={(e) => setPartnerMbti(e.target.value)} className="w-full px-3 py-2 rounded border text-sm bg-white text-black">
                                <option>선택</option>
                                <option>INTJ</option>
                                <option>INTP</option>
                                <option>ENTJ</option>
                                <option>ENTP</option>
                                <option>INFJ</option>
                                <option>INFP</option>
                                <option>ENFJ</option>
                                <option>ENFP</option>
                                <option>ISTJ</option>
                                <option>ISFJ</option>
                                <option>ESTJ</option>
                                <option>ESFJ</option>
                                <option>ISTP</option>
                                <option>ISFP</option>
                                <option>ESTP</option>
                                <option>ESFP</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-semibold mb-1">성별 (선택)</label>
                            <select value={partnerGender} onChange={(e) => setPartnerGender(e.target.value)} className="w-full px-3 py-2 rounded border text-sm bg-white text-black">
                                <option>선택</option>
                                <option>남성</option>
                                <option>여성</option>
                            </select>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleAnalyze}
                    className="w-full py-2 rounded-full bg-pink-400 text-white font-semibold hover:bg-pink-500 transition"
                >
                    분석하기
                </button>

                {/* Toast 메시지 */}
                {showToast && (
                    <div className="fixed bottom-4 right-4 bg-white border rounded-lg shadow-md px-4 py-2 text-sm text-gray-800 animate-fade-in">
                        <p className="font-semibold">파일 업로드 성공</p>
                        <p className="text-xs text-gray-500">파일이 성공적으로 업로드되었습니다.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadPage;
