
import { Question, LearningCategory, Balloon } from './types';

export const generateQuestion = (category: LearningCategory, level: number): Question => {
  const questions: Record<LearningCategory, Question[]> = {
    letters: [
      { instruction: "Pop all vowels!", correctAnswers: ['A', 'E', 'I', 'O', 'U'], category: 'letters', level },
      { instruction: "Find the letter 'B'", correctAnswers: ['B'], category: 'letters', level },
      { instruction: "Pop consonants only", correctAnswers: ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'], category: 'letters', level }
    ],
    numbers: [
      { instruction: "Pop numbers greater than 5", correctAnswers: ['6', '7', '8', '9', '10'], category: 'numbers', level },
      { instruction: "Find even numbers", correctAnswers: ['2', '4', '6', '8', '10'], category: 'numbers', level },
      { instruction: "Pop odd numbers", correctAnswers: ['1', '3', '5', '7', '9'], category: 'numbers', level }
    ],
    math: [
      { instruction: "5 + 3 = ?", correctAnswers: ['8'], category: 'math', level },
      { instruction: "10 - 4 = ?", correctAnswers: ['6'], category: 'math', level },
      { instruction: "3 × 2 = ?", correctAnswers: ['6'], category: 'math', level },
      { instruction: "12 ÷ 3 = ?", correctAnswers: ['4'], category: 'math', level },
      { instruction: "7 + 2 = ?", correctAnswers: ['9'], category: 'math', level }
    ],
    colors: [
      { instruction: "Pop RED balloons!", correctAnswers: ['Red'], category: 'colors', level },
      { instruction: "Find BLUE balloons", correctAnswers: ['Blue'], category: 'colors', level },
      { instruction: "Pop GREEN balloons", correctAnswers: ['Green'], category: 'colors', level },
      { instruction: "Find YELLOW balloons", correctAnswers: ['Yellow'], category: 'colors', level }
    ],
    shapes: [
      { instruction: "Pop CIRCLES!", correctAnswers: ['●'], category: 'shapes', level },
      { instruction: "Find TRIANGLES", correctAnswers: ['▲'], category: 'shapes', level },
      { instruction: "Pop SQUARES", correctAnswers: ['■'], category: 'shapes', level },
      { instruction: "Find STARS", correctAnswers: ['★'], category: 'shapes', level }
    ],
    animals: [
      { instruction: "Pop farm animals!", correctAnswers: ['🐄', '🐷', '🐓'], category: 'animals', level },
      { instruction: "Find ocean animals", correctAnswers: ['🐟', '🐋', '🐬'], category: 'animals', level },
      { instruction: "Pop animals that fly", correctAnswers: ['🦅', '🐝', '🦋'], category: 'animals', level }
    ],
    words: [
      { instruction: "Pop three-letter words", correctAnswers: ['Cat', 'Dog', 'Sun'], category: 'words', level },
      { instruction: "Find rhyming words with 'Cat'", correctAnswers: ['Hat', 'Bat', 'Mat'], category: 'words', level },
      { instruction: "Pop action words", correctAnswers: ['Run', 'Jump', 'Swim'], category: 'words', level }
    ],
    science: [
      { instruction: "Pop planets!", correctAnswers: ['Mars', 'Earth', 'Venus'], category: 'science', level },
      { instruction: "Find weather types", correctAnswers: ['Rain', 'Snow', 'Sun'], category: 'science', level },
      { instruction: "Pop living things", correctAnswers: ['Tree', 'Fish', 'Bird'], category: 'science', level }
    ],
    geography: [
      { instruction: "Capital of France?", correctAnswers: ['Paris'], category: 'geography', level },
      { instruction: "Longest river in world?", correctAnswers: ['Nile'], category: 'geography', level },
      { instruction: "Largest continent?", correctAnswers: ['Asia'], category: 'geography', level },
      { instruction: "Capital of Japan?", correctAnswers: ['Tokyo'], category: 'geography', level }
    ]
  };

  const categoryQuestions = questions[category];
  return categoryQuestions[Math.floor(Math.random() * categoryQuestions.length)];
};

export const generateBalloons = (category: LearningCategory, level: number, question: Question): Balloon[] => {
  const balloons: Balloon[] = [];
  const colors = getCategoryColors(category);
  
  const content: Record<LearningCategory, string[]> = {
    letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    numbers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    math: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    colors: ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'Brown'],
    shapes: ['●', '▲', '■', '★', '♦', '♥', '♠', '♣'],
    animals: ['🐄', '🐷', '🐓', '🐟', '🐋', '🐬', '🦅', '🐝', '🦋', '🐱', '🐶', '🐰'],
    words: ['Cat', 'Dog', 'Sun', 'Hat', 'Bat', 'Mat', 'Run', 'Jump', 'Swim', 'Book', 'Tree', 'Car'],
    science: ['Mars', 'Earth', 'Venus', 'Rain', 'Snow', 'Sun', 'Tree', 'Rock', 'Water', 'Air', 'Fire', 'Moon'],
    geography: ['Paris', 'Tokyo', 'London', 'Berlin', 'Rome', 'Madrid', 'Nile', 'Amazon', 'Asia', 'Europe', 'Africa', 'America']
  };

  const availableContent = content[category];
  const balloonCount = Math.min(8 + level, 12);

  // Ensure at least 2-3 correct answers are in the balloons
  const correctCount = Math.min(3, question.correctAnswers.length);
  const correctBalloons = question.correctAnswers.slice(0, correctCount);

  for (let i = 0; i < balloonCount; i++) {
    let balloonContent: string;
    let balloonType: 'correct' | 'incorrect';
    
    if (i < correctCount) {
      balloonContent = correctBalloons[i];
      balloonType = 'correct';
    } else {
      // Add some incorrect options
      do {
        balloonContent = availableContent[Math.floor(Math.random() * availableContent.length)];
      } while (question.correctAnswers.includes(balloonContent));
      balloonType = 'incorrect';
    }

    balloons.push({
      id: `balloon-${i}-${Date.now()}`,
      x: Math.random() * 700 + 50,
      y: Math.random() * 100 + 500,
      speed: Math.random() * 1.5 + 0.8 + (level * 0.1),
      content: balloonContent,
      type: balloonType,
      color: getCategorySpecificColor(category, balloonContent, balloonType),
      size: Math.random() * 15 + 50,
      popped: false,
      popAnimation: false,
      rotation: Math.random() * 360,
      bobOffset: Math.random() * Math.PI * 2
    });
  }

  return balloons.sort(() => Math.random() - 0.5); // Shuffle the balloons
};

export const getCategorySpecificColor = (category: LearningCategory, content: string, type: 'correct' | 'incorrect'): string => {
  if (category === 'colors') {
    const colorMap: { [key: string]: string } = {
      'Red': '#FF0000',
      'Blue': '#0000FF',
      'Green': '#00FF00',
      'Yellow': '#FFFF00',
      'Purple': '#800080',
      'Orange': '#FFA500',
      'Pink': '#FFC0CB',
      'Brown': '#A52A2A'
    };
    return colorMap[content] || '#FF6B9D';
  }
  
  const categoryColorMap: Record<LearningCategory, string[]> = {
    letters: ['#FF6B9D', '#C44569', '#F8B500', '#FF7675'],
    numbers: ['#45B7D1', '#0984e3', '#74B9FF', '#00B894'],
    math: ['#96CEB4', '#00B894', '#55A3FF', '#26C281'],
    colors: ['#FF6B9D', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'],
    shapes: ['#A29BFE', '#6C5CE7', '#FD79A8', '#FDCB6E'],
    animals: ['#F39C12', '#E67E22', '#D63031', '#74B9FF'],
    words: ['#E17055', '#81ECEC', '#FD79A8', '#FDCB6E'],
    science: ['#00B894', '#0984E3', '#6C5CE7', '#A29BFE'],
    geography: ['#00B894', '#74B9FF', '#0984E3', '#55A3FF']
  };
  
  const colors = categoryColorMap[category] || ['#FF6B9D', '#45B7D1', '#96CEB4', '#FFEAA7'];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const getCategoryColors = (category: LearningCategory): string[] => {
  const categoryColorMap: Record<LearningCategory, string[]> = {
    letters: ['#FF6B9D', '#C44569', '#F8B500', '#FF7675'],
    numbers: ['#45B7D1', '#0984e3', '#74B9FF', '#00B894'],
    math: ['#96CEB4', '#00B894', '#55A3FF', '#26C281'],
    colors: ['#FF6B9D', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'],
    shapes: ['#A29BFE', '#6C5CE7', '#FD79A8', '#FDCB6E'],
    animals: ['#F39C12', '#E67E22', '#D63031', '#74B9FF'],
    words: ['#E17055', '#81ECEC', '#FD79A8', '#FDCB6E'],
    science: ['#00B894', '#0984E3', '#6C5CE7', '#A29BFE'],
    geography: ['#00B894', '#74B9FF', '#0984E3', '#55A3FF']
  };
  
  return categoryColorMap[category] || ['#FF6B9D', '#45B7D1', '#96CEB4', '#FFEAA7'];
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
    },
    castle: {
      background: 'linear-gradient(135deg, #8B4513 0%, #DAA520 100%)',
      accent: '#DAA520'
    },
    farm: {
      background: 'linear-gradient(135deg, #228B22 0%, #ADFF2F 100%)',
      accent: '#228B22'
    },
    ocean: {
      background: 'linear-gradient(135deg, #006994 0%, #00A8CC 100%)',
      accent: '#00A8CC'
    },
    forest: {
      background: 'linear-gradient(135deg, #2F4F2F 0%, #8FBC8F 100%)',
      accent: '#2F4F2F'
    }
  };
  
  return themes[theme as keyof typeof themes] || themes.rainbow;
};
