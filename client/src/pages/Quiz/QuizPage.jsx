import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const QuizPage = () => {
  const [quizData, setQuizData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);  
  const { name } = useParams();
  console.log(selectedOption);
  

  console.log(quizData);
  

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const query = `quiz on ${name}`;
        const response = await fetch('http://127.0.0.1:5000/api/quiz', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query }),
        });

        const data = await response.json();
        setQuizData(data.response);
        setLoading(false);  
      } catch (error) {
        console.error('Error fetching quiz data:', error);
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [name]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setShowAnswer(true);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setShowAnswer(false);
    setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % quizData.length);
  };

  if (loading) {
    return <div className="text-slate-900">Loading quiz...</div>;
  }

  // Add a check to ensure quizData is available
  const currentQuestion = quizData[currentQuestionIndex];
  if (!currentQuestion) {
    return <div className="text-white">No quiz data available.</div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center gap-10 p-5">
      <h1 className="text-3xl font-bold mb-5">Quiz Time!</h1>

      {/* Question Section */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl mb-6">{currentQuestion.question}</h2>

        {/* Options Section */}
        <div className="flex flex-col gap-4">
          {[...(currentQuestion.options)].map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              className={`py-2 px-4 rounded border border-gray-600 
                ${selectedOption === option ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Show Correct Answer */}
        {showAnswer && (
          <div className="mt-6">
            {selectedOption == currentQuestion.ans ? (
              <p className="text-green-400 font-semibold">Correct! 🎉</p>
            ) : (
              <p className="text-red-400 font-semibold">
                Incorrect! {currentQuestion.ans}.
              </p>
            )}
          </div>
        )}

        {/* Next Question Button */}
        {showAnswer && (
          <button
            onClick={handleNextQuestion}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Next Question
          </button>
        )}
      </div>

      {/* Dummy Input Box for ChatBot */}
      <div className="w-full max-w-lg mt-12">
        <label htmlFor="chatInput" className="block text-lg mb-2">
          Chat with your tutor (Coming Soon):
        </label>
        <input
          type="text"
          id="chatInput"
          className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg"
          placeholder="Ask anything here..."
        />
      </div>
    </div>
  );
};

export default QuizPage;
