
import React, { useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useChessGame } from './ChessGameProvider';

const boardThemes = {
  classic: { light: '#F0D9B5', dark: '#B58863', border: '#A0522D' },
  marble: { light: '#E3E3E3', dark: '#C8C8C8', border: '#778899' },
  metal: { light: '#D3D3D3', dark: '#A9A9A9', border: '#808080' },
  neon: { light: '#00FFFF', dark: '#FF00FF', border: '#FFFF00' }
};

export const ChessBoard: React.FC = () => {
  const { 
    board, 
    selectedPiece, 
    validMoves, 
    customization, 
    capturedAnimation, 
    canvasRef, 
    handleCanvasClick,
    getPieceSymbol
  } = useChessGame();

  const drawBoard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const boardTheme = boardThemes[customization.boardTheme as keyof typeof boardThemes];
    const squareSize = canvas.width / 8;

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const isLightSquare = (row + col) % 2 === 0;
        ctx.fillStyle = isLightSquare ? boardTheme.light : boardTheme.dark;
        ctx.fillRect(col * squareSize, row * squareSize, squareSize, squareSize);

        if (customization.showCoordinates) {
          ctx.font = '12px Arial';
          ctx.fillStyle = '#333';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';
          if (col === 0) ctx.fillText(`${8 - row}`, col * squareSize + 2, row * squareSize + 2);
          if (row === 7) ctx.fillText(`abcdefgh`[col], col * squareSize + 2, row * squareSize + squareSize - 14);
        }

        if (selectedPiece && customization.highlightMoves) {
          validMoves.forEach(move => {
            if (move.x === col && move.y === row) {
              ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
              ctx.fillRect(col * squareSize, row * squareSize, squareSize, squareSize);
            }
          });
        }

        const piece = board[row][col];
        if (piece) {
          const pieceSymbol = getPieceSymbol(piece.type, piece.color);
          ctx.font = `${squareSize * 0.7}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = piece.color === 'white' ? '#333' : '#000';
          ctx.fillText(pieceSymbol, col * squareSize + squareSize / 2, row * squareSize + squareSize / 2);
        }
      }
    }

    ctx.strokeStyle = boardTheme.border;
    ctx.lineWidth = 5;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
  }, [board, selectedPiece, validMoves, customization, getPieceSymbol]);

  useEffect(() => {
    drawBoard();
  }, [drawBoard]);

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
              onClick={handleCanvasClick}
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
