
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-purple-700 text-center">
            🎮 How to Play Word Wonders! 🎮
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 p-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="text-lg font-bold text-blue-700 mb-2">🎯 Basic Gameplay</h3>
            <ul className="space-y-2 text-blue-600">
              <li>• Drag floating letters to spell words</li>
              <li>• Drop letters in the correct order</li>
              <li>• Complete words to earn points and stars</li>
              <li>• Watch your time and lives!</li>
            </ul>
          </div>

          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h3 className="text-lg font-bold text-green-700 mb-2">🎮 Game Modes</h3>
            <div className="space-y-3 text-green-600">
              <div>
                <strong>🏃 Complete the Verb:</strong> Fill in missing action words in sentences
              </div>
              <div>
                <strong>🔤 Make Many Words:</strong> Create as many words as possible from given letters
              </div>
              <div>
                <strong>🧩 Fix Broken Word:</strong> Unscramble mixed-up letters to form the correct word
              </div>
              <div>
                <strong>🧠 Word Riddle:</strong> Solve riddles by spelling the answer
              </div>
              <div>
                <strong>📝 Guess the Word:</strong> Pick letters to complete words in sentences
              </div>
              <div>
                <strong>🕵️ Hidden Word:</strong> Find the hidden word from scrambled letters
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <h3 className="text-lg font-bold text-yellow-700 mb-2">💡 Tips & Tricks</h3>
            <ul className="space-y-2 text-yellow-600">
              <li>• Listen for voice hints after 15 seconds</li>
              <li>• Golden letters are correct when hints are shown</li>
              <li>• Use the pause button to take breaks</li>
              <li>• Try different themes for variety!</li>
            </ul>
          </div>

          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <h3 className="text-lg font-bold text-purple-700 mb-2">⭐ Scoring</h3>
            <ul className="space-y-2 text-purple-600">
              <li>• 10 points per correct letter placement</li>
              <li>• 100 points per completed word</li>
              <li>• Bonus points for quick completion</li>
              <li>• Collect stars for achievements!</li>
            </ul>
          </div>

          <Button 
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3"
          >
            🚀 Start Playing!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
