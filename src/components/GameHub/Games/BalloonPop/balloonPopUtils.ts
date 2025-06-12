
import { Question, LearningCategory, Balloon } from './types';

export const generateQuestion = (category: LearningCategory, level: number): Question => {
  const questions: Record<LearningCategory, Question[]> = {
    letters: [
      { instruction: "Pop all vowels!", correctAnswers: ['A', 'E', 'I', 'O', 'U'], category: 'letters', level },
      { instruction: "Find the letter 'B'", correctAnswers: ['B'], category: 'letters', level },
      { instruction: "Pop consonants only", correctAnswers: ['B', 'C', 'D', 'F', 'G'], category: 'letters', level }
    ],
    numbers: [
      { instruction: "Pop the number 5", correctAnswers: ['5'], category: 'numbers', level },
      { instruction: "Find even numbers", correctAnswers: ['2', '4', '6', '8'], category: 'numbers', level },
      { instruction: "Pop numbers greater than 5", correctAnswers: ['6', '7', '8', '9'], category: 'numbers', level }
    ],
    math: [
      { instruction: "Pop balloons that equal 10", correctAnswers: ['5+5', '6+4', '3+7'], category: 'math', level },
      { instruction: "Find 2×3", correctAnswers: ['6'], category: 'math', level },
      { instruction: "Pop results of 15-7", correctAnswers: ['8'], category: 'math', level }
    ],
    colors: [
      { instruction: "Pop red balloons!", correctAnswers: ['Red'], category: 'colors', level },
      { instruction: "Find primary colors", correctAnswers: ['Red', 'Blue', 'Yellow'], category: 'colors', level },
      { instruction: "Pop warm colors", correctAnswers: ['Red', 'Orange', 'Yellow'], category: 'colors', level }
    ],
    shapes: [
      { instruction: "Pop circles!", correctAnswers: ['Circle'], category: 'shapes', level },
      { instruction: "Find triangles", correctAnswers: ['Triangle'], category: 'shapes', level },
      { instruction: "Pop 4-sided shapes", correctAnswers: ['Square', 'Rectangle'], category: 'shapes', level }
    ],
    animals: [
      { instruction: "Pop farm animals!", correctAnswers: ['Cow', 'Pig', 'Chicken'], category: 'animals', level },
      { instruction: "Find ocean animals", correctAnswers: ['Fish', 'Whale', 'Dolphin'], category: 'animals', level },
      { instruction: "Pop animals that fly", correctAnswers: ['Bird', 'Bee', 'Butterfly'], category: 'animals', level }
    ]
  };

  const categoryQuestions = questions[category];
  return categoryQuestions[Math.floor(Math.random() * categoryQuestions.length)];
};

export const generateBalloons = (category: LearningCategory, level: number): Balloon[] => {
  const balloons: Balloon[] = [];
  const colors = ['#FF6B9D', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE'];
  
  const content: Record<LearningCategory, string[]> = {
    letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    numbers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    math: ['2+2', '3+3', '5+5', '6+4', '3+7', '1+9', '8-3', '9-4', '2×3', '3×2'],
    colors: ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'Brown'],
    shapes: ['Circle', 'Square', 'Triangle', 'Rectangle', 'Star', 'Heart', 'Diamond', 'Oval'],
    animals: ['Cat', 'Dog', 'Bird', 'Fish', 'Cow', 'Pig', 'Lion', 'Tiger', 'Elephant', 'Bee']
  };

  const availableContent = content[category];
  const balloonCount = Math.min(8 + level, 12);

  for (let i = 0; i < balloonCount; i++) {
    const randomContent = availableContent[Math.floor(Math.random() * availableContent.length)];
    
    balloons.push({
      id: `balloon-${i}`,
      x: Math.random() * 700 + 50,
      y: Math.random() * 200 + 500,
      speed: Math.random() * 2 + 1 + (level * 0.2),
      content: randomContent,
      type: Math.random() > 0.3 ? 'correct' : 'incorrect',
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 20 + 60,
      popped: false,
      popAnimation: false
    });
  }

  return balloons;
};

export const getRandomColor = (): string => {
  const colors = ['#FF6B9D', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE'];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const getThemeColors = (theme: string) => {
  const themes = {
    rainbow: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      accent: '#FF6B9D'
    },
    jungle: {
      background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
      accent: '#4CAF50'
    },
    space: {
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      accent: '#9C27B0'
    },
    underwater: {
      background: 'linear-gradient(135deg, #36d1dc 0%, #5b86e5 100%)',
      accent: '#00BCD4'
    }
  };
  
  return themes[theme as keyof typeof themes] || themes.rainbow;
};
