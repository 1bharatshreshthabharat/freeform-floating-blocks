
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, ExternalLink, Play, BookOpen, Lightbulb, Target } from 'lucide-react';

interface Concept {
  title: string;
  description: string;
  example: string;
  animation: string;
  relatedTopics: string[];
}

interface ConceptModalProps {
  isOpen: boolean;
  onClose: () => void;
  concepts: Concept[];
  gameTitle: string;
}

export const ConceptModal: React.FC<ConceptModalProps> = ({
  isOpen,
  onClose,
  concepts,
  gameTitle
}) => {
  const [currentConceptIndex, setCurrentConceptIndex] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);

  const currentConcept = concepts[currentConceptIndex];

  const nextConcept = () => {
    setCurrentConceptIndex((prev) => (prev + 1) % concepts.length);
    setShowAnimation(false);
  };

  const prevConcept = () => {
    setCurrentConceptIndex((prev) => (prev - 1 + concepts.length) % concepts.length);
    setShowAnimation(false);
  };

  const playAnimation = () => {
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 3000);
  };

  const handleRelatedTopicClick = (topic: string) => {
    // Show detailed explanation inline instead of alert
    const explanations = {
      "Center Control": "Controlling the center squares (e4, e5, d4, d5) gives your pieces more mobility and limits your opponent's options. Place pawns and pieces to influence these key squares.",
      "Piece Development": "Bring your pieces from their starting squares to more active positions. Develop knights before bishops, and castle early to protect your king.",
      "King Safety": "Your king is the most important piece. Castle early to move it to safety, and avoid moving pawns in front of your castled king unless necessary.",
      "Time Management": "Don't waste moves in the opening. Each move should serve a purpose: control center, develop pieces, or improve king safety.",
      "Pins": "A pin occurs when a piece cannot move without exposing a more valuable piece behind it. Use pins to restrict opponent's mobility.",
      "Forks": "Attack two enemy pieces simultaneously with one of your pieces. Knights are particularly good at creating forks.",
      "Skewers": "Force a valuable piece to move, exposing a less valuable piece behind it. Opposite of a pin.",
      "Discovered Attacks": "Move one piece to reveal an attack from another piece behind it. Very powerful tactical motif.",
      "Double Attacks": "Attack two targets simultaneously, forcing opponent to choose which one to defend.",
      "Board Setup": "The chessboard has 64 squares arranged in 8x8 grid. Light square always goes on the right side of each player.",
      "Piece Movement": "Each piece moves in a unique way: pawns forward, rooks straight lines, bishops diagonally, knights in L-shape, queen combines rook and bishop, king one square any direction.",
      "Special Moves": "Castling, en passant capture, and pawn promotion are special moves that add strategic depth to the game.",
      "Check & Checkmate": "Check means the king is under attack. Checkmate means the king is under attack and cannot escape - this ends the game.",
      "Draw Conditions": "Games can end in a draw through stalemate, insufficient material, 50-move rule, threefold repetition, or mutual agreement."
    };
    
    alert(explanations[topic as keyof typeof explanations] || `Learn more about ${topic} through practice and study.`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center space-x-2">
            <BookOpen className="h-6 w-6" />
            <span>{gameTitle} Learning Center</span>
          </DialogTitle>
        </DialogHeader>

        {currentConcept && (
          <div className="space-y-6">
            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button onClick={prevConcept} variant="outline" disabled={concepts.length <= 1}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {currentConceptIndex + 1} of {concepts.length}
              </Badge>
              <Button onClick={nextConcept} variant="outline" disabled={concepts.length <= 1}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>

            {/* Main Concept Card */}
            <Card className="border-2 border-blue-200">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                <CardTitle className="text-2xl text-blue-800 flex items-center space-x-2">
                  <Target className="h-6 w-6" />
                  <span>{currentConcept.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <p className="text-gray-700 text-lg leading-relaxed">{currentConcept.description}</p>

                {/* Animation Section */}
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-lg border">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-lg flex items-center space-x-2">
                      <Play className="h-5 w-5" />
                      <span>Visual Example</span>
                    </h4>
                    <Button onClick={playAnimation} size="sm" className="bg-green-500 hover:bg-green-600">
                      <Play className="h-4 w-4 mr-2" />
                      {showAnimation ? 'Playing...' : 'Play Animation'}
                    </Button>
                  </div>
                  
                  <div className="relative">
                    <img
                      src={currentConcept.animation}
                      alt={currentConcept.title}
                      className={`w-full h-64 object-cover rounded transition-all duration-500 ${
                        showAnimation ? 'scale-105 shadow-lg' : ''
                      }`}
                    />
                    {showAnimation && (
                      <div className="absolute inset-0 bg-blue-500 bg-opacity-20 rounded flex items-center justify-center">
                        <div className="text-white font-bold text-2xl animate-pulse bg-blue-600 px-4 py-2 rounded">
                          ✨ Animation Playing ✨
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Detailed Example */}
                <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
                  <h4 className="font-semibold mb-3 text-lg flex items-center space-x-2">
                    <Lightbulb className="h-5 w-5 text-yellow-600" />
                    <span>Detailed Example:</span>
                  </h4>
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono bg-white p-4 rounded border leading-relaxed">
                    {currentConcept.example}
                  </pre>
                </div>

                {/* Related Topics with Detailed Explanations */}
                <div>
                  <h4 className="font-semibold mb-3 text-lg">Explore Related Topics:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {currentConcept.relatedTopics.map((topic, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-sm h-auto py-3 px-4 justify-start hover:bg-blue-50"
                        onClick={() => handleRelatedTopicClick(topic)}
                      >
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{topic}</span>
                          <span className="text-xs text-gray-500">Click to learn</span>
                        </div>
                        <ExternalLink className="h-3 w-3 ml-auto" />
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pro Tips */}
            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
              <CardHeader>
                <CardTitle className="text-lg text-yellow-800 flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5" />
                  <span>💡 Pro Tips for Mastery</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-yellow-700 space-y-2">
                  <li className="flex items-start space-x-2">
                    <span>•</span>
                    <span>Practice regularly with puzzles and games to build pattern recognition</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span>•</span>
                    <span>Apply these concepts during live gameplay for real improvement</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span>•</span>
                    <span>Use the hint system when you're stuck to learn new ideas</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span>•</span>
                    <span>Study master games to see these concepts in action</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span>•</span>
                    <span>Don't be afraid to experiment - mistakes are learning opportunities</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Action Button */}
            <div className="flex justify-center">
              <Button onClick={onClose} className="bg-blue-500 hover:bg-blue-600 px-8 py-3">
                Back to Game
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
