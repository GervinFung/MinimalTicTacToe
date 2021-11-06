import Board, { createTicTacToeBoard } from './board';
import League, { isFirstPlayer } from './league';
import Piece, { createPiece } from './piece';
import Tile, { createTile } from './tile';

type Move = {
    readonly piece: Piece;
};

export type MoveNotation = `${'X' | 'O'} at (${number}, ${number})`;

export const createMove = (league: League, index: number): Move => ({
    piece: createPiece(league, index),
});

export const equals = (move: Move, other: Move): boolean =>
    move.piece.index === other.piece.index &&
    move.piece.league === other.piece.league;

export const execute = (board: Board, piece: Piece): Board => {
    const league = isFirstPlayer(board.currentPlayer.league)
        ? League.SECOND
        : League.FIRST;
    const index = piece.index;
    const tileList: ReadonlyArray<Tile> = board.tileList.map((tile) =>
        tile.index === index ? createTile(index, piece) : tile
    );
    return createTicTacToeBoard(league, tileList, board.numberOfTiles);
};

export const moveNotation = (move: Move, dimension: number): MoveNotation => {
    const x = Math.trunc(move.piece.index % dimension);
    const y = Math.trunc(move.piece.index / dimension);
    return `${isFirstPlayer(move.piece.league) ? 'X' : 'O'} at (${x}, ${y})`;
};

export default Move;
