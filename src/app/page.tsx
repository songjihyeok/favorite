'use client';

import { useState } from 'react';
import { IdealTypeOptions } from '@/lib/promptBuilder';

export default function Home() {
  // 폼 상태
  const [formData, setFormData] = useState<IdealTypeOptions>({
    gender: '',
    age: '',
    bodyType: '',
    style: '',
    personality: '',
    faceType: '',
    customText: '',
  });

  // UI 상태
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);

  // 폼 입력 핸들러
  const handleInputChange = (field: keyof IdealTypeOptions, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 이미지 생성 핸들러
  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setGeneratedImage(null);
    setGeneratedPrompt(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || '이미지 생성에 실패했습니다.');
      }

      setGeneratedImage(data.imageUrl);
      setGeneratedPrompt(data.prompt);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 이미지 다운로드 핸들러
  const handleDownload = async () => {
    if (!generatedImage) return;

    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ideal-type-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('이미지 다운로드에 실패했습니다.');
    }
  };

  // 폼 초기화
  const handleReset = () => {
    setFormData({
      gender: '',
      age: '',
      bodyType: '',
      style: '',
      personality: '',
      faceType: '',
      customText: '',
    });
    setGeneratedImage(null);
    setGeneratedPrompt(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      {/* 헤더 */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            ✨ 이상형 이미지 생성기
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-300 mt-2 text-sm sm:text-base">
            AI가 당신의 이상형을 그려드립니다
          </p>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 왼쪽: 입력 폼 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
              이상형 특징 선택
            </h2>

            <div className="space-y-5">
              {/* 성별 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  성별 *
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">선택하세요</option>
                  <option value="남성">남성</option>
                  <option value="여성">여성</option>
                  <option value="중성">중성</option>
                </select>
              </div>

              {/* 나이 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  나이대 *
                </label>
                <select
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">선택하세요</option>
                  <option value="10대">10대</option>
                  <option value="20대">20대</option>
                  <option value="30대">30대</option>
                  <option value="40대">40대</option>
                </select>
              </div>

              {/* 체형 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  체형 *
                </label>
                <select
                  value={formData.bodyType}
                  onChange={(e) => handleInputChange('bodyType', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">선택하세요</option>
                  <option value="마른">마른</option>
                  <option value="보통">보통</option>
                  <option value="탄탄한">탄탄한</option>
                  <option value="근육질">근육질</option>
                </select>
              </div>

              {/* 스타일 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  스타일 *
                </label>
                <select
                  value={formData.style}
                  onChange={(e) => handleInputChange('style', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">선택하세요</option>
                  <option value="캐주얼">캐주얼</option>
                  <option value="포멀">포멀</option>
                  <option value="스트리트">스트리트</option>
                  <option value="스포티">스포티</option>
                  <option value="빈티지">빈티지</option>
                  <option value="미니멀">미니멀</option>
                </select>
              </div>

              {/* 성격 (테토 vs 에겐) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  성격 *
                </label>
                <select
                  value={formData.personality}
                  onChange={(e) => handleInputChange('personality', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">선택하세요</option>
                  <option value="테토">테토 (온화하고 부드러운 성격)</option>
                  <option value="에겐">에겐 (강렬하고 카리스마 있는 성격)</option>
                  <option value="혼합">혼합형</option>
                </select>
              </div>

              {/* 얼굴형 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  얼굴형 *
                </label>
                <select
                  value={formData.faceType}
                  onChange={(e) => handleInputChange('faceType', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">선택하세요</option>
                  <option value="계란형">계란형</option>
                  <option value="둥근형">둥근형</option>
                  <option value="각진형">각진형</option>
                  <option value="긴형">긴형</option>
                </select>
              </div>

              {/* 커스텀 텍스트 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  추가 설명 (선택, 30자 이내)
                </label>
                <input
                  type="text"
                  maxLength={30}
                  value={formData.customText}
                  onChange={(e) => handleInputChange('customText', e.target.value)}
                  placeholder="예: 긴 생머리, 미소가 예쁜"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {formData.customText.length}/30자
                </p>
              </div>
            </div>

            {/* 버튼 */}
            <div className="mt-8 space-y-3">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    생성 중... (약 30초 소요)
                  </span>
                ) : (
                  '✨ 이상형 생성하기'
                )}
              </button>
              <button
                onClick={handleReset}
                disabled={loading}
                className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                🔄 초기화
              </button>
            </div>
          </div>

          {/* 오른쪽: 결과 표시 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
              생성 결과
            </h2>

            <div className="space-y-4">
              {/* 에러 메시지 */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-red-700 dark:text-red-300 text-sm">
                    ⚠️ {error}
                  </p>
                </div>
              )}

              {/* 로딩 상태 */}
              {loading && (
                <div className="flex flex-col items-center justify-center py-16 space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-purple-200 dark:border-purple-900 border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin"></div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    AI가 이미지를 생성하고 있습니다...
                  </p>
                  <p className="text-gray-500 dark:text-gray-500 text-xs">
                    약 30~60초 정도 소요됩니다
                  </p>
                </div>
              )}

              {/* 생성된 이미지 */}
              {generatedImage && !loading && (
                <div className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img
                      src={generatedImage}
                      alt="Generated ideal type"
                      className="w-full h-auto"
                    />
                  </div>

                  {/* 다운로드 버튼 */}
                  <button
                    onClick={handleDownload}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    💾 이미지 다운로드
                  </button>
                </div>
              )}

              {/* 초기 상태 */}
              {!generatedImage && !loading && !error && (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                  <div className="text-6xl">🎨</div>
                  <p className="text-gray-500 dark:text-gray-400">
                    왼쪽 폼을 작성하고<br />
                    이상형을 생성해보세요!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 안내 사항 */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
            📌 이용 안내
          </h3>
          <ul className="text-xs text-blue-800 dark:text-blue-300 space-y-1">
            <li>• 모든 필수 항목(*)을 선택해주세요.</li>
            <li>• 이미지 생성에는 약 30~60초가 소요됩니다.</li>
            <li>• NSFW 콘텐츠는 자동으로 필터링됩니다.</li>
            <li>• 생성된 이미지는 AI가 만든 것으로 실제 인물이 아닙니다.</li>
          </ul>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="mt-16 py-6 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>Powered by Stable Diffusion & Next.js</p>
      </footer>
    </div>
  );
}
