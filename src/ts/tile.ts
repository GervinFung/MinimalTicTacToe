import { PieceType } from './piece';

export default interface Tile {
    readonly index: number;
    readonly isTileOccupied: boolean;
    readonly getPiece: PieceType;
    readonly stringFormat: string;
};

export const createTile = (index: number, piece: PieceType): Tile => ({
    index: index,
    isTileOccupied: piece !== null,
    getPiece: piece,
    stringFormat: piece === null ? '-' : piece.league.toString()
});