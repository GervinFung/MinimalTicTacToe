import League from './league';
import Player, { createFirstPlayer, createSecondPlayer } from './player';
import Tile, { createTile } from './tile';

export default interface Board {
    readonly tileList: ReadonlyArray<Tile>;
    readonly firstPlayer: Player;
    readonly secondPlayer: Player;
    readonly league: League;
    readonly currentPlayer: Player;
    readonly numberOfTiles: number;
}

export const createStandardBoard = (numberOfTiles = 9) => {
    const tileList: Array<Tile> = [];
    for (let i = 0; i < numberOfTiles; i++) {
        tileList.push(createTile(i, null));
    }
    return createTicTacToeBoard(League.FIRST, tileList, numberOfTiles);
};

export const createTicTacToeBoard = (league: League, tileList: ReadonlyArray<Tile>, numberOfTiles: number): Board => {
    const firstPlayer = createFirstPlayer(tileList);
    const secondPlayer = createSecondPlayer(tileList);
    return {
        league,
        firstPlayer,
        secondPlayer,
        tileList,
        currentPlayer: league === firstPlayer.league ? firstPlayer : secondPlayer,
        numberOfTiles
    };
};

export const stringFormat = (board: Board) => {
    const stringFormat = board.tileList.map((tile, i) => {
        const newLine = i % Math.sqrt(board.numberOfTiles) === 0 ? '\n' : '';
        return `${newLine}${tile.stringFormat}(${String(tile.index)}) \t`
    });
    return stringFormat.join('');
};

export const checkmate = (board: Board): boolean => {
    const splice = Math.sqrt(board.numberOfTiles);
    const chuckedTileList = chuck(board.tileList, splice);
    const horizontal = horizontalCheck(chuckedTileList, splice, board.currentPlayer.opponentLeague);
    const vertical = verticalCheck(chuckedTileList, splice, board.currentPlayer.opponentLeague);
    const diagonalNegativeSlope = diagonalCheck(chuckedTileList, board.currentPlayer.opponentLeague, false);
    const diagonalPositiveSlope = diagonalCheck(chuckedTileList, board.currentPlayer.opponentLeague, true);
    return horizontal || vertical || diagonalNegativeSlope || diagonalPositiveSlope;
};

export const stalemate = (board: Board): boolean => !board.tileList.some(tile => !tile.isTileOccupied);

export const chuck = (tileList: ReadonlyArray<Tile>, splice: number): ReadonlyArray<ReadonlyArray<Tile>> => {
    const chuckedTileList: Array<ReadonlyArray<Tile>> = [];
    const mutableTileList: Array<Tile> = Array.from(tileList);
    while (mutableTileList.length > 0) {
        chuckedTileList.push(mutableTileList.splice(0, splice));
    }
    return chuckedTileList;
};

const horizontalCheck = (chuckedTileList: ReadonlyArray<ReadonlyArray<Tile>>, splice: number, league: League): boolean => {
    const occupiedChuckedTileList: ReadonlyArray<boolean> = chuckedTileList.map(tileList => {
        return tileList.filter(tile => tile.isTileOccupied && tile.getPiece?.league === league).length === splice;
    });
    return occupiedChuckedTileList.some(occupied => occupied);
};

const verticalCheck = (chuckedTileList: ReadonlyArray<ReadonlyArray<Tile>>, splice: number, league: League): boolean => {
    const occupiedChuckedTileList: ReadonlyArray<boolean> = chuckedTileList.map((tileList, index) => {
        const temp = tileList.filter((_, tileIndex) => {
            const tile = chuckedTileList[tileIndex];
            if (tile === undefined) {
                throw new Error('tile could not be undefined at verticalCheck function');
            }
            const anotherTile = tile[index];
            if (anotherTile === undefined) {
                throw new Error('another tile could not be undefined at verticalCheck function');
            }
            return anotherTile.getPiece?.league === league;
        });
        return temp.length === splice;
    });
    return occupiedChuckedTileList.some(occupied => occupied);
};

const diagonalCheck = (chuckedTileList: ReadonlyArray<ReadonlyArray<Tile>>, league: League, positiveSlope: boolean): boolean => {
    const occupiedChuckedTileList: ReadonlyArray<boolean> = chuckedTileList.map((tileList, index) => {
        const tile = chuckedTileList[index];
        if (tile === undefined) {
            throw new Error('tile could not be undefined at diagonalCheckNegativeSlope function');
        }
        const choseIndex = positiveSlope ? tileList.length - 1 - index : index;
        const anotherTile = tile[choseIndex];
        if (anotherTile === undefined) {
            throw new Error('another tile could not be undefined at diagonalCheckNegativeSlope function');
        }
        return anotherTile.getPiece?.league === league;
    });
    return occupiedChuckedTileList.every(occupied => occupied);
};