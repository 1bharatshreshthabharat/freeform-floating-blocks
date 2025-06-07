
import React, { useEffect, useCallback, useState } from 'react';
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
    currentPlayer,
    customization, 
    capturedAnimation, 
    canvasRef,
    setBoard,
    setCapturedPieces,
    setSelectedPiece,
    setValidMoves,
    setCurrentPlayer,
    getPieceSymbol,
    getValidMoves,
    setShowVictory,
    setWinner,
    onStatsUpdate
  } = useChessGame();

  const [draggedPiece, setDraggedPiece] = useState<{piece: any, startPos: {x: number, y: number}} | null>(null);

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
      setCapturedPieces(prev => ({
        ...prev,
        [newBoard[toY][toX]!.color]: [...prev[newBoard[toY][toX]!.color], getPieceSymbol(newBoard[toY][toX]!.type, newBoard[toY][toX]!.color)]
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

  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / (canvas.width / 8));
    const y = Math.floor((event.clientY - rect.top) / (canvas.height / 8));

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
  }, [board, selectedPiece, currentPlayer, makeMove, setSelectedPiece, setValidMoves, getValidMoves]);

  // Drag and drop handlers
  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / (canvas.width / 8));
    const y = Math.floor((event.clientY - rect.top) / (canvas.height / 8));

    const piece = board[y][x];
    if (piece && piece.color === currentPlayer) {
      setDraggedPiece({ piece, startPos: { x, y } });
      setSelectedPiece({ x, y });
      setValidMoves(getValidMoves(x, y));
    }
  }, [board, currentPlayer, setSelectedPiece, setValidMoves, getValidMoves]);

  const handleMouseUp = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggedPiece) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / (canvas.width / 8));
    const y = Math.floor((event.clientY - rect.top) / (canvas.height / 8));

    makeMove(draggedPiece.startPos.x, draggedPiece.startPos.y, x, y);
    setDraggedPiece(null);
  }, [draggedPiece, makeMove]);

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
        if (piece && !(draggedPiece && draggedPiece.startPos.x === col && draggedPiece.startPos.y === row)) {
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
  }, [board, selectedPiece, validMoves, customization, getPieceSymbol, draggedPiece]);

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
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
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
