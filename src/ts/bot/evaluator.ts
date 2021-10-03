import Board, { chuck } from '../board';
import League from '../league';
import Tile from '../tile';

export const evaluate = (board: Board, depthDiff: number): number => {
    const splice = Math.sqrt(board.numberOfTiles);
    const chuckedTileList = chuck(board.tileList, splice);
    const horizontal = horizontalCheck(chuckedTileList, board.currentPlayer.league);
    const vertical = verticalCheck(chuckedTileList, board.currentPlayer.league);
    const diagonalNegativeSlope = diagonalCheck(chuckedTileList, board.currentPlayer.league, false);
    const diagonalPositiveSlope = diagonalCheck(chuckedTileList, board.currentPlayer.league, true);
    const finalScore = horizontal + vertical + diagonalNegativeSlope + diagonalPositiveSlope;
    return depthDiff === 0 ? finalScore : finalScore * depthDiff;
};

const reducer = (previousValue: number, currentValue: number) => previousValue + currentValue;

const computeScoreFromLeague = (league: League | undefined, currentLeague: League): number => {
    if (league === undefined) {
        return 0;
    } return currentLeague === league ? 100 : -100;
}

const horizontalCheck = (chuckedTileList: ReadonlyArray<ReadonlyArray<Tile>>, league: League): number => {
    const score = chuckedTileList.map(tileList => {
        return tileList.map(tile => computeScoreFromLeague(tile.getPiece?.league, league)).reduce(reducer);
    }).reduce(reducer);
    return score;
};

const verticalCheck = (chuckedTileList: ReadonlyArray<ReadonlyArray<Tile>>, league: League): number => {
    const score = chuckedTileList.map((tileList, index) => {
        return tileList.map((_, tileIndex) => {
            const tile = chuckedTileList[tileIndex];
            if (tile === undefined) {
                throw new Error('tile could not be undefined at verticalCheck function');
            }
            const anotherTile = tile[index];
            if (anotherTile === undefined) {
                throw new Error('another tile could not be undefined at verticalCheck function');
            }
            return computeScoreFromLeague(anotherTile.getPiece?.league, league);
        }).reduce(reducer);
    }).reduce(reducer);
    return score;
};

const diagonalCheck = (chuckedTileList: ReadonlyArray<ReadonlyArray<Tile>>, league: League, positiveSlope: boolean): number => {
    const score = chuckedTileList.map((tileList, index) => {
        const tile = chuckedTileList[index];
        if (tile === undefined) {
            throw new Error('tile could not be undefined at diagonalCheckNegativeSlope function');
        }
        const choseIndex = positiveSlope ? tileList.length - 1 - index : index;
        const anotherTile = tile[choseIndex];
        if (anotherTile === undefined) {
            throw new Error('another tile could not be undefined at diagonalCheckNegativeSlope function');
        }
        return computeScoreFromLeague(anotherTile.getPiece?.league, league);
    }).reduce(reducer);
    return score;
};