import League from './league';

type Piece = {
    readonly league: League;
    readonly index: number;
};

export type PieceType = Piece | null;

export const createPiece = (league: League, index: number): Piece => ({
    index,
    league,
});

export default Piece;
