import * as React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { secondaryTheme } from './theme/colorTheme';
import GlobalStyle from './theme/GlobalTheme';
import Board, {
    checkmate,
    stalemate,
    createStandardBoard,
    restoreBoardFromMoveLog,
    restoreBoardFromRemovedMoveLog,
} from './ts/board';
import {
    makeMoveFromTileNumber,
    getMoveFromTileNumber,
    makeMove,
} from './ts/player';
import { moveNotation, MoveNotation } from './ts/move';
import TicTacToe from './components/main/TicTacToe';
import MoveHistory from './components/main/MoveHistory';
import Setting from './components/main/Setting';
import MultiChoiceAlert from './components/popup/Alert';
import LoadGamePopup from './components/popup/LoadGamePopup';
import {
    MinimaxOption,
    GridOption,
    GameOption,
    MoveOption,
    PlayerOption,
    Resources,
} from './type/GameType';
import { isFirstPlayer } from './ts/league';
import { execute } from './ts/bot/minimax';
import AlertProperty, { ActionType } from './type/AlertType';

type State = {
    readonly board: Board;
    readonly moveLog: ReadonlyArray<MoveNotation>;
    readonly gridOption: GridOption;
    readonly minimaxOption: MinimaxOption | undefined;
    readonly gameOption: GameOption | undefined;
    readonly moveOption: MoveOption | undefined;
    readonly playerOption: PlayerOption;
    readonly alertProperty: AlertProperty;
    readonly showLoadGamePopup: boolean;
    readonly redo: ReadonlyArray<Redo>;
};

type Patchable = {
    readonly board: Board;
} & Resources;

type Redo = {
    readonly removedMoveLog: ReadonlyArray<MoveNotation>;
};

const App = () => {
    const grid = 5;
    const key = 'e77dd85c-255e-424f-bea3-14360a5a84c6';

    const patchLocalToGame = (): Patchable => {
        const game = localStorage.getItem(key);
        if (game === null) {
            return {
                moveLog: [],
                board: createStandardBoard(grid * grid),
                gridOption: grid,
                minimaxOption: undefined,
                playerOption: {
                    crossAI: false,
                    noughtAI: false,
                },
            };
        }
        try {
            return patchGameFromResource(JSON.parse(game));
        } catch (e: any) {
            return {
                moveLog: [],
                board: createStandardBoard(grid * grid),
                gridOption: grid,
                minimaxOption: undefined,
                playerOption: {
                    crossAI: false,
                    noughtAI: false,
                },
            };
        }
    };

    const patchGameFromResource = ({
        moveLog,
        gridOption,
        minimaxOption,
        playerOption,
    }: Resources): Patchable => ({
        moveLog,
        board: restoreBoardFromMoveLog({
            gridOption,
            moveLog,
        }),
        gridOption,
        minimaxOption,
        playerOption,
    });

    const [state, setState] = React.useState<State>({
        ...patchLocalToGame(),
        gameOption: undefined,
        moveOption: undefined,
        alertProperty: undefined,
        showLoadGamePopup: false,
        redo: [],
    });

    const {
        board,
        moveLog,
        gridOption,
        minimaxOption,
        gameOption,
        moveOption,
        alertProperty,
        playerOption,
        showLoadGamePopup,
    } = state;

    React.useEffect(() => {
        const handleResizeWindow = () => {
            setState((prevState) => ({
                ...prevState,
                width: window.innerWidth,
            }));
        };
        window.addEventListener('resize', handleResizeWindow);
        return () => {
            window.removeEventListener('resize', handleResizeWindow);
        };
    }, []);

    React.useEffect(() => {
        const {
            board,
            playerOption: { crossAI, noughtAI },
            minimaxOption,
        } = state;
        if (stalemate(board) || checkmate(board)) {
            return;
        }
        localStorage.setItem(key, stringifyGame());
        const { currentPlayer } = board;
        const first = isFirstPlayer(currentPlayer.league) && crossAI;
        const second = !isFirstPlayer(currentPlayer.league) && noughtAI;
        if ((first || second) && minimaxOption) {
            const move = execute(board, minimaxOption);
            const latestBoard = makeMove(board, move.piece);
            setState((prevState) => {
                const { moveLog } = prevState;
                return {
                    ...prevState,
                    board: latestBoard,
                    moveLog: [...moveLog, moveNotation(move, gridOption)],
                    redo: [],
                };
            });
        }
    }, [board, minimaxOption, playerOption]);

    React.useEffect(() => {
        const { board } = state;
        if (stalemate(board)) {
            showEndGameAlert({
                type: 'draw',
            });
            return;
        }
        if (checkmate(board)) {
            showEndGameAlert({
                type: 'won',
                side: isFirstPlayer(board.currentPlayer.opponentLeague)
                    ? 'X'
                    : 'O',
            });
            return;
        }
    }, [board]);

    const stringifyGame = () => {
        const resources: Resources = {
            gridOption,
            moveLog,
            playerOption,
            minimaxOption,
        };
        return JSON.stringify(resources, null, 2);
    };

    const restoreGameFromFile = (resources: Resources) => {
        setState((prevState) => ({
            ...prevState,
            ...patchGameFromResource(resources),
        }));
    };

    const updateGridOption = (grid: GridOption) => {
        setState((prevState) => ({
            ...prevState,
            alertProperty: {
                type: 'Grid',
                gridOption: grid,
                requireButton: true,
                content:
                    'Confirm to download current game and start a new game',
            },
        }));
    };

    const showEndGameAlert = (
        prop:
            | {
                  readonly type: 'draw';
              }
            | {
                  readonly type: 'won';
                  readonly side: 'X' | 'O';
              }
    ) => {
        setState((prevState) => ({
            ...prevState,
            alertProperty: {
                type: 'End',
                requireButton: false,
                content:
                    prop.type === 'draw'
                        ? "It's a tie"
                        : `${prop.side} has won the game`,
            },
        }));
    };

    const updateMinimaxOption = (minimax: MinimaxOption) => {
        setState((prevState) => ({
            ...prevState,
            minimaxOption: minimax,
        }));
    };

    const updateGameOption = (gameOption: GameOption) => {
        setState((prevState) => ({
            ...prevState,
            gameOption,
        }));
        switch (gameOption) {
            case 'New Game':
                setGameOptionState(
                    gameOption,
                    'Confirm to download current game and start a new game'
                );
                break;
            case 'Download Current Game':
                downloadSavedGame();
                break;
            case 'Load Game':
                setGameOptionState(
                    gameOption,
                    'Confirm to download current game and load downloaded game'
                );
                break;
        }
    };

    const updateMoveOption = (moveOption: MoveOption) => {
        switch (moveOption) {
            case 'Redo Move': {
                restoreBoardFromRemovedMoveLog;
                setState((prevState) => {
                    const { board, redo, gridOption } = prevState;
                    const restoreMoves = redo[redo.length - 1];
                    if (restoreMoves) {
                        const { removedMoveLog } = restoreMoves;
                        return {
                            ...prevState,
                            moveOption,
                            board: restoreBoardFromRemovedMoveLog({
                                gridOption,
                                removedMoveLog,
                                board,
                            }),
                            redo: redo.filter(
                                (_, index, arr) => index !== arr.length - 1
                            ),
                            moveLog: [...moveLog, ...removedMoveLog],
                        };
                    }
                    return {
                        ...prevState,
                    };
                });
                break;
            }
            case 'Undo Move':
                setState((prevState) => {
                    const { moveLog, redo, gridOption } = prevState;
                    const index = moveLog.length - 2;
                    const filteredMoveLog = moveLog.filter(
                        (_, i) => i <= index
                    );
                    const removedMoveLog = moveLog.filter((_, i) => i > index);
                    return {
                        ...prevState,
                        moveOption,
                        moveLog: filteredMoveLog,
                        redo: [
                            ...redo,
                            {
                                removedMoveLog,
                            },
                        ],
                        board: restoreBoardFromMoveLog({
                            gridOption,
                            moveLog: filteredMoveLog,
                        }),
                    };
                });
                break;
        }
    };

    const updatePlayerOption = (playerOption: PlayerOption) => {
        setState((prevState) => ({
            ...prevState,
            playerOption,
        }));
    };

    const updateTicTacToeBoard = (tileNumber: number) => {
        const { board } = state;
        if (stalemate(board)) {
            showEndGameAlert({
                type: 'draw',
            });
            return;
        }
        if (checkmate(board)) {
            showEndGameAlert({
                type: 'won',
                side: isFirstPlayer(board.currentPlayer.opponentLeague)
                    ? 'X'
                    : 'O',
            });
            return;
        }
        if (board.tileList[tileNumber].isTileOccupied) {
            return;
        }
        const move = getMoveFromTileNumber(tileNumber, board);
        const latestBoard = makeMoveFromTileNumber(tileNumber, board);
        setState((prevState) => {
            const { moveLog, gridOption } = prevState;
            return {
                ...prevState,
                board: latestBoard,
                moveLog: [...moveLog, moveNotation(move, gridOption)],
                redo: [],
            };
        });
    };

    const downloadSavedGame = () => {
        const file = new Blob([stringifyGame()], { type: 'application/json' });
        const a = document.createElement('a');
        const url = window.URL.createObjectURL(file);
        a.href = url;
        a.style.display = 'none';
        a.download = 'minimalTicTacToe.json';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const updateAfterSetting = (isDownload: boolean) => {
        setState((prevState) => {
            const { alertProperty } = prevState;
            if (alertProperty) {
                const { type } = alertProperty;
                switch (type) {
                    case 'Grid':
                    case 'New Game': {
                        if (isDownload) {
                            downloadSavedGame();
                        }
                        const { gridOption } = prevState;
                        const grid =
                            type === 'Grid'
                                ? alertProperty.gridOption
                                : gridOption;
                        return {
                            ...prevState,
                            alertProperty: undefined,
                            board: createStandardBoard(grid * grid),
                            moveLog: [],
                            gridOption: grid,
                        };
                    }
                    case 'Load Game':
                        if (isDownload) {
                            downloadSavedGame();
                        }
                        setState((prevState) => {
                            const { showLoadGamePopup } = prevState;
                            return {
                                ...prevState,
                                alertProperty: undefined,
                                showLoadGamePopup: !showLoadGamePopup,
                            };
                        });
                        break;
                    case 'Download Current Game':
                        break;
                }
            }
            return prevState;
        });
    };

    const alertButtonClick = (actionType: ActionType) => {
        switch (actionType) {
            case 'Positive':
                updateAfterSetting(true);
                break;
            case 'Negative':
                updateAfterSetting(false);
                break;
            case 'Neutral':
                setState((prevState) => ({
                    ...prevState,
                    alertProperty: undefined,
                }));
                break;
        }
    };

    const restoreBoard = (index: number) => {
        setState((prevState) => {
            const filtered = moveLog.filter((_, i) => i <= index);
            const removedMoveLog = moveLog.filter((_, i) => i > index);
            const { redo } = prevState;
            return {
                ...prevState,
                alertProperty: undefined,
                board: restoreBoardFromMoveLog({
                    gridOption,
                    moveLog: filtered,
                }),
                redo: [...redo, { removedMoveLog }],
                moveLog: filtered,
            };
        });
    };

    const setGameOptionState = (type: GameOption, content: string) => {
        setState((prevState) => ({
            ...prevState,
            alertProperty: {
                type,
                requireButton: true,
                content,
            },
        }));
    };

    return (
        <ThemeProvider theme={secondaryTheme}>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link
                rel="preconnect"
                href="https://fonts.gstatic.com"
                crossOrigin="anonymous"
            />
            <link
                href="https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap"
                rel="stylesheet"
            />
            <GlobalStyle />
            <MenuBar>
                <Menuitem>MinimalTicTacToe</Menuitem>
            </MenuBar>
            <LoadGamePopup
                closePopup={() => {
                    setState((prevState) => {
                        return {
                            ...prevState,
                            showLoadGamePopup: false,
                        };
                    });
                }}
                show={showLoadGamePopup}
                buttonClick={alertButtonClick}
                restoreGameFromFile={restoreGameFromFile}
            />
            <MultiChoiceAlert
                closeAlert={() => {
                    setState((prevState) => {
                        const { alertProperty } = prevState;
                        if (alertProperty) {
                            return {
                                ...prevState,
                                alertProperty: undefined,
                            };
                        }
                        return prevState;
                    });
                }}
                alertProperty={alertProperty}
                buttonClick={alertButtonClick}
            />
            <GridContainer>
                <GridTemplateColumns>
                    <Setting
                        minimaxOption={minimaxOption}
                        gridOption={gridOption}
                        moveOption={moveOption}
                        gameOption={gameOption}
                        playerOption={playerOption}
                        updateGridOption={updateGridOption}
                        updateMinimaxOption={updateMinimaxOption}
                        updateGameOption={updateGameOption}
                        updateMoveOption={updateMoveOption}
                        updatePlayerOption={updatePlayerOption}
                    />
                </GridTemplateColumns>
                <GridTemplateColumns>
                    <TicTacToe
                        updateBoard={updateTicTacToeBoard}
                        board={board}
                    />
                </GridTemplateColumns>
                <GridTemplateColumns>
                    <MoveHistory
                        moveLog={moveLog}
                        restoreBoard={restoreBoard}
                    />
                </GridTemplateColumns>
            </GridContainer>
        </ThemeProvider>
    );
};

const MenuBar = styled.div`
    width: 100%;
    background-color: #1e1e1e;
    display: flex;
    justify-content: space-around;
    padding: 5px 0 5px 0;
`;

const Menuitem = styled.div`
    color: ${({ theme }) => theme.theme.primaryColor};
    font-size: 2em;
    &:hover {
        cursor: pointer;
    }
`;

const GridContainer = styled.div`
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 1.5fr 1fr;
    @media (max-width: 1297px) {
        grid-template-columns: 1fr 2fr 1fr;
    }
    @media (max-width: 731px) {
        grid-template-columns: 1fr 1fr;
    }
`;

const GridTemplateColumns = styled.div`
    width: 100%;
    height: 50%;
    margin: 10px 0 10px 0;
`;

export default App;
