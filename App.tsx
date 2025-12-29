
import React, { useState, useCallback } from 'react';
import { generateMathQuiz } from './services/geminiService';
import { Question, QuizState, QuizStatus } from './types';
import QuizCard from './components/QuizCard';
import ScoreSummary from './components/ScoreSummary';

const App: React.FC = () => {
  const [state, setState] = useState<QuizState>({
    questions: [],
    currentQuestionIndex: 0,
    userAnswers: Array(10).fill(null),
    status: 'idle',
    topic: '',
  });

  const [error, setError] = useState<string | null>(null);

  const handleStartQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.topic.trim()) return;

    setState(prev => ({ ...prev, status: 'loading' }));
    setError(null);

    try {
      const questions = await generateMathQuiz(state.topic);
      setState(prev => ({
        ...prev,
        questions,
        status: 'quiz',
        currentQuestionIndex: 0,
        userAnswers: Array(questions.length).fill(null),
      }));
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi tạo đề. Vui lòng thử lại.");
      setState(prev => ({ ...prev, status: 'idle' }));
    }
  };

  const handleSelectAnswer = (answerIndex: number) => {
    setState(prev => {
      const newAnswers = [...prev.userAnswers];
      newAnswers[prev.currentQuestionIndex] = answerIndex;
      return { ...prev, userAnswers: newAnswers };
    });
  };

  const handleNext = () => {
    setState(prev => {
      if (prev.currentQuestionIndex === prev.questions.length - 1) {
        return { ...prev, status: 'result' };
      }
      return { ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 };
    });
  };

  const handlePrevious = () => {
    setState(prev => ({
      ...prev,
      currentQuestionIndex: Math.max(0, prev.currentQuestionIndex - 1),
    }));
  };

  const resetQuiz = () => {
    setState({
      questions: [],
      currentQuestionIndex: 0,
      userAnswers: Array(10).fill(null),
      status: 'idle',
      topic: '',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 sm:px-6">
      <header className="mb-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-xl shadow-blue-200 mb-6 transform hover:rotate-12 transition-transform duration-300">
          <i className="fas fa-calculator text-3xl text-white"></i>
        </div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">
          MathGenius <span className="text-blue-600">THCS</span>
        </h1>
        <p className="mt-3 text-gray-500 font-medium text-lg">Hệ thống sinh đề trắc nghiệm Toán thông minh</p>
      </header>

      <main className="w-full max-w-4xl">
        {state.status === 'idle' && (
          <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Nhập chủ đề bài học</h2>
            <form onSubmit={handleStartQuiz} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Chủ đề Toán học</label>
                <input
                  type="text"
                  value={state.topic}
                  onChange={(e) => setState(prev => ({ ...prev, topic: e.target.value }))}
                  placeholder="VD: Định lý Pytago lớp 7, Hệ thức lượng..."
                  className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:ring-0 transition-all text-lg font-medium outline-none"
                  required
                />
                <p className="mt-3 text-xs text-gray-400 italic">Gợi ý: Nhập tên chương hoặc tên bài học cụ thể để AI tạo đề chính xác nhất.</p>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex items-start">
                  <i className="fas fa-exclamation-circle mt-0.5 mr-2"></i>
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-100 transition-all transform hover:-translate-y-1 active:translate-y-0"
              >
                Tạo 10 câu trắc nghiệm
              </button>
            </form>
          </div>
        )}

        {state.status === 'loading' && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-xl">
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="fas fa-brain text-2xl text-blue-600"></i>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 animate-pulse">Đang thiết kế đề thi...</h3>
            <p className="text-gray-500 mt-2">AI đang chọn lọc những câu hỏi hay nhất cho bạn.</p>
          </div>
        )}

        {state.status === 'quiz' && (
          <QuizCard
            question={state.questions[state.currentQuestionIndex]}
            questionNumber={state.currentQuestionIndex + 1}
            totalQuestions={state.questions.length}
            selectedAnswer={state.userAnswers[state.currentQuestionIndex]}
            onSelectAnswer={handleSelectAnswer}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isFirst={state.currentQuestionIndex === 0}
            isLast={state.currentQuestionIndex === state.questions.length - 1}
          />
        )}

        {state.status === 'result' && (
          <ScoreSummary
            questions={state.questions}
            userAnswers={state.userAnswers}
            onReset={resetQuiz}
          />
        )}
      </main>

      <footer className="mt-auto pt-12 text-center text-gray-400 text-sm">
        <p>© 2024 MathGenius THCS. Powered by Gemini Flash 3.</p>
      </footer>
    </div>
  );
};

export default App;
