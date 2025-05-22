
import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Upload } from 'lucide-react';

const FileUploadPage: React.FC = () => {
    const { goToStepWithFile } = useApp();
    const [step, setStep] = useState(1);
    const [file, setFile] = useState<File | null>(null);


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            setFile(e.target.files[0]);
        }
    };

    const handleNext = () => {
        if (!file) {
            alert('파일을 업로드해주세요.');
            return;
        }
        //setStep(2); // 다음 페이지로 이동
        goToStepWithFile('info', file);
    };

    // STEP 2: 사용자 정보 입력 페이지
    //if (step === 2) {
        //return <UploadPage uploadedFile={file} />;
        //goToStep('info');
    //}

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF7F5] font-sans">
            <div className="bg-white p-10 rounded-2xl shadow-xl w-96 text-center">
                <h1 className="text-pink-600 text-2xl font-bold mb-2">대화 분석기</h1>
                <p className="text-sm text-gray-600 mb-6">
                    카카오톡 대화 내용을 분석하여 상대방과의 관계와 대화 패턴을 알아보세요
                </p>

                <div className="border-2 border-dashed border-pink-300 rounded-xl p-6 mb-6">
                    <Upload size={32} className="mx-auto mb-2 text-pink-500" />
                    <label htmlFor="fileInput" className="cursor-pointer text-pink-600 font-semibold">
                        카카오톡 대화 파일 업로드
                    </label>
                    <input
                        id="fileInput"
                        type="file"
                        accept=".txt"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                        파일을 드래그하거나 클릭하여 업로드하세요
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">
                        카카오톡 &gt; 채팅방 &gt; 메뉴 &gt; 대화 내보내기 &gt; 텍스트(.txt)
                    </p>
                </div>

                <button
                    onClick={handleNext}
                    className="bg-pink-300 hover:bg-pink-400 text-white font-medium py-2 w-full rounded-full"
                >
                    다음 단계
                </button>
            </div>
        </div>
  );
};

export default FileUploadPage;
