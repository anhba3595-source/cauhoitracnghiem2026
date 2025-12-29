
import React, { useState } from 'react';
import { Question } from '../types';

interface ScoreSummaryProps {
  questions: Question[];
  userAnswers: (number | null)[];
  onReset: () => void;
}

const ScoreSummary: React.FC<ScoreSummaryProps> = ({ questions, userAnswers, onReset }) => {
  const [showExplanations, setShowExplanations] = useState(false);
  const score = userAnswers.reduce((acc, ans, idx) => {
    return ans === questions[idx].correctAnswerIndex ? acc + 1 : acc;
  }, 0);

  const percentage = (score / questions.length) * 100;

  const getMessage = () => {
    if (percentage === 100) return { title: "Tuyệt vời!", sub: "Bạn là một thiên tài toán học!", color: "text-green-600" };
    if (percentage >= 80) return { title: "Rất tốt!", sub: "Bạn nắm vững kiến thức rồi đó.", color: "text-blue-600" };
    if (percentage >= 50) return { title: "Khá ổn!", sub: "Cần luyện tập thêm một chút nữa nhé.", color: "text-yellow-600" };
    return { title: "Cố gắng lên!", sub: "Hãy ôn tập lại chủ đề này nhé.", color: "text-red-600" };
  };

  const message = getMessage();

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-12 text-center text-white">
        <h2 className="text-4xl font-extrabold mb-2">{message.title}</h2>
        <p className="text-blue-100 opacity-90 text-lg">{message.sub}</p>
        
        <div className="mt-8 inline-block bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="text-5xl font-black">{score}/{questions.length}</div>
          <div className="text-sm font-semibold mt-1 uppercase tracking-widest text-blue-200">Điểm số</div>
        </div>
      </div>

      <div className="p-8">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
          <button
            onClick={onReset}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-100"
          >
            Làm đề mới
          </button>
          <button
            onClick={() => setShowExplanations(!showExplanations)}
            className="flex-1 border-2 border-gray-200 hover:border-blue-600 hover:text-blue-600 text-gray-700 font-bold py-4 rounded-xl transition-all"
          >
            {showExplanations ? 'Ẩn đáp án' : 'Xem chi tiết đáp án'}
          </button>
        </div>

        {showExplanations && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800 border-b pb-4">Chi tiết bài làm</h3>
            {questions.map((q, idx) => {
              const isCorrect = userAnswers[idx] === q.correctAnswerIndex;
              return (
                <div key={idx} className={`p-6 rounded-2xl border-l-4 ${isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
                  <div className="flex items-start">
                    <span className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mr-3 mt-1 text-xs font-bold ${isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                      {isCorrect ? <i className="fas fa-check"></i> : <i className="fas fa-times"></i>}
                    </span>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">Câu {idx + 1}: {q.question}</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-semibold">Đáp án của bạn:</span> {userAnswers[idx] !== null ? q.options[userAnswers[idx]!] : 'Không chọn'}
                      </p>
                      <p className="text-sm text-gray-600 mb-3">
                        <span className="font-semibold">Đáp án đúng:</span> {q.options[q.correctAnswerIndex]}
                      </p>
                      <div className="bg-white/50 p-4 rounded-lg border border-gray-100 italic text-sm text-gray-700">
                        <span className="font-bold not-italic text-blue-600 block mb-1">Lời giải:</span>
                        {q.explanation}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScoreSummary;
