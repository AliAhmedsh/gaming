import React, { useState, useEffect } from 'react';
import './TriviaGame.css';

const TRIVIA_QUESTIONS = [
  {
    question: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctAnswer: 'Paris'
  },
  {
    question: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswer: 'Mars'
  },
  {
    question: 'What is 2 + 2?',
    options: ['3', '4', '5', '6'],
    correctAnswer: '4'
  },
  {
    question: 'Who painted the Mona Lisa?',
    options: ['Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Michelangelo'],
    correctAnswer: 'Leonardo da Vinci'
  },
  {
    question: 'What is the largest mammal in the world?',
    options: ['African Elephant', 'Blue Whale', 'Giraffe', 'Polar Bear'],
    correctAnswer: 'Blue Whale'
  }
];

function TriviaGame() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameStarted, setGameStarted] = useState(false);

  const currentQuestion = TRIVIA_QUESTIONS[currentQuestionIndex];

  useEffect(() => {
    let timer;
    if (gameStarted && timeLeft > 0 && !showScore) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !showScore) {
      handleNextQuestion();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, showScore, gameStarted]);

  const handleAnswerClick = (selectedOption) => {
    if (selectedAnswer !== null) return; // Prevent multiple selections
    
    const correct = selectedOption === currentQuestion.correctAnswer;
    setSelectedAnswer(selectedOption);
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
    }
    
    setTimeout(handleNextQuestion, 1500);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < TRIVIA_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setTimeLeft(15);
    } else {
      setShowScore(true);
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setTimeLeft(15);
  };

  if (!gameStarted) {
    return (
      <div className="trivia-container">
        <h2>Welcome to the Trivia Game!</h2>
        <p>Test your knowledge with these fun questions. You'll have 15 seconds per question.</p>
        <button className="start-button" onClick={startGame}>
          Start Game
        </button>
      </div>
    );
  }

  if (showScore) {
    return (
      <div className="trivia-container">
        <h2>Game Over!</h2>
        <p>Your score: {score} out of {TRIVIA_QUESTIONS.length}</p>
        <p>That's {(score / TRIVIA_QUESTIONS.length * 100).toFixed(0)}%</p>
        <button className="start-button" onClick={startGame}>
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="trivia-container">
      <div className="score-time">
        <div>Score: {score}</div>
        <div>Time: {timeLeft}s</div>
      </div>
      
      <div className="progress">
        Question {currentQuestionIndex + 1} of {TRIVIA_QUESTIONS.length}
      </div>
      
      <div className="question-container">
        <h2 className="question">{currentQuestion.question}</h2>
        <div className="options">
          {currentQuestion.options.map((option, index) => {
            let buttonClass = 'option';
            if (selectedAnswer === option) {
              buttonClass += isCorrect ? ' correct' : ' incorrect';
            } else if (selectedAnswer !== null && option === currentQuestion.correctAnswer) {
              buttonClass += ' correct';
            }
            
            return (
              <button
                key={index}
                className={buttonClass}
                onClick={() => handleAnswerClick(option)}
                disabled={selectedAnswer !== null}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
      
      {selectedAnswer && (
        <div className={`feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
          {isCorrect ? 'Correct! 🎉' : `Incorrect! The correct answer is: ${currentQuestion.correctAnswer}`}
        </div>
      )}
    </div>
  );
}

export default TriviaGame;
