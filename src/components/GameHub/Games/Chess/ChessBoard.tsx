
import React, { useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useChessGame } from './ChessGameProvider';
import { useChessBoardRenderer } from './ChessBoardRenderer';
import { useChessBoardInput } from './ChessBoardInput';

export const ChessBoard: React.FC = () => {
  const { 
    board, 
    validMoves, 
    currentPlayer,
    capturedAnimation, 
    canvasRef,
    setBoard,
    setCapturedPieces,
    setSelectedPiece,
    setValidMoves,
    setCurrentPlayer,
    getPieceSymbol,
    setShowVictory,
    setWinner,
    onStatsUpdate
  } = useChessGame();

  const checkGameEnd = useCallback(() => {
    const whiteKing = board.flat().find(piece => piece && piece.type === 'king' && piece.color === 'white');
    const blackKing = board.flat().find(piece => piece && piece.type === 'king' && piece.color === 'black');
    
    if (!whiteKing) {
      setWinner('Black');
      setShowVictory(true);
      onStatsUpdate((prev: any) => ({ ...prev, gamesPlayed: prev.gamesPlayed + 1 }));
    } else if (!blackKing) {
      setWinner('White');
      setShowVictory(true);
      onStatsUpdate((prev: any) => ({ ...prev, gamesPlayed: prev.gamesPlayed + 1 }));
    }
  }, [board, setWinner, setShowVictory, onStatsUpdate]);

  const makeMove = useCallback((fromX: number, fromY: number, toX: number, toY: number) => {
    const piece = board[fromY][fromX];
    if (!piece || piece.color !== currentPlayer) return false;

    const isValidMove = validMoves.some(move => move.x === toX && move.y === toY);
    if (!isValidMove) return false;

    // Create new board with the move
    const newBoard = board.map(row => [...row]);
    
    // Capture piece if exists
    if (newBoard[toY][toX]) {
      const capturedPiece = newBoard[toY][toX]!;
      const capturedSymbol = getPieceSymbol(capturedPiece.type, capturedPiece.color);
      setCapturedPieces(prev => ({
        ...prev,
        [capturedPiece.color]: [...prev[capturedPiece.color], capturedSymbol]
      }));
    }
    
    // Move piece
    newBoard[toY][toX] = piece;
    newBoard[fromY][fromX] = null;

    // Update board and game state
    setBoard(newBoard);
    setSelectedPiece(null);
    setValidMoves([]);
    setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
    
    setTimeout(checkGameEnd, 100);
    return true;
  }, [board, currentPlayer, validMoves, setCapturedPieces, getPieceSymbol, setBoard, setSelectedPiece, setValidMoves, setCurrentPlayer, checkGameEnd]);

  const renderer = useChessBoardRenderer({ canvasRef });
  const inputHandler = useChessBoardInput({ canvasRef, makeMove });

  useEffect(() => {
    renderer.drawBoard();
  }, [renderer.drawBoard]);

  return (
    <Card className="flex-1 shadow-2xl">
      <CardContent className="p-6">
        <div className="flex justify-center">
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={640}
              height={640}
              className="border-4 border-amber-300 rounded-lg shadow-lg cursor-pointer"
              style={{
              height: 'auto',
              maxWidth: '100%',
              // Add responsive minHeight overrides
            // minHeight: '40vh', // Taller on small screens
            }}
              onClick={inputHandler.handleCanvasClick}
              onMouseDown={inputHandler.handleMouseDown}
              onMouseUp={inputHandler.handleMouseUp}
            />
            
            {capturedAnimation.show && (
              <div 
                className="absolute pointer-events-none animate-bounce text-3xl"
                style={{
                  left: capturedAnimation.position.x,
                  top: capturedAnimation.position.y,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                ⚡ {capturedAnimation.piece} ⚡
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
