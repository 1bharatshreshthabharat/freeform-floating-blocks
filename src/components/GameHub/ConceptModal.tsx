
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Concept {
  title: string;
  description: string;
  example: string;
  animation?: string;
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
  const [currentConcept, setCurrentConcept] = useState(0);
  const [currentTab, setCurrentTab] = useState<'learn' | 'howToPlay'>('learn');
  
  const handleNextConcept = () => {
    setCurrentConcept((prev) => (prev + 1) % concepts.length);
  };
  
  const handlePrevConcept = () => {
    setCurrentConcept((prev) => (prev === 0 ? concepts.length - 1 : prev - 1));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {gameTitle} Learning Center
          </DialogTitle>
        </DialogHeader>
        
        {/* Tab navigation */}
        <div className="flex border-b mb-4">
          <button 
            className={`py-2 px-4 font-medium ${currentTab === 'learn' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setCurrentTab('learn')}
          >
            Concepts
          </button>
          <button 
            className={`py-2 px-4 font-medium ${currentTab === 'howToPlay' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setCurrentTab('howToPlay')}
          >
            How to Play
          </button>
        </div>
        
        {currentTab === 'learn' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1 bg-blue-50 p-4 rounded-lg">
                <h3 className="font-bold text-lg text-blue-800 mb-3">Concepts</h3>
                <ul className="space-y-2">
                  {concepts.map((concept, index) => (
                    <li 
                      key={index}
                      className={`p-2 rounded cursor-pointer ${
                        currentConcept === index 
                          ? 'bg-blue-200 font-medium' 
                          : 'hover:bg-blue-100'
                      }`}
                      onClick={() => setCurrentConcept(index)}
                    >
                      {concept.title}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="md:col-span-2 bg-gray-50 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <button 
                    onClick={handlePrevConcept}
                    className="text-blue-500 hover:text-blue-700 font-medium"
                  >
                    ← Previous
                  </button>
                  <h3 className="text-xl font-bold text-center">{concepts[currentConcept].title}</h3>
                  <button 
                    onClick={handleNextConcept}
                    className="text-blue-500 hover:text-blue-700 font-medium"
                  >
                    Next →
                  </button>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-700 mb-4">{concepts[currentConcept].description}</p>
                  
                  <div className="bg-white p-4 border border-gray-200 rounded-md mb-4 prose max-w-none">
                    <pre className="whitespace-pre-wrap font-mono text-sm">{concepts[currentConcept].example}</pre>
                  </div>
                  
                  {concepts[currentConcept].animation && (
                    <div className="flex justify-center my-4">
                      <img 
                        src={concepts[currentConcept].animation} 
                        alt={concepts[currentConcept].title} 
                        className="rounded-lg shadow-md max-h-48"
                      />
                    </div>
                  )}
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Related Topics:</h4>
                  <div className="flex flex-wrap gap-2">
                    {concepts[currentConcept].relatedTopics.map((topic, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        
        {currentTab === 'howToPlay' && (
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">How to Play {gameTitle}</h3>
            
            {gameTitle === "Enhanced Chess" ? (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold mb-2">Basic Rules</h4>
                  <p className="mb-4">Chess is played on an 8x8 grid with alternating light and dark squares. Each player starts with 16 pieces: 1 king, 1 queen, 2 rooks, 2 bishops, 2 knights, and 8 pawns. The goal is to checkmate your opponent's king.</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium mb-2">Piece Movement:</h5>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li><strong>King:</strong> One square in any direction</li>
                        <li><strong>Queen:</strong> Any number of squares diagonally, horizontally, or vertically</li>
                        <li><strong>Rook:</strong> Any number of squares horizontally or vertically</li>
                        <li><strong>Bishop:</strong> Any number of squares diagonally</li>
                        <li><strong>Knight:</strong> L-shape (2 squares in one direction, then 1 square perpendicular)</li>
                        <li><strong>Pawn:</strong> One square forward (two on first move), captures diagonally</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Special Moves:</h5>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li><strong>Castling:</strong> King moves two squares toward rook, and rook moves to opposite side</li>
                        <li><strong>En Passant:</strong> Pawn captures enemy pawn that moved two squares</li>
                        <li><strong>Promotion:</strong> Pawn reaching the opposite rank becomes any piece except king</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-2">Check, Checkmate & Draw</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Check:</strong> When the king is under attack by an enemy piece</li>
                    <li><strong>Checkmate:</strong> When the king is in check and has no legal move to escape</li>
                    <li><strong>Stalemate:</strong> When a player has no legal moves but is not in check (draw)</li>
                    <li><strong>50-Move Rule:</strong> Draw if no captures or pawn moves in 50 consecutive turns</li>
                    <li><strong>Threefold Repetition:</strong> Draw if the same position occurs three times</li>
                    <li><strong>Insufficient Material:</strong> Draw if neither player has enough pieces to checkmate</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-2">Game Controls in Enhanced Chess</h4>
                  <p className="mb-2">Our enhanced interface offers several features to improve your chess experience:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Click on a piece to select it, then click on a valid square to move</li>
                    <li>Customize board appearance, piece sets, and animation speeds</li>
                    <li>Get strategic hints and view your move history</li>
                    <li>Track captured pieces and game stats</li>
                    <li>Adjust difficulty levels when playing against the computer</li>
                    <li>Use analysis mode to explore different positions</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold mb-2">Tips for Beginners</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Control the center of the board</li>
                    <li>Develop your knights and bishops early</li>
                    <li>Castle your king to safety</li>
                    <li>Connect your rooks</li>
                    <li>Look for tactics like forks, pins, and skewers</li>
                    <li>Always think about what your opponent's next move might be</li>
                    <li>Practice regularly and analyze your games</li>
                  </ul>
                </div>
              </div>
            ) : gameTitle === "Ludo King" ? (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold mb-2">Game Overview</h4>
                  <p>Ludo is a classic board game where players race their four tokens from start to finish based on dice rolls. The first player to get all four tokens home wins.</p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-2">Basic Rules</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Each player has 4 tokens that begin in their respective colored home yard</li>
                    <li>Players take turns rolling a die</li>
                    <li>Roll a 6 to move a token out of the home yard onto the starting square</li>
                    <li>After rolling a 6, the player gets an extra turn</li>
                    <li>Three consecutive 6s forfeit the player's turn</li>
                    <li>Tokens move clockwise around the board according to the die value</li>
                    <li>If a token lands on an opponent's token, the opponent's token returns to its home yard</li>
                    <li>Tokens are safe on colored squares and star squares</li>
                    <li>To enter the home column, a token must make a precise roll</li>
                    <li>The first player to get all four tokens to the home triangle wins</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-2">Game Controls</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Click the dice to roll</li>
                    <li>Click on a token to move it by the dice value</li>
                    <li>When multiple moves are possible, choose which token to move</li>
                    <li>Game automatically highlights valid moves</li>
                    <li>Use settings to adjust game mode and player count</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold mb-2">Strategy Tips</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Get tokens out early when possible</li>
                    <li>Keep tokens spread apart to reduce the risk of multiple captures</li>
                    <li>Block opponent pathways when possible</li>
                    <li>Aim to create "blockers" with two tokens on the same space</li>
                    <li>Be aggressive with captures when you're behind</li>
                    <li>Plan your home approach carefully</li>
                    <li>Prioritize moving tokens that are furthest behind</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-600 py-8">
                <p>Game-specific instructions will appear here.</p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
