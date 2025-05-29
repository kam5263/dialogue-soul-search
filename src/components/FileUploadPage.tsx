import React, { useState, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Upload } from 'lucide-react';

const FileUploadPage: React.FC = () => {
    const { goToStepWithFile } = useApp();
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            setFile(e.target.files[0]);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files.length > 0) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleClickArea = () => {
        inputRef.current?.click();
    };

    const handleNext = () => {
        if (!file) {
            alert('파일을 업로드해주세요.');
            return;
        }
        goToStepWithFile('info', file);
    };

    return (
        <div className="flex items-center justify-center bg-[#FFF7F5] font-sans px-4">
            <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-xl text-center">
                {/* 제목 */}
                <h1 className="text-pink-600 text-3xl font-bold mb-1">
                    카카오톡 대화 분석 연구소
                </h1>
                <p className="text-gray-600 mb-6 text-base">
                    우리 대화 속 숨겨진 감정을 발견해 보세요 ✨
                </p>

                {/* 업로드 박스 */}
                <div
                    className={`border-2 border-dashed rounded-xl p-8 mb-4 transition-all duration-200 cursor-pointer mx-auto ${isDragging ? 'border-pink-500 bg-pink-50' : 'border-pink-300'
                        }`}
                    onClick={handleClickArea}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragEnter={() => setIsDragging(true)}
                    onDragLeave={() => setIsDragging(false)}
                    style={{ maxWidth: '440px' }}
                >
                    <div className="flex flex-col items-center">
                        <Upload size={40} className="text-pink-500 mb-2" />
                        <div className="text-pink-600 font-bold text-lg mb-1">
                            대화 파일을 업로드 해 주세요
                        </div>
                        <p className="text-sm text-gray-500">
                            파일을 <span className="text-pink-500 font-medium">Drag&amp;Drop</span> 하거나 클릭하여 업로드하세요
                        </p>
                        <input
                            ref={inputRef}
                            type="file"
                            accept=".txt"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        {file && (
                            <div className="mt-4 bg-green-50 p-2 rounded border border-green-300 text-sm text-green-700">
                                ✅ <b>{file.name}</b> 업로드 완료!
                            </div>
                        )}
                    </div>
                </div>
                <p className="text-[11px]">
                    카카오톡 대화 파일 내보내는 방법
                </p>
                <p className="text-[11px] text-gray-400 mb-6">
                    카카오톡 &gt; 채팅방 &gt; 메뉴 &gt; 대화 내보내기 &gt; 텍스트(.txt)
                </p>

                {/* 다음 단계 버튼 */}
                {file && (
                    <button
                        onClick={handleNext}
                        className="bg-pink-300 hover:bg-pink-400 text-white font-medium py-2 w-48 rounded-full mt-2"
                    >
                        다음 단계
                    </button>
                )}
            </div>
        </div>
    );
};

export default FileUploadPage;
