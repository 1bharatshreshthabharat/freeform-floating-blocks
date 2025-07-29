import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Volume2, Star, CheckCircle, BookOpen, PenTool, Headphones } from 'lucide-react';
import { toast } from 'sonner';

interface PhonicsPracticeWorksheetsProps {
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

interface PhonicsLesson {
  id: string;
  title: string;
  letter: string;
  sound: string;
  words: string[];
  sentences: string[];
  difficulty: number;
  category: 'consonants' | 'vowels' | 'blends' | 'digraphs';
}

interface Worksheet {
  id: string;
  title: string;
  type: 'matching' | 'fill-blanks' | 'sorting' | 'reading';
  instructions: string;
  items: any[];
  difficulty: number;
}

const phonicsLessons: PhonicsLesson[] = [
  // Consonants
  { id: 'letter_b', title: 'Letter B', letter: 'B', sound: '/b/', words: ['ball', 'book', 'bird'], sentences: ['The ball is big.', 'I read a book.'], difficulty: 1, category: 'consonants' },
  { id: 'letter_c', title: 'Letter C', letter: 'C', sound: '/k/', words: ['cat', 'car', 'cup'], sentences: ['The cat is cute.', 'The car is red.'], difficulty: 1, category: 'consonants' },
  { id: 'letter_d', title: 'Letter D', letter: 'D', sound: '/d/', words: ['dog', 'door', 'duck'], sentences: ['The dog is happy.', 'Open the door.'], difficulty: 1, category: 'consonants' },
  { id: 'letter_f', title: 'Letter F', letter: 'F', sound: '/f/', words: ['fish', 'fun', 'fire'], sentences: ['The fish swims.', 'This is fun!'], difficulty: 1, category: 'consonants' },
  
  // Vowels
  { id: 'letter_a', title: 'Letter A', letter: 'A', sound: '/æ/', words: ['apple', 'ant', 'ask'], sentences: ['An apple is red.', 'The ant is small.'], difficulty: 1, category: 'vowels' },
  { id: 'letter_e', title: 'Letter E', letter: 'E', sound: '/ɛ/', words: ['egg', 'end', 'every'], sentences: ['I eat an egg.', 'This is the end.'], difficulty: 1, category: 'vowels' },
  { id: 'letter_i', title: 'Letter I', letter: 'I', sound: '/ɪ/', words: ['ice', 'in', 'it'], sentences: ['Ice is cold.', 'Come in here.'], difficulty: 1, category: 'vowels' },
  { id: 'letter_o', title: 'Letter O', letter: 'O', sound: '/ɒ/', words: ['orange', 'on', 'open'], sentences: ['Orange is a color.', 'Put it on top.'], difficulty: 1, category: 'vowels' },
  { id: 'letter_u', title: 'Letter U', letter: 'U', sound: '/ʌ/', words: ['umbrella', 'up', 'under'], sentences: ['Use an umbrella.', 'Look up high.'], difficulty: 1, category: 'vowels' },
  
  // Blends
  { id: 'blend_bl', title: 'BL Blend', letter: 'BL', sound: '/bl/', words: ['blue', 'black', 'blow'], sentences: ['The sky is blue.', 'Black cats are cute.'], difficulty: 2, category: 'blends' },
  { id: 'blend_cr', title: 'CR Blend', letter: 'CR', sound: '/kr/', words: ['crab', 'cry', 'crown'], sentences: ['The crab walks sideways.', 'Don\'t cry, be happy.'], difficulty: 2, category: 'blends' },
  { id: 'blend_dr', title: 'DR Blend', letter: 'DR', sound: '/dr/', words: ['drum', 'drop', 'drive'], sentences: ['Beat the drum.', 'Don\'t drop it.'], difficulty: 2, category: 'blends' },
  
  // Digraphs
  { id: 'digraph_ch', title: 'CH Digraph', letter: 'CH', sound: '/tʃ/', words: ['chair', 'cheese', 'chip'], sentences: ['Sit on the chair.', 'I like cheese.'], difficulty: 3, category: 'digraphs' },
  { id: 'digraph_sh', title: 'SH Digraph', letter: 'SH', sound: '/ʃ/', words: ['ship', 'shoe', 'shop'], sentences: ['The ship sails away.', 'Put on your shoe.'], difficulty: 3, category: 'digraphs' },
  { id: 'digraph_th', title: 'TH Digraph', letter: 'TH', sound: '/θ/', words: ['think', 'three', 'thank'], sentences: ['I think you\'re right.', 'Count to three.'], difficulty: 3, category: 'digraphs' }
];

const generateWorksheets = (lesson: PhonicsLesson): Worksheet[] => [
  // Word-Picture Matching
  {
    id: `${lesson.id}_matching`,
    title: `${lesson.letter} Sound Matching`,
    type: 'matching',
    instructions: `Match words that start with the ${lesson.letter} sound`,
    items: lesson.words.map(word => ({
      word,
      options: [word, ...phonicsLessons.filter(l => l.id !== lesson.id).flatMap(l => l.words).slice(0, 3)].sort(() => Math.random() - 0.5),
      correct: word
    })),
    difficulty: lesson.difficulty
  },
  
  // Fill in the Blanks
  {
    id: `${lesson.id}_fill_blanks`,
    title: `Complete the ${lesson.letter} Words`,
    type: 'fill-blanks',
    instructions: `Fill in the missing letters to complete words with the ${lesson.letter} sound`,
    items: lesson.words.map(word => ({
      word,
      blanked: word.replace(lesson.letter.toLowerCase(), '_'),
      answer: lesson.letter.toLowerCase()
    })),
    difficulty: lesson.difficulty
  },
  
  // Sound Sorting
  {
    id: `${lesson.id}_sorting`,
    title: `${lesson.letter} Sound Sorting`,
    type: 'sorting',
    instructions: `Sort words by whether they start with the ${lesson.letter} sound`,
    items: [
      ...lesson.words.map(word => ({ word, hasSound: true })),
      ...phonicsLessons.filter(l => l.id !== lesson.id).flatMap(l => l.words.slice(0, 2)).map(word => ({ word, hasSound: false }))
    ].sort(() => Math.random() - 0.5),
    difficulty: lesson.difficulty
  },
  
  // Reading Practice
  {
    id: `${lesson.id}_reading`,
    title: `Read ${lesson.letter} Sentences`,
    type: 'reading',
    instructions: `Read the sentences and find words with the ${lesson.letter} sound`,
    items: lesson.sentences.map(sentence => ({
      sentence,
      targetWords: lesson.words.filter(word => sentence.toLowerCase().includes(word.toLowerCase()))
    })),
    difficulty: lesson.difficulty
  }
];

export const PhonicsPracticeWorksheets: React.FC<PhonicsPracticeWorksheetsProps> = ({ onBack, onStatsUpdate }) => {
  const [selectedLesson, setSelectedLesson] = useState<PhonicsLesson | null>(null);
  const [selectedWorksheet, setSelectedWorksheet] = useState<Worksheet | null>(null);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const speak = (text: string) => {
    if (!soundEnabled || !('speechSynthesis' in window)) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  const handleLessonSelect = (lesson: PhonicsLesson) => {
    setSelectedLesson(lesson);
    setSelectedWorksheet(null);
    setCurrentItemIndex(0);
    setUserAnswers([]);
    setScore(0);
    setCompleted(false);
  };

  const handleWorksheetSelect = (worksheet: Worksheet) => {
    setSelectedWorksheet(worksheet);
    setCurrentItemIndex(0);
    setUserAnswers([]);
    setScore(0);
    setCompleted(false);
    speak(worksheet.instructions);
  };

  const handleAnswer = (answer: any) => {
    const currentItem = selectedWorksheet!.items[currentItemIndex];
    let isCorrect = false;

    switch (selectedWorksheet!.type) {
      case 'matching':
        isCorrect = answer === currentItem.correct;
        break;
      case 'fill-blanks':
        isCorrect = answer.toLowerCase() === currentItem.answer;
        break;
      case 'sorting':
        isCorrect = answer === currentItem.hasSound;
        break;
      case 'reading':
        isCorrect = answer.length > 0; // Any found words count
        break;
    }

    const newAnswers = [...userAnswers, { answer, correct: isCorrect }];
    setUserAnswers(newAnswers);

    if (isCorrect) {
      setScore(prev => prev + 1);
      toast.success('Correct! 🎉');
      speak('Correct! Great job!');
    } else {
      toast.error('Try again!');
      speak('Try again!');
    }

    if (currentItemIndex < selectedWorksheet!.items.length - 1) {
      setTimeout(() => setCurrentItemIndex(prev => prev + 1), 1500);
    } else {
      setTimeout(() => {
        setCompleted(true);
        const finalScore = isCorrect ? score + 1 : score;
        const percentage = (finalScore / selectedWorksheet!.items.length) * 100;
        
        onStatsUpdate({
          worksheetCompleted: selectedWorksheet!.title,
          score: finalScore,
          totalItems: selectedWorksheet!.items.length,
          accuracy: percentage
        });
        
        speak(`Worksheet completed! You got ${finalScore} out of ${selectedWorksheet!.items.length} correct.`);
      }, 2000);
    }
  };

  const renderWorksheetContent = () => {
    if (!selectedWorksheet || completed) {
      if (completed) {
        const percentage = (score / selectedWorksheet!.items.length) * 100;
        const stars = percentage >= 90 ? 3 : percentage >= 70 ? 2 : 1;
        
        return (
          <div className="text-center p-8">
            <div className="text-6xl mb-4">🎊</div>
            <h3 className="text-2xl font-bold mb-4">Worksheet Complete!</h3>
            <div className="text-lg mb-4">Score: {score}/{selectedWorksheet!.items.length}</div>
            <div className="flex justify-center gap-1 mb-6">
              {Array.from({length: 3}).map((_, i) => (
                <Star key={i} className={`h-8 w-8 ${i < stars ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
              ))}
            </div>
            <div className="space-y-2">
              <Button onClick={() => setSelectedWorksheet(null)} variant="outline">
                Choose Another Worksheet
              </Button>
              <Button onClick={() => setSelectedLesson(null)}>
                Back to Lessons
              </Button>
            </div>
          </div>
        );
      }
      return null;
    }

    const currentItem = selectedWorksheet.items[currentItemIndex];
    
    switch (selectedWorksheet.type) {
      case 'matching':
        return (
          <div className="text-center space-y-6">
            <div className="text-4xl font-bold mb-4">{currentItem.word.toUpperCase()}</div>
            <Button onClick={() => speak(currentItem.word)} variant="outline" className="mb-6">
              <Volume2 className="h-4 w-4 mr-2" />
              Hear Word
            </Button>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {currentItem.options.map((option: string, i: number) => (
                <Button
                  key={i}
                  onClick={() => handleAnswer(option)}
                  variant="outline"
                  className="py-6 text-lg"
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        );

      case 'fill-blanks':
        return (
          <div className="text-center space-y-6">
            <div className="text-2xl font-bold mb-4">Complete the word:</div>
            <div className="text-4xl font-mono tracking-wider mb-6">{currentItem.blanked.toUpperCase()}</div>
            <Input
              placeholder="Type the missing letter"
              className="max-w-xs mx-auto text-center text-xl"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAnswer((e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
            />
            <div className="text-sm text-gray-600">Press Enter to submit</div>
          </div>
        );

      case 'sorting':
        return (
          <div className="text-center space-y-6">
            <div className="text-lg mb-4">Does this word start with the {selectedLesson!.letter} sound?</div>
            <div className="text-4xl font-bold mb-4">{currentItem.word.toUpperCase()}</div>
            <Button onClick={() => speak(currentItem.word)} variant="outline" className="mb-6">
              <Volume2 className="h-4 w-4 mr-2" />
              Hear Word
            </Button>
            <div className="flex justify-center gap-4">
              <Button onClick={() => handleAnswer(true)} className="bg-green-500 hover:bg-green-600 text-white px-8 py-4">
                Yes
              </Button>
              <Button onClick={() => handleAnswer(false)} className="bg-red-500 hover:bg-red-600 text-white px-8 py-4">
                No
              </Button>
            </div>
          </div>
        );

      case 'reading':
        return (
          <div className="text-center space-y-6">
            <div className="text-lg mb-4">Read the sentence and click words with the {selectedLesson!.letter} sound:</div>
            <div className="text-xl mb-6 p-4 bg-gray-50 rounded-lg">
              {currentItem.sentence.split(' ').map((word: string, i: number) => {
                const cleanWord = word.replace(/[.,!?]/g, '').toLowerCase();
                const isTargetWord = currentItem.targetWords.some((target: string) => target.toLowerCase() === cleanWord);
                return (
                  <Button
                    key={i}
                    onClick={() => {
                      if (isTargetWord) {
                        handleAnswer([cleanWord]);
                        speak(cleanWord);
                      }
                    }}
                    variant="ghost"
                    className={`mx-1 ${isTargetWord ? 'hover:bg-blue-100' : ''}`}
                  >
                    {word}
                  </Button>
                );
              })}
            </div>
            <Button onClick={() => speak(currentItem.sentence)} variant="outline">
              <Headphones className="h-4 w-4 mr-2" />
              Read Sentence Aloud
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button onClick={onBack} variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">Phonics & Reading Practice</h1>
              </div>
            </div>
            <Button
              onClick={() => setSoundEnabled(!soundEnabled)}
              variant="ghost"
              size="sm"
            >
              <Volume2 className={`h-4 w-4 ${soundEnabled ? 'text-blue-600' : 'text-gray-400'}`} />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {!selectedLesson ? (
          // Lesson Selection
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Choose a Phonics Lesson</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {['consonants', 'vowels', 'blends', 'digraphs'].map(category => (
                  <div key={category} className="space-y-3">
                    <h3 className="font-bold capitalize text-lg text-center">{category}</h3>
                    {phonicsLessons.filter(lesson => lesson.category === category).map(lesson => (
                      <Card key={lesson.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleLessonSelect(lesson)}>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600 mb-2">{lesson.letter}</div>
                          <div className="text-lg font-semibold mb-1">{lesson.title}</div>
                          <div className="text-sm text-gray-600 mb-2">Sound: {lesson.sound}</div>
                          <div className="text-xs text-gray-500">
                            Words: {lesson.words.join(', ')}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ) : !selectedWorksheet ? (
          // Worksheet Selection
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Choose a Worksheet for {selectedLesson.title}</h2>
                <Button onClick={() => setSelectedLesson(null)} variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Lessons
                </Button>
              </div>
              
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">{selectedLesson.letter}</div>
                  <div className="text-lg mb-2">Sound: {selectedLesson.sound}</div>
                  <Button onClick={() => speak(`Letter ${selectedLesson.letter} makes the ${selectedLesson.sound} sound`)} variant="outline" size="sm">
                    <Volume2 className="h-4 w-4 mr-2" />
                    Hear Sound
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generateWorksheets(selectedLesson).map(worksheet => (
                  <Card key={worksheet.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleWorksheetSelect(worksheet)}>
                    <div className="text-center">
                      <div className="text-2xl mb-2">
                        {worksheet.type === 'matching' && '🔗'}
                        {worksheet.type === 'fill-blanks' && '✏️'}
                        {worksheet.type === 'sorting' && '📋'}
                        {worksheet.type === 'reading' && '📖'}
                      </div>
                      <h3 className="font-bold mb-2">{worksheet.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{worksheet.instructions}</p>
                      <div className="flex justify-center gap-1">
                        {Array.from({length: worksheet.difficulty}).map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        ) : (
          // Worksheet Content
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold">{selectedWorksheet.title}</h2>
                <p className="text-gray-600">{selectedWorksheet.instructions}</p>
              </div>
              <Button onClick={() => setSelectedWorksheet(null)} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Worksheets
              </Button>
            </div>

            {!completed && (
              <div className="mb-6">
                <Progress value={((currentItemIndex + 1) / selectedWorksheet.items.length) * 100} className="w-full" />
                <div className="text-center text-sm text-gray-600 mt-2">
                  Question {currentItemIndex + 1} of {selectedWorksheet.items.length}
                </div>
              </div>
            )}

            {renderWorksheetContent()}
          </Card>
        )}
      </div>
    </div>
  );
};