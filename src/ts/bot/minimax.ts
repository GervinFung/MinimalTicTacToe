import Board, { checkmate, stalemate } from '../board';
import { isFirstPlayer } from '../league';
import Move from '../move';
import { makeMoveFromMoves } from '../player';
import { evaluate } from './evaluator';

const min = (
    board: Board,
    depth: number,
    highestValue: number,
    lowestValue: number,
    dimension: number,
    immutableDepth: number
): number => {
    if (checkmate(board)) {
        return 10 - depth;
    }
    if (stalemate(board)) {
        return -depth;
    }
    if (dimension > 3 && depth === 0) {
        return evaluate(board, immutableDepth - depth);
    }
    let currentLowest = lowestValue;
    const currentPlayer = board.currentPlayer;
    for (const move of currentPlayer.legalMoves) {
        const latestBoard = makeMoveFromMoves(move, board);
        currentLowest = Math.min(
            currentLowest,
            max(
                latestBoard,
                depth - 1,
                highestValue,
                currentLowest,
                dimension,
                immutableDepth
            )
        );
        if (currentLowest <= highestValue) {
            return highestValue;
        }
    }
    return currentLowest;
};

const max = (
    board: Board,
    depth: number,
    highestValue: number,
    lowestValue: number,
    dimension: number,
    immutableDepth: number
): number => {
    if (checkmate(board)) {
        return depth - 10;
    }
    if (stalemate(board)) {
        return depth;
    }
    if (dimension > 3 && depth === 0) {
        return evaluate(board, immutableDepth - depth);
    }
    let currentHighest = highestValue;
    const currentPlayer = board.currentPlayer;
    for (const move of currentPlayer.legalMoves) {
        const latestBoard = makeMoveFromMoves(move, board);
        currentHighest = Math.max(
            currentHighest,
            min(
                latestBoard,
                depth - 1,
                currentHighest,
                lowestValue,
                dimension,
                immutableDepth
            )
        );
        if (currentHighest >= lowestValue) {
            return lowestValue;
        }
    }
    return currentHighest;
};

export const execute = (board: Board, depth = 4): Move => {
    const currentPlayer = board.currentPlayer;
    const dimension = Math.sqrt(board.numberOfTiles);
    let highestSeenValue = Number.NEGATIVE_INFINITY,
        lowestSeenValue = Number.POSITIVE_INFINITY;
    let bestMove: Move | null = null;

    for (const move of currentPlayer.legalMoves) {
        const latestBoard = makeMoveFromMoves(move, board);
        if (checkmate(latestBoard)) {
            return move;
        }
        const currentVal = isFirstPlayer(currentPlayer.league)
            ? min(
                  latestBoard,
                  depth - 1,
                  highestSeenValue,
                  lowestSeenValue,
                  dimension,
                  depth
              )
            : max(
                  latestBoard,
                  depth - 1,
                  highestSeenValue,
                  lowestSeenValue,
                  dimension,
                  depth
              );

        if (
            isFirstPlayer(currentPlayer.league) &&
            currentVal > highestSeenValue
        ) {
            highestSeenValue = currentVal;
            bestMove = move;
        } else if (
            !isFirstPlayer(currentPlayer.league) &&
            currentVal < lowestSeenValue
        ) {
            lowestSeenValue = currentVal;
            bestMove = move;
        }
    }
    if (bestMove === null) {
        throw new Error('best move cannot be null');
    }
    return bestMove;
};
