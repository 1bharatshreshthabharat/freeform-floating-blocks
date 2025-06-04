
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, ExternalLink, Play } from 'lucide-react';

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
    // Animation would play here
    setTimeout(() => setShowAnimation(false), 3000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {gameTitle} Learning Concepts
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
              <Badge variant="secondary">
                {currentConceptIndex + 1} of {concepts.length}
              </Badge>
              <Button onClick={nextConcept} variant="outline" disabled={concepts.length <= 1}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>

            {/* Main Concept Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-blue-800">{currentConcept.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">{currentConcept.description}</p>

                {/* Animation Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold">Visual Example</h4>
                    <Button onClick={playAnimation} size="sm" className="bg-green-500 hover:bg-green-600">
                      <Play className="h-4 w-4 mr-2" />
                      {showAnimation ? 'Playing...' : 'Play Animation'}
                    </Button>
                  </div>
                  
                  <div className="relative">
                    <img
                      src={currentConcept.animation}
                      alt={currentConcept.title}
                      className={`w-full h-48 object-cover rounded transition-all duration-500 ${
                        showAnimation ? 'scale-105 shadow-lg' : ''
                      }`}
                    />
                    {showAnimation && (
                      <div className="absolute inset-0 bg-blue-500 bg-opacity-20 rounded flex items-center justify-center">
                        <div className="text-white font-bold text-xl animate-pulse">
                          ✨ Animation Playing ✨
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Example */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Example:</h4>
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                    {currentConcept.example}
                  </pre>
                </div>

                {/* Related Topics */}
                <div>
                  <h4 className="font-semibold mb-3">Related Topics:</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentConcept.relatedTopics.map((topic, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => {
                          // In a real app, this would link to more detailed explanations
                          alert(`Learning more about: ${topic}`);
                        }}
                      >
                        {topic}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Reference */}
            <Card className="bg-yellow-50 border-yellow-200">
              <CardHeader>
                <CardTitle className="text-lg text-yellow-800">💡 Quick Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Practice regularly to build mastery</li>
                  <li>• Apply these concepts during gameplay</li>
                  <li>• Use hints when you're stuck</li>
                  <li>• Don't be afraid to experiment and learn from mistakes</li>
                </ul>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <Button onClick={onClose} variant="outline">
                Back to Game
              </Button>
              <Button className="bg-blue-500 hover:bg-blue-600">
                Practice This Concept
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
