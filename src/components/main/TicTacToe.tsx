import * as React from 'react';
import styled from 'styled-components';
import Board from '../../ts/board';
import { isFirstPlayer } from '../../ts/league';

interface GameTileListener {
    readonly updateBoard: (index: number) => void;
    readonly board: Board;
}

interface TileNumber {
    readonly tileNumber: number;
}

const TicTacToe = ({ updateBoard, board }: GameTileListener): JSX.Element => {
    const CreateColumns = ({ tileNumber }: TileNumber): JSX.Element => {
        const dimension = Math.sqrt(board.numberOfTiles);
        const Columns = (): JSX.Element => (
            <>
                {Array.from({
                    length: dimension,
                }).map((_, i) => {
                    const index = tileNumber * dimension + i;
                    const tile = board.tileList[index];
                    if (tile.isTileOccupied && tile.getPiece !== null) {
                        return (
                            <TicTacToeTile
                                key={index}
                                onClick={() => updateBoard(index)}
                            >
                                {isFirstPlayer(tile.getPiece.league)
                                    ? 'X'
                                    : 'O'}
                            </TicTacToeTile>
                        );
                    }
                    return (
                        <TicTacToeTile
                            key={index}
                            onClick={() => updateBoard(index)}
                        />
                    );
                })}
            </>
        );
        return (
            <>
                <tr>
                    <Columns />
                </tr>
                <tr />
            </>
        );
    };

    const CreateRows = (): JSX.Element => {
        const Rows = (): JSX.Element => (
            <>
                {Array.from({
                    length: Math.sqrt(board.numberOfTiles),
                }).map((_, index) => (
                    <CreateColumns
                        key={`${index}${index}`}
                        tileNumber={index}
                    />
                ))}
            </>
        );
        return (
            <table>
                <tbody>
                    <Rows />
                </tbody>
            </table>
        );
    };

    return (
        <>
            <TicTacToeTitle>Game</TicTacToeTitle>
            <TicTacToeContainer>
                <CreateRows />
            </TicTacToeContainer>
        </>
    );
};

export default TicTacToe;

const TicTacToeContainer = styled.div`
    display: grid;
    place-items: center;
`;

const TicTacToeTitle = styled.div`
    width: 100%;
    text-align: center;
    color: ${({ theme }) => theme.theme.tertiaryColor};
    font-size: 1.5em;
    padding: 0 0 15px 0;
`;

const TicTacToeTile = styled.td`
    border: 2px solid ${({ theme }) => theme.theme.secondaryColor};
    cursor: pointer;
    font-size: 3em;
    text-align: center;
    width: 100px;
    height: 100px;
    &:hover {
        background-color: ${({ theme }) => theme.theme.hoverColor};
    }
    color: ${({ theme }) => theme.theme.secondaryColor};
    @media (max-width: 1117px) {
        font-size: 2em;
        width: 80px;
        height: 80px;
    }
    @media (max-width: 891px) {
        font-size: 1.5em;
        width: 70px;
        height: 70px;
    }
    @media (max-width: 807px) {
        width: 60px;
        height: 60px;
    }
`;
