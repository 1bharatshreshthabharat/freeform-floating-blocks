import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Volume2 } from "lucide-react";

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const initialLetterGame = {
  currentIndex: 0,
  recognizedLetters: [],
};

const LetterActivity = ({
  addScore,
  loseHeart,
}: {
  addScore: (points: number) => void;
  loseHeart: () => void;
}) => {
  const [letterGame, setLetterGame] = useState(initialLetterGame);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(5);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFeedbackActive, setIsFeedbackActive] = useState(false);


  const currentLetter = alphabet[letterGame.currentIndex];

  const speak = (text: string) => {
  if (!soundEnabled || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel(); // stop ongoing speech
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.8;
  utterance.pitch = 1.2;
  window.speechSynthesis.speak(utterance);
};

  const resetLetterGame = () => {
    setLetterGame(initialLetterGame);
    setScore(0);
    setLives(3);
    setTimeLeft(5);
  };

const handleNext = (isCorrect: boolean) => {
  if (isFeedbackActive) return; // prevent double-click

  const isGameOver = lives <= 1 || letterGame.currentIndex >= alphabet.length - 1;
  setIsFeedbackActive(true); // block inputs

        const positiveFeedbacks = ["Great job!", "Nice!", "Perfect! 🌟", "You nailed it!", "Amazing! 🎨"];
const negativeFeedbacks = ["Try again!", "Wrong one!", "Wrong or timed out!"];
const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  if (isCorrect) {
    setScore((prev) => prev + 10);
    addScore(10);
    toast.success(getRandom(positiveFeedbacks));
    if (!isGameOver) speak(`Correct! Letter ${currentLetter}`);
  } else {
    setLives((prev) => prev - 1);
    loseHeart();
    toast.error(getRandom(negativeFeedbacks));
    if (!isGameOver) speak("Try again!");
  }

  setTimeout(() => {
    setLetterGame((prev) => ({
      ...prev,
      recognizedLetters: [...prev.recognizedLetters, currentLetter],
      currentIndex: prev.currentIndex + 1,
    }));
    setTimeLeft(5);
    setIsFeedbackActive(false); // allow inputs again
  }, 1500); // delay until feedback completes
};

  useEffect(() => {
    if (letterGame.currentIndex >= alphabet.length) return;

    const generateOptions = () => {
      const options = new Set([currentLetter]);
      while (options.size < 4) {
        const rand = alphabet[Math.floor(Math.random() * 26)];
        if (rand !== currentLetter) options.add(rand);
      }
      setShuffledOptions(Array.from(options).sort(() => Math.random() - 0.5));
    };

    generateOptions();

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNext(false);
          return 5;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [letterGame.currentIndex]);

  // 🎉 Game complete or lost
  if (letterGame.currentIndex >= alphabet.length || lives <= 0) {
    return (
      <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
        <div className="text-4xl mb-3 animate-bounce">🎊</div>
        <h3 className="text-xl font-bold mb-2 text-purple-700">
          {lives <= 0 ? "Game Over!" : "Alphabet Master!"}
        </h3>
        <div className="text-sm text-gray-600 mb-4">
          {lives <= 0
            ? "You lost all lives. Try again!"
            : "You’ve learned all 26 letters!"}
        </div>
        <Button
          onClick={resetLetterGame}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl"
        >
          Play Again 🔁
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-purple-600 mb-2">
          Learn the Alphabet
        </h3>
        <div className="text-sm text-gray-600">
          Letter {letterGame.currentIndex + 1} of 26
        </div>
        <Progress
          value={((letterGame.currentIndex + 1) / 26) * 100}
          className="w-full max-w-md mx-auto mt-2"
        />
        <div className="text-sm text-gray-500 mt-1">⏱️ Time Left: {timeLeft}s</div>
        <div className="text-sm text-red-500">❤️ Lives Left: {lives}</div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 text-center shadow-lg">
        <div className="text-8xl font-bold text-purple-600 mb-4 animate-pulse">
          {currentLetter}
        </div>
        <div className="text-lg mb-4">
          Find the letter <strong>{currentLetter}</strong>
        </div>

        <Button
          onClick={() => speak(`Letter ${currentLetter}`)}
          variant="outline"
          className="mb-6 hover:scale-105 transition-transform"
        >
          <Volume2 className="h-4 w-4 mr-2" />
          Hear Letter
        </Button>

        <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
         {shuffledOptions.map((letter, i) => (
  <Button
    key={i}
    onClick={() => handleNext(letter === currentLetter)}
    variant="outline"
    className="text-2xl py-4 hover:scale-105 transition-transform rounded-xl shadow-md"
    disabled={isFeedbackActive} // 👈 disable during feedback
  >
    {letter}
  </Button>
))}

        </div>
      </div>
    </div>
  );
};

export default LetterActivity;
