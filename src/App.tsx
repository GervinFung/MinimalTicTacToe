import React, { useState, useEffect, useCallback } from 'react';
import styled, { css, ThemeProvider } from 'styled-components';
import { FaSun, FaMoon } from 'react-icons/fa';
import { primaryTheme, getTheme, isPrimary, secondaryTheme, KEY, PRIMARY, SECONDARY } from './theme/colorTheme';
import GlobalStyle from './theme/GlobalTheme';
import Board, { checkmate, stalemate, createStandardBoard } from './ts/board';
import { isFirstPlayer } from './ts/league';
import { makeMove, makeMoveFromTileNumber, getMoveFromTileNumber } from './ts/player';
import { execute } from './ts/bot/minimax';
import { moveNotation } from './ts/move';

type TicTacToeMessage = 'O Has Won!' | 'X Has Won!' | 'Game Started...' | 'Game Running...' | 'Game Drawn!' | 'AI Thinking...';

interface GameTileListener {
    readonly updateBoard: (index: number) => void;
    readonly board: Board;
}

interface TileNumber {
    readonly tileNumber: number;
}

const TicTacToe = ({ updateBoard, board }: GameTileListener): JSX.Element => {

    const CreateColumns = ({ tileNumber }: TileNumber): JSX.Element => {
        const columns = [];
        const dimension = Math.sqrt(board.numberOfTiles);
        for (let i = 0; i < dimension; i++) {
            const index = tileNumber * dimension + i;
            const tile = board.tileList[index];
            if (tile.isTileOccupied && tile.getPiece !== null) {
                const word = isFirstPlayer(tile.getPiece.league) ? 'X' : 'O';
                columns.push(<TicTacToeTile key={index} onClick={() => updateBoard(index)}>{word}</TicTacToeTile>);
            } else {
                columns.push(<TicTacToeTile key={index} onClick={() => updateBoard(index)}/>);
            }
        }
        return <tr key={tileNumber * tileNumber}>{columns}</tr>;
    };

    const CreateRows = (): JSX.Element => {
        const dimension = Math.sqrt(board.numberOfTiles);
        const rows = [];
        for (let i = 0; i < dimension; i++) {
            rows.push(<CreateColumns key={i} tileNumber={i}/>);
            rows.push(<tr key={`${i}${i}${i}`}/>);
        }
        return <table><tbody>{rows}</tbody></table>;
    };

    return (
        <CreateRows/>
    );
}

interface GameLabelProps {
    readonly checked: boolean;
    readonly side: 'O' | 'X';
    readonly onChange: () => void;
}

const AppGameLabel = ({ checked, side, onChange }: GameLabelProps) => (
    <div>
        <GameLabel>{side} as AI:
            <input type='checkbox' checked={checked} onChange={onChange}/>
        </GameLabel>
    </div>
);

interface SelectorProps {
    readonly valueList: ReadonlyArray<number>;
    readonly dimension: number;
    readonly updateDimension: (dimension: number) => void;
}

const Selector = ({ valueList, dimension, updateDimension }: SelectorProps) => (
    <Chooser>
        <ChooseSelect value={dimension} onChange={e => updateDimension(parseInt(e.target.value, 10))}>
            {valueList.map(value => <option key={value}>{value}</option>)}
        </ChooseSelect>
    </Chooser>
);

interface MoveHistory {
    readonly moveNotation: string;
    readonly board: Board;
}

const App = () => {

    const [theme, setTheme] = useState(() => {
        const value = localStorage.getItem(KEY);
        return value === SECONDARY ? secondaryTheme : primaryTheme;
    });

    const [dimension, setDimension] = useState(3);
    const [depth, setDepth] = useState(4);
    const [board, setBoard] = useState(createStandardBoard(dimension * dimension));
    const [firstPlayerAI, setFirstPlayerAI] = useState(false);
    const [secondPlayerAI, setSecondPlayerAI] = useState(false);
    const [message, setMessage] = useState<TicTacToeMessage>('Game Running...');
    const [moveList, setMoveList] = useState<Array<MoveHistory>>([]);

    const updateBoard = useCallback((tileNumber: number, board: Board) => {
        if (checkmate(board) || stalemate(board) || board.tileList[tileNumber].isTileOccupied) {
            return;
        }
        const move = getMoveFromTileNumber(tileNumber, board);
        const latestBoard = makeMoveFromTileNumber(tileNumber, board);
        setBoard(latestBoard);
        const newMoveHistory: MoveHistory = {
            moveNotation: moveNotation(move, dimension),
            board: latestBoard
        };
        setMoveList(oldArray => [...oldArray, newMoveHistory]);
    }, [dimension]);

    const updateTicTacToeBoard = useCallback((tileNumber: number) => updateBoard(tileNumber, board), [board, updateBoard]);

    const [gameBoard, setGameBoard] = useState(<TicTacToe updateBoard={updateTicTacToeBoard} board={board}/>);

    useEffect(() => {
        localStorage.setItem(KEY, isPrimary(theme) ? PRIMARY : SECONDARY);
    }, [theme]);

    useEffect(() => {
        setGameBoard((<TicTacToe updateBoard={updateTicTacToeBoard} board={board}/>));
    }, [board, updateTicTacToeBoard]);

    useEffect(() => {
        if (checkmate(board)) {
            const word = isFirstPlayer(board.currentPlayer.opponentLeague) ? 'X' : 'O';
            setMessage(`${word} Has Won!`);
            return;
        } else if (stalemate(board)) {
            setMessage('Game Drawn!');
            return;
        }
        const first = isFirstPlayer(board.currentPlayer.league) && firstPlayerAI;
        const second = !isFirstPlayer(board.currentPlayer.league) && secondPlayerAI;
        if (first || second) {
            const move = execute(board, depth);
            const latestBoard = makeMove(board, move.piece);
            setBoard(latestBoard);
            const newMoveHistory: MoveHistory = {
                moveNotation: moveNotation(move, dimension),
                board: latestBoard
            };
            setMoveList(oldArray => [...oldArray, newMoveHistory]);
        }
    }, [board, firstPlayerAI, secondPlayerAI, depth, dimension]);

    const reset = (dimension: number) => {
        setBoard(createStandardBoard(dimension * dimension));
        setFirstPlayerAI(false);
        setSecondPlayerAI(false);
        setMoveList([]);
        setMessage('Game Running...');
    };

    const updateDimension = (dimension: number) => {
        if (window.confirm('resetting dimension requires restarting the game.\nDo you want to restart the game?')) {
            setDimension(dimension);
            reset(dimension);
        }
    };

    const Toggler = () => isPrimary(theme) ? <ToggleThemeSun/> : <ToggleThemeMoon/>;
    const ShowGame = (): JSX.Element => gameBoard;

    const restoreBoard = (board: Board, index: number) => {
        if (window.confirm('confirmation to reset to chosen state')) {
            setBoard(board);
            setMoveList(oldArray => oldArray.filter((_, i) => i <= index));
        }
    };

    const ShowMoveHistory = () => {
        return (
            <MoveHistoryContainer>
                <MoveHistoryTitle>Move Log</MoveHistoryTitle>
                {moveList.map((move, index) => <MovesMade onClick={() => restoreBoard(move.board, index)} key={index}>{`${index + 1}. ${move.moveNotation}`}</MovesMade>)}
            </MoveHistoryContainer>
        );
    };

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle/>
            <Container>
                <HalfContainer>
                    <ChooserContainer>
                        Dimension: <Selector valueList={[3, 4, 5]} dimension={dimension} updateDimension={updateDimension} />
                        AI Level: <Selector valueList={[1, 2, 3, 4]} dimension={depth} updateDimension={setDepth} />
                    </ChooserContainer>
                    <div><ShowMoveHistory/></div>
                </HalfContainer>
                <HalfContainer>
                    <CenteredPanel>
                        <ToggleThemeContainer>
                            <ToggleThemeButton onClick={() => setTheme(getTheme(theme))}>
                                <Toggler/>
                            </ToggleThemeButton>
                        </ToggleThemeContainer>
                    </CenteredPanel>
                    <Panel>
                        <AppGameLabel checked={firstPlayerAI} side={'X'} onChange={() => setFirstPlayerAI(prev => !prev)}/>
                        <AppGameLabel checked={secondPlayerAI} side={'O'} onChange={() => setSecondPlayerAI(prev => !prev)}/>
                    </Panel>
                    <CenteredPanel><ShowGame/></CenteredPanel>
                    <Panel>
                        <div><GameButton onClick={() => {
                            if (window.confirm('confirmation to restart game')) {
                                reset(dimension);
                            }
                        }}>Restart</GameButton></div>
                        <div><GameParagraph>{message}</GameParagraph></div>
                    </Panel>
                </HalfContainer>
            </Container>
        </ThemeProvider>
    );
};

const Container = styled.div`
    justify-content: space-evenly;
    display: flex;
`;

const HalfContainer = styled.div`
    margin: 10px 0 10px 0;
    flex: 0.5;
`;

const Panel = styled.div`
    margin: 25px 0 25px 0;
    justify-content: space-between;
    align-items: center;
    display: flex;
`;

const CenteredPanel = styled(Panel)`
    justify-content: center;
`;

const ToggleThemeContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ToggleThemeButton = styled.div`
    border-radius: 50%;
    background-color: ${({ theme }) => theme.theme.secondaryColor};
    width: 35px;
    height: 35px;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
        cursor: pointer;
    }
`;

const ToggleTheme = css`
    letter-spacing: 1px !important;
    color: ${({ theme }) => theme.theme.primaryColor};
    font-size: 1.5em !important;
`;

const ToggleThemeSun = styled(FaSun)`${ToggleTheme}`;
const ToggleThemeMoon = styled(FaMoon)`${ToggleTheme}`;

const GeneralStyle = css`
    color: ${({ theme }) => theme.theme.secondaryColor};
    font-size: 1.5em;
`;

const GameLabel = styled.label`${GeneralStyle}`;
const GameButton = styled.button`
    ${GeneralStyle}
    background-color: transparent;
    border: none;
    &:hover {
        cursor: pointer;
    }
`;
const GameParagraph = styled.p`${GeneralStyle}`;

const TicTacToeTile = styled.td`
    border: 1px solid ${({ theme }) => theme.theme.secondaryColor};
    padding: 8px;
    width: 100px;
    height: 100px;
    cursor: pointer;
    font-size: 5em;
    text-align: center;
    color: ${({ theme }) => theme.theme.secondaryColor};
    &:hover {
        background-color: ${({ theme }) => theme.theme.hoverColor};
    }
`;

// left
const Chooser = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
`;

const ChooseSelect = styled.select`
    font-size: 1.1em;
    margin: 0 0 15px 0;
    background-color: ${({ theme }) => theme.theme.secondaryColor};
    border: 3px solid ${({ theme }) => theme.theme.secondaryColor};
    color: ${({ theme }) => theme.theme.primaryColor};
    letter-spacing: 1.5px;
    font-family: 'Orbitron', sans-serif !important;
`;

const ChooserContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: ${({ theme }) => theme.theme.secondaryColor};
`;

const MovesMade = styled.div`
    padding: 10px;
    width: 45%;
    height: fit-content;
    ${GeneralStyle};
    cursor: pointer;
    margin: 1px;
    border: 1px solid ${({ theme }) => theme.theme.secondaryColor};
`;

const MoveHistoryContainer = styled.div`
    display: inline-flex;
    flex-wrap: wrap;
    width: 100%;
`;

const MoveHistoryTitle = styled.div`
    width: 100%;
    text-align: center;
    ${GeneralStyle};
    padding: 0 0 15px 0;
`;

export default App;