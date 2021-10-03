import Board, { createTicTacToeBoard } from './board';
import League, { isFirstPlayer } from './league';
import Piece, { createPiece } from './piece';
import Tile, { createTile } from './tile';

export default interface Move {
    readonly piece: Piece;
}

export const createMove = (league: League, index: number): Move => ({ piece: createPiece(league, index )});
export const equals = (move: Move, other: Move): boolean => move.piece.index === other.piece.index && move.piece.league === other.piece.league;

export const execute = (board: Board, piece: Piece): Board => {
    const league = isFirstPlayer(board.currentPlayer.league) ? League.SECOND : League.FIRST;
    const index = piece.index;
    const tileList: ReadonlyArray<Tile> = board.tileList.map(tile => tile.index === index ? createTile(index, piece) : tile);
    return createTicTacToeBoard(league, tileList, board.numberOfTiles);
};

export const moveNotation = (move: Move, dimension: number) => {
    const side = isFirstPlayer(move.piece.league)  ? 'X' : 'O';
    const x = Math.trunc(move.piece.index % dimension);
    const y = Math.trunc(move.piece.index / dimension);
    return `${side} at (${x}, ${y})`;
};