import { useState, useEffect } from "react";
import { fetchQuizData } from "../Api";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(900);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const loadQuiz = async () => {
      const data = await fetchQuizData();
      setQuestions(data);
    };
    loadQuiz();
  }, []);

  useEffect(() => {
    if (showResult) {
      // Calculate final score when showing results
      const correctAnswers = Object.keys(selectedAnswers).filter(
        (key) => questions[key]?.correct_answer === selectedAnswers[key]
      ).length;
      setScore(correctAnswers);
    }
  }, [showResult]);

  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setShowResult(true);
    }
  }, [timeLeft, showResult]);

  const handleAnswer = (option) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQuestion]: option });
  };

  const handleSubmit = () => {
    setShowResult(true);
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswers({});
    setTimeLeft(900);
    setShowResult(false);
  };

  if (questions.length === 0) return <div className="text-center mt-10 text-lg text-gray-600">Loading quiz...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 px-4 py-8">
      {!showResult ? (
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-8">
            <div className="text-blue-600 font-bold text-xl">
              Question {currentQuestion + 1} of {questions.length}
            </div>
            <div className="bg-gray-100 px-4 py-2 rounded-full text-gray-700">
              ⏳ {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Navigation Grid */}
          <div className="grid grid-cols-10 gap-2 mb-8">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`h-8 rounded-md text-sm ${
                  selectedAnswers[index] !== undefined
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                } ${
                  currentQuestion === index ? 'ring-2 ring-blue-400' : ''
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {/* Question Card */}
          <div className="bg-gray-50 p-6 rounded-xl mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              {questions[currentQuestion]?.question}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questions[currentQuestion]?.options.map((option, index) => (
                <button
                  key={index}
                  className={`p-4 text-left rounded-xl border-2 transition-all ${
                    selectedAnswers[currentQuestion] === option
                      ? 'border-blue-600 bg-blue-50 font-bold'
                      : 'border-gray-200 hover:border-blue-400'
                  }`}
                  onClick={() => handleAnswer(option)}
                >
                  <span className="text-blue-600 font-bold mr-2">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex justify-between items-center">
            <button
              className="px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
              disabled={currentQuestion === 0}
            >
              ← Previous
            </button>
            
            <button
              className="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              onClick={handleSubmit}
            >
              Submit Quiz
            </button>

            <button
              className="px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              onClick={() => setCurrentQuestion(currentQuestion + 1)}
              disabled={currentQuestion === questions.length - 1}
            >
              Next →
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Quiz Completed 🎉</h2>
            <div className="text-2xl bg-blue-100 inline-block px-8 py-4 rounded-full">
              Score: <span className="text-blue-600 font-bold">{score}</span> / {questions.length}
            </div>
          </div>

          {/* Results Review */}
    
<div className="space-y-6">
  {questions.map((q, index) => {
    const selected = selectedAnswers[index];
    const isCorrect = selected === q.correct_answer;
    
    return (
      <div key={index} className="border-l-4 p-4 rounded-lg" style={{
        borderColor: selected ? (isCorrect ? '#16a34a' : '#dc2626') : '#e5e7eb'
      }}>
        <h4 className="text-lg font-semibold text-gray-800 mb-3">
          {index + 1}. {q.question}
        </h4>
        <div className="space-y-2">
          <p className={selected ? (isCorrect ? 'text-green-600' : 'text-red-600') : 'text-gray-500'}>
            🗳️ Your Answer: {selected || "Not attempted"}
          </p>
          {/* Always show correct answer */}
          <p className="text-green-600">
            ✅ Correct Answer: {q.correct_answer}
          </p>
        </div>
      </div>
    );
  })}
</div>

          {/* Restart Button */}
          <div className="text-center mt-8">
            <button
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={handleRestart}
            >
              ↻ Restart Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;