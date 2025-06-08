
import React, { useCallback } from 'react';
import { useChessGame } from './ChessGameProvider';

const boardThemes = {
  classic: { light: '#F0D9B5', dark: '#B58863', border: '#A0522D' },
  marble: { light: '#E3E3E3', dark: '#C8C8C8', border: '#778899' },
  metal: { light: '#D3D3D3', dark: '#A9A9A9', border: '#808080' },
  neon: { light: '#00FFFF', dark: '#FF00FF', border: '#FFFF00' }
};

interface ChessBoardRendererProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export const useChessBoardRenderer = ({ canvasRef }: ChessBoardRendererProps) => {
  const {
    board,
    selectedPiece,
    validMoves,
    customization,
    getPieceSymbol
  } = useChessGame();

  const drawBoard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const boardTheme = boardThemes[customization.boardTheme as keyof typeof boardThemes] || boardThemes.classic;
    const squareSize = canvas.width / 8;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw board squares
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const isLightSquare = (row + col) % 2 === 0;
        ctx.fillStyle = isLightSquare ? boardTheme.light : boardTheme.dark;
        ctx.fillRect(col * squareSize, row * squareSize, squareSize, squareSize);

        // Highlight selected square
        if (selectedPiece && selectedPiece.x === col && selectedPiece.y === row) {
          ctx.fillStyle = 'rgba(255, 255, 0, 0.7)';
          ctx.fillRect(col * squareSize, row * squareSize, squareSize, squareSize);
        }

        // Highlight valid moves
        if (customization.highlightMoves) {
          validMoves.forEach(move => {
            if (move.x === col && move.y === row) {
              ctx.fillStyle = board[row][col] ? 'rgba(255, 0, 0, 0.5)' : 'rgba(0, 255, 0, 0.5)';
              ctx.beginPath();
              ctx.arc(
                col * squareSize + squareSize / 2, 
                row * squareSize + squareSize / 2, 
                squareSize / 6, 
                0, 
                Math.PI * 2
              );
              ctx.fill();
            }
          });
        }

        // Draw coordinates
        if (customization.showCoordinates) {
          ctx.font = '12px Arial';
          ctx.fillStyle = isLightSquare ? '#666' : '#999';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';
          if (col === 0) {
            ctx.fillText(`${8 - row}`, col * squareSize + 2, row * squareSize + 2);
          }
          if (row === 7) {
            ctx.fillText(`abcdefgh`[col], col * squareSize + 2, row * squareSize + squareSize - 14);
          }
        }

        // Draw pieces
        const piece = board[row][col];
        if (piece) {
          const pieceSymbol = getPieceSymbol(piece.type, piece.color);
          ctx.font = `${squareSize * 0.7}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = piece.color === 'white' ? '#FFF' : '#000';
          ctx.strokeStyle = piece.color === 'white' ? '#000' : '#FFF';
          ctx.lineWidth = 1;
          ctx.strokeText(
            pieceSymbol, 
            col * squareSize + squareSize / 2, 
            row * squareSize + squareSize / 2
          );
          ctx.fillText(
            pieceSymbol, 
            col * squareSize + squareSize / 2, 
            row * squareSize + squareSize / 2
          );
        }
      }
    }

    // Draw border
    ctx.strokeStyle = boardTheme.border;
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
  }, [board, selectedPiece, validMoves, customization, getPieceSymbol]);

  return { drawBoard };
};
