import League from './league';

export default interface Piece {
    readonly league: League
    readonly index: number
}

export type PieceType = Piece | null;

export const createPiece = (league: League, index: number): Piece => ({index, league});