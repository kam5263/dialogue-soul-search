import React, { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';

interface Props {
    uploadedFile: File | null;
}

const UploadPage: React.FC<Props> = ({ uploadedFile }) => {
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (uploadedFile) {
            setShowToast(true);
            const timer = setTimeout(() => setShowToast(false), 3000); // 3초 후 숨김
            return () => clearTimeout(timer);
        }
    }, [uploadedFile]);

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
                        className="w-full mb-3 px-3 py-2 rounded border text-sm bg-white text-black"
                    />
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="block text-xs font-semibold mb-1">MBTI (선택)</label>
                            <select className="w-full px-3 py-2 rounded border text-sm bg-white text-black">
                                <option>선택</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-semibold mb-1">성별 (선택)</label>
                            <select className="w-full px-3 py-2 rounded border text-sm bg-white text-black">
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
                        className="w-full mb-3 px-3 py-2 rounded border text-sm bg-white text-black"
                    />
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="block text-xs font-semibold mb-1">MBTI (선택)</label>
                            <select className="w-full px-3 py-2 rounded border text-sm bg-white text-black">
                                <option>선택</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-semibold mb-1">성별 (선택)</label>
                            <select className="w-full px-3 py-2 rounded border text-sm bg-white text-black">
                                <option>선택</option>
                                <option>남성</option>
                                <option>여성</option>
                            </select>
                        </div>
                    </div>
                </div>

                <button className="w-full py-2 rounded-full bg-pink-400 text-white font-semibold hover:bg-pink-500 transition">
                    분석하기
                </button>

                {/* Toast 메시지: 3초 후 사라짐 */}
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
