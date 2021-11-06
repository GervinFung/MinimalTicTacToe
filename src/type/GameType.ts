import { MoveNotation } from '../ts/move';

export type MinimaxOption = 2 | 3 | 4 | 5;
export type GridOption = 3 | 4 | 5;
export type Popup = {
    readonly show: boolean;
    readonly closeSetting: () => void;
};
export type GameOption = 'New Game' | 'Download Current Game' | 'Load Game';
export type MoveOption = 'Undo Move' | 'Redo Move';
export type PlayerOption = {
    readonly crossAI: boolean;
    readonly noughtAI: boolean;
};

export type Resources = {
    readonly moveLog: ReadonlyArray<MoveNotation>;
    readonly gridOption: GridOption;
    readonly playerOption: PlayerOption;
    readonly minimaxOption: MinimaxOption | undefined;
};
