
import React, { useCallback, useState } from 'react';
import { useChessGame } from './ChessGameProvider';

interface ChessBoardInputProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  makeMove: (fromX: number, fromY: number, toX: number, toY: number) => boolean;
}

export const useChessBoardInput = ({ canvasRef, makeMove }: ChessBoardInputProps) => {
  const {
    board,
    selectedPiece,
    currentPlayer,
    setSelectedPiece,
    setValidMoves,
    getValidMoves
  } = useChessGame();

  const [draggedPiece, setDraggedPiece] = useState<{piece: any, startPos: {x: number, y: number}} | null>(null);

  const getCanvasCoordinates = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((clientX - rect.left) / (canvas.width / 8));
    const y = Math.floor((clientY - rect.top) / (canvas.height / 8));
    
    return { x, y };
  }, [canvasRef]);

  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoordinates(event.clientX, event.clientY);

    if (selectedPiece) {
      if (x === selectedPiece.x && y === selectedPiece.y) {
        // Deselect if clicking same piece
        setSelectedPiece(null);
        setValidMoves([]);
      } else {
        // Try to make move
        const moved = makeMove(selectedPiece.x, selectedPiece.y, x, y);
        if (!moved && board[y][x] && board[y][x]?.color === currentPlayer) {
          // Select new piece if move failed and clicked on own piece
          setSelectedPiece({ x, y });
          setValidMoves(getValidMoves(x, y));
        }
      }
    } else {
      // Select piece if it belongs to current player
      if (board[y][x] && board[y][x]?.color === currentPlayer) {
        setSelectedPiece({ x, y });
        setValidMoves(getValidMoves(x, y));
      }
    }
  }, [board, selectedPiece, currentPlayer, makeMove, setSelectedPiece, setValidMoves, getValidMoves, getCanvasCoordinates]);

  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoordinates(event.clientX, event.clientY);
    const piece = board[y][x];
    
    if (piece && piece.color === currentPlayer) {
      setDraggedPiece({ piece, startPos: { x, y } });
      setSelectedPiece({ x, y });
      setValidMoves(getValidMoves(x, y));
    }
  }, [board, currentPlayer, setSelectedPiece, setValidMoves, getValidMoves, getCanvasCoordinates]);

  const handleMouseUp = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggedPiece) return;

    const { x, y } = getCanvasCoordinates(event.clientX, event.clientY);
    makeMove(draggedPiece.startPos.x, draggedPiece.startPos.y, x, y);
    setDraggedPiece(null);
  }, [draggedPiece, makeMove, getCanvasCoordinates]);

  return {
    handleCanvasClick,
    handleMouseDown,
    handleMouseUp,
    draggedPiece
  };
};
