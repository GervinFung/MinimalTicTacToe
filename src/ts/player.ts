import Board from './board';
import League, { isFirstPlayer } from './league';
import Move, { createMove, equals, execute } from './move';
import Piece from './piece';
import Tile from './tile';

export default interface Player {
    readonly legalMoves: ReadonlyArray<Move>;
    readonly league: League;
    readonly opponentLeague: League;
}

const createLegalMoves = (league: League, tileList: ReadonlyArray<Tile>): ReadonlyArray<Move> => tileList.filter((tile) => !tile.isTileOccupied).map((tile) => createMove(league, tile.index));

const createPlayer = (league: League, tileList: ReadonlyArray<Tile>): Player => ({
    legalMoves: createLegalMoves(league, tileList),
    league,
    opponentLeague: isFirstPlayer(league) ? League.SECOND : League.FIRST
});

export const createFirstPlayer = (tileList: ReadonlyArray<Tile>) => createPlayer(League.FIRST, tileList);
export const createSecondPlayer = (tileList: ReadonlyArray<Tile>) => createPlayer(League.SECOND, tileList);


export const makeMoveFromMoves = (movePassed: Move, board: Board) => {
    const moveFound = board.currentPlayer.legalMoves.find(move => equals(move, movePassed));
    return makeMove(board, getMove(moveFound).piece);
};

export const makeMoveFromTileNumber = (tileNumber: number, board: Board): Board => {
    return makeMove(board, getMoveFromTileNumber(tileNumber, board).piece);
};

export const getMoveFromTileNumber = (tileNumber: number, board: Board): Move => {
    const moveFound = board.currentPlayer.legalMoves.find(move => move.piece.index === tileNumber);
    return getMove(moveFound);
};

const getMove = (moveFound: Move | undefined): Move => {
    if (moveFound === undefined) {
        throw new Error('move found in makeMove function cannot be undefined');
    }
    return moveFound;
};

export const makeMove = (board: Board, piece: Piece): Board => {
    return execute(board, piece);
};