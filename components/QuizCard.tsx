
import React from 'react';
import { Question } from '../types';

interface QuizCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  onSelectAnswer: (index: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const QuizCard: React.FC<QuizCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
  onNext,
  onPrevious,
  isFirst,
  isLast,
}) => {
  const progress = (questionNumber / totalQuestions) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300">
      <div className="h-2 bg-gray-100">
        <div 
          className="h-full bg-blue-600 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full uppercase tracking-wider">
            Câu {questionNumber} / {totalQuestions}
          </span>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-8 leading-relaxed">
          {question.question}
        </h2>

        <div className="space-y-4">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => onSelectAnswer(index)}
              className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 group flex items-center ${
                selectedAnswer === index
                  ? 'border-blue-600 bg-blue-50 text-blue-800'
                  : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50 text-gray-700'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 text-sm font-bold border ${
                selectedAnswer === index
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-gray-300 text-gray-500 group-hover:border-blue-300'
              }`}>
                {String.fromCharCode(65 + index)}
              </div>
              <span className="font-medium">{option}</span>
            </button>
          ))}
        </div>

        <div className="mt-10 flex justify-between items-center border-t border-gray-100 pt-6">
          <button
            onClick={onPrevious}
            disabled={isFirst}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isFirst ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <i className="fas fa-arrow-left"></i>
            <span>Quay lại</span>
          </button>

          <button
            onClick={onNext}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg font-bold shadow-lg shadow-blue-200 transition-all transform active:scale-95"
          >
            {isLast ? 'Hoàn thành' : 'Tiếp theo'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizCard;
