import { GameOption, GridOption } from './GameType';

type AlertProperty =
    | {
          readonly type: GameOption;
          readonly requireButton: true;
          readonly content: string;
      }
    | {
          readonly type: 'Grid';
          readonly requireButton: true;
          readonly content: 'Confirm to download current game and start a new game';
          readonly gridOption: GridOption;
      }
    | {
          readonly type: 'End';
          readonly requireButton: false;
          readonly content: `${'X' | 'O'} has won the game` | "It's a tie";
      }
    | undefined;

export type ActionType = 'Positive' | 'Negative' | 'Neutral';

export default AlertProperty;
