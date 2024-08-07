

import React, { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import Chessboard from 'chessboardjsx';
import WebSocketInstance from './WebSocketService';

const ChessboardComponent = () => {
    const [game, setGame] = useState(new Chess());
    const [fen, setFen] = useState('start');
    const [status, setStatus] = useState('');
    const [pgn, setPgn] = useState('');

    useEffect(() => {
        // Register callback for receiving the best move from the server
        WebSocketInstance.addCallback('bestMove', handleBestMove);
        WebSocketInstance.addCallback('openingMove', handleOpeningMove);

        return () => {
            // Optionally, remove callback or clean up on component unmount
        };
    }, []);

    const handleOpeningMove = (data) => {
        game.move(data.san)
        setFen(game.fen());
        updateStatus();
    }
    const handleBestMove = (data) => {
        const move = {
            from: data.bestMove.from.toLowerCase(),
            to: data.bestMove.to.toLowerCase(),
        };
        game.move(move);
        setFen(game.fen());
        updateStatus();
    };

    const onDragStart = (source, piece) => {
        if (game.game_over()) return false;

        if (
            (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
            (game.turn() === 'b' && piece.search(/^w/) !== -1)
        ) {
            return false;
        }
    };

    const onDrop = ({ sourceSquare, targetSquare }) => {
        try {
            const move = game.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: 'q', // always promote to a queen for simplicity
            });

            setFen(game.fen());
            updateStatus();

            // Send move to WebSocket server
            WebSocketInstance.sendMessage({
                type: 'move',
                move: {
                    moveNotation: move.san,
                    from: sourceSquare,
                    to: targetSquare,
                    fen: game.fen(),
                },
            });
        } catch {
            return 'snapback';
        }
    };

    const onSnapEnd = () => {
        setFen(game.fen());
    };

    const updateStatus = () => {
        let status = '';

        const moveColor = game.turn() === 'b' ? 'Black' : 'White';

        if (game.isCheckmate()) {
            status = `Game over, ${moveColor} is in checkmate.`;
        } else if (game.isDraw()) {
            status = 'Game over, drawn position';
        } else {
            status = `${moveColor} to move`;

            if (game.isCheck()) {
                status += `, ${moveColor} is in check`;
            }
        }

        setStatus(status);
        setPgn(game.pgn());
    };

    return (
        <div>
            <Chessboard
                id="myBoard"
                width={400}
                position={fen}
                draggable={true}
                onDrop={onDrop}
                onSnapEnd={onSnapEnd}
                onDragStart={onDragStart}
            />
            <div id="status">{status}</div>
            <div id="fen">{fen}</div>
            <div id="pgn">{pgn}</div>
        </div>
    );
};

export default ChessboardComponent;

