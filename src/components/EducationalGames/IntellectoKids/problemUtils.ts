// Enhanced problemUtils.ts with animated SVG diagram metadata and detailed logic

export const getShapeIcon = (topic: string): string => {
  switch (topic) {
    case 'triangle': return '△';
    case 'rectangle': return '▭';
    case 'square': return '◼';
    case 'circle': return '◯';
    default: return '';
  }
};

const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateOptions = (correct: number): number[] => {
  const options = new Set<number>();
  options.add(correct);
  while (options.size < 4) {
    let delta = Math.random() < 0.5 ? -1 : 1;
    options.add(correct + delta * randomInt(1, 10));
  }
  return Array.from(options).sort(() => Math.random() - 0.5);
};

export const generateMathProblem = (level: number) => {
  const topics = [
    'addition', 'subtraction', 'multiplication', 'division',
    'equation', 'fraction', 'percentage', 'triangle', 'rectangle', 'square', 'circle', 'power'
  ];
  const topic = topics[Math.min(Math.floor(level / 2), topics.length - 1)];

  let num1 = randomInt(1, 10 + level);
  let num2 = randomInt(1, 10 + level);
  let correctAnswer = 0;
  let display = '';
  let steps: string[] = [];
  let diagram: string = '';
  let diagramData: any = null;

  switch (topic) {
    case 'addition':
      correctAnswer = num1 + num2;
      display = `${num1} + ${num2}`;
      steps.push(`${num1} + ${num2} = ${correctAnswer}`);
      break;

    case 'subtraction':
      if (num2 > num1) [num1, num2] = [num2, num1];
      correctAnswer = num1 - num2;
      display = `${num1} - ${num2}`;
      steps.push(`${num1} - ${num2} = ${correctAnswer}`);
      break;

    case 'multiplication':
      correctAnswer = num1 * num2;
      display = `${num1} × ${num2}`;
      steps.push(`${num1} × ${num2} = ${correctAnswer}`);
      break;

    case 'division':
      correctAnswer = randomInt(2, 10);
      num2 = randomInt(2, 10);
      num1 = correctAnswer * num2;
      display = `${num1} ÷ ${num2}`;
      steps.push(`${num1} ÷ ${num2} = ${correctAnswer}`);
      break;

    case 'equation': {
      const type = ['add', 'sub', 'mul', 'div'][Math.floor(Math.random() * 4)];
      switch (type) {
        case 'add':
          correctAnswer = randomInt(5, 15);
          num1 = randomInt(1, 10);
          display = `${num1} + x = ${num1 + correctAnswer}`;
          steps.push(`${num1} + x = ${num1 + correctAnswer}`, `x = ${num1 + correctAnswer} - ${num1}`, `x = ${correctAnswer}`);
          break;
        case 'sub':
          correctAnswer = randomInt(5, 15);
          num1 = randomInt(1, 10);
          display = `${num1 + correctAnswer} - x = ${num1}`;
          steps.push(`${num1 + correctAnswer} - x = ${num1}`, `x = ${num1 + correctAnswer} - ${num1}`, `x = ${correctAnswer}`);
          break;
        case 'mul':
          correctAnswer = randomInt(2, 12);
          num1 = randomInt(2, 10);
          display = `${num1} × x = ${num1 * correctAnswer}`;
          steps.push(`${num1} × x = ${num1 * correctAnswer}`, `x = ${num1 * correctAnswer} ÷ ${num1}`, `x = ${correctAnswer}`);
          break;
        case 'div':
          correctAnswer = randomInt(2, 10);
          num1 = correctAnswer * randomInt(2, 10);
          display = `${num1} ÷ x = ${num1 / correctAnswer}`;
          steps.push(`${num1} ÷ x = ${num1 / correctAnswer}`, `x = ${num1} ÷ ${num1 / correctAnswer}`, `x = ${correctAnswer}`);
          break;
      }
      display = `Solve: ${display}`;
      break;
    }

    case 'fraction': {
      const numerator = randomInt(1, 9);
      const denominator = randomInt(2, 10);
      correctAnswer = parseFloat((numerator / denominator).toFixed(2));
      display = `What is ${numerator}⁄${denominator}?`;
      steps.push(`${numerator} ÷ ${denominator} = ${correctAnswer}`);
      diagramData = { type: 'fraction', numerator, denominator };
      break;
    }

    case 'percentage': {
      num1 = randomInt(10, 200);
      num2 = randomInt(1, 100);
      correctAnswer = parseFloat(((num1 * num2) / 100).toFixed(2));
      display = `What is ${num2}% of ${num1}?`;
      steps.push(`(${num2} ÷ 100) × ${num1} = ${correctAnswer}`);
      diagramData = { type: 'percentage', percent: num2, base: num1 };
      break;
    }

    case 'triangle': {
      const base = randomInt(3, 12);
      const height = randomInt(2, 10);
      correctAnswer = parseFloat((0.5 * base * height).toFixed(2));
      display = `Area of triangle with base ${base} & height ${height}`;
      steps.push(`Area = 1/2 × base × height = 1/2 × ${base} × ${height} = ${correctAnswer}`);
      diagram = `triangle-${base}-${height}`;
      diagramData = { type: 'triangle', base, height };
      break;
    }

    case 'rectangle': {
      const length = randomInt(4, 12);
      const breadth = randomInt(2, 10);
      correctAnswer = length * breadth;
      display = `Area of rectangle with length ${length} & breadth ${breadth}`;
      steps.push(`Area = length × breadth = ${length} × ${breadth} = ${correctAnswer}`);
      diagram = `rectangle-${length}-${breadth}`;
      diagramData = { type: 'rectangle', length, breadth };
      break;
    }

    case 'square': {
      const side = randomInt(3, 12);
      correctAnswer = side * side;
      display = `Area of square with side ${side}`;
      steps.push(`Area = side² = ${side}² = ${correctAnswer}`);
      diagram = `square-${side}`;
      diagramData = { type: 'square', side };
      break;
    }

    case 'circle': {
      const radius = randomInt(2, 10);
      correctAnswer = parseFloat((3.14 * radius * radius).toFixed(2));
      display = `Area of circle with radius ${radius}`;
      steps.push(`Area = π × r² = 3.14 × ${radius}² = ${correctAnswer}`);
      diagram = `circle-${radius}`;
      diagramData = { type: 'circle', radius };
      break;
    }

    case 'power': {
      if (level > 10 && Math.random() < 0.5) {
        const base = randomInt(2, 12);
        correctAnswer = base;
        display = `What is √${base * base}?`;
        steps.push(`√${base * base} = ${base}`);
      } else {
        const base = randomInt(2, 6);
        const exp = randomInt(2, 3);
        correctAnswer = Math.pow(base, exp);
        display = `What is ${base} ^ ${exp}?`;
        steps.push(`${base} ^ ${exp} = ${correctAnswer}`);
      }
      break;
    }

    default:
      correctAnswer = num1 + num2;
      display = `${num1} + ${num2}`;
      steps.push(`${num1} + ${num2} = ${correctAnswer}`);
  }

  return {
    topic,
    type: topic,
    display,
    options: generateOptions(correctAnswer),
    correctAnswer,
    steps,
    diagram,
    diagramData,
  };
};

export const checkAnswer = (problem: any, answer: number) => {
  return Math.abs(answer - problem.correctAnswer) < 0.01;
};
