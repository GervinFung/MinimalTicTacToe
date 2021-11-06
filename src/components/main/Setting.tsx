import * as React from 'react';
import {
    Content,
    HorizontalLine,
    Title,
    Selection,
    Contents,
} from '../common/Styling';
import {
    MinimaxOption,
    GridOption,
    GameOption,
    MoveOption,
    PlayerOption,
} from '../../type/GameType';
import styled from 'styled-components';

interface SettingProps {
    readonly gridOption: GridOption;
    readonly minimaxOption: MinimaxOption | undefined;
    readonly playerOption: PlayerOption;
    readonly moveOption: MoveOption | undefined;
    readonly gameOption: GameOption | undefined;
    readonly updateMinimaxOption: (minimax: MinimaxOption) => void;
    readonly updateGridOption: (grid: GridOption) => void;
    readonly updateMoveOption: (moveOption: MoveOption) => void;
    readonly updateGameOption: (gameOption: GameOption) => void;
    readonly updatePlayerOption: (playerOption: PlayerOption) => void;
}

interface MinimaxLevelProps {
    readonly type: 'AI Level';
    readonly options: ReadonlyArray<MinimaxOption>;
    readonly update: SettingProps['updateMinimaxOption'];
    readonly option: SettingProps['minimaxOption'];
}

interface GridProps {
    readonly type: 'Grid';
    readonly options: ReadonlyArray<GridOption>;
    readonly update: SettingProps['updateGridOption'];
    readonly option: SettingProps['gridOption'];
}

interface GameOptionsProps {
    readonly type: 'Game Setting';
    readonly options: ReadonlyArray<GameOption>;
    readonly update: SettingProps['updateGameOption'];
    readonly option: SettingProps['gameOption'];
}

interface MoveOptionProps {
    readonly type: 'Move';
    readonly options: ReadonlyArray<MoveOption>;
    readonly update: SettingProps['updateMoveOption'];
    readonly option: SettingProps['moveOption'];
}

interface PlayerOptionProps {
    readonly type: 'Player as AI';
    readonly options: SettingProps['playerOption'];
    readonly update: SettingProps['updatePlayerOption'];
}

const MinimaxOptions = ({
    type,
    options,
    option,
    update,
}: MinimaxLevelProps) => {
    return (
        <div>
            <SettingTitle>{type}</SettingTitle>
            <HorizontalLine />
            {
                <Content>
                    {options.map((opt) => (
                        <SettingCustomSelection
                            type={opt === option ? 'Selected' : 'NotSelected'}
                            onClick={() => update(opt)}
                            key={opt}
                        >
                            {opt - 1}
                        </SettingCustomSelection>
                    ))}
                </Content>
            }
        </div>
    );
};

const GridOptions = ({ type, options, option, update }: GridProps) => {
    return (
        <div>
            <SettingTitle>{type}</SettingTitle>
            <HorizontalLine />
            {
                <Content>
                    {options.map((opt) => (
                        <SettingCustomSelection
                            type={opt === option ? 'Selected' : 'NotSelected'}
                            onClick={() => update(opt)}
                            key={opt}
                        >
                            {opt}
                        </SettingCustomSelection>
                    ))}
                </Content>
            }
        </div>
    );
};

const GameOptions = ({ type, options, option, update }: GameOptionsProps) => {
    return (
        <div>
            <SettingTitle>{type}</SettingTitle>
            <HorizontalLine />
            {
                <Content>
                    {options.map((opt) => (
                        <SettingCustomSelection
                            type={opt === option ? 'Selected' : 'NotSelected'}
                            onClick={() => update(opt)}
                            key={opt}
                        >
                            {opt}
                        </SettingCustomSelection>
                    ))}
                </Content>
            }
        </div>
    );
};

const MoveOptions = ({ type, options, option, update }: MoveOptionProps) => {
    return (
        <div>
            <SettingTitle>{type}</SettingTitle>
            <HorizontalLine />
            {
                <Content>
                    {options.map((opt) => (
                        <SettingCustomSelection
                            type={opt === option ? 'Selected' : 'NotSelected'}
                            onClick={() => update(opt)}
                            key={opt}
                        >
                            {opt}
                        </SettingCustomSelection>
                    ))}
                </Content>
            }
        </div>
    );
};

const PlayerOptions = ({
    type,
    options: { crossAI, noughtAI },
    update,
}: PlayerOptionProps) => {
    return (
        <div>
            <SettingTitle>{type}</SettingTitle>
            <HorizontalLine />
            {
                <Content>
                    <SettingCustomSelection
                        type={crossAI ? 'Selected' : 'NotSelected'}
                        onClick={() =>
                            update({
                                crossAI: !crossAI,
                                noughtAI,
                            })
                        }
                    >
                        Cross
                    </SettingCustomSelection>
                    <SettingCustomSelection
                        type={noughtAI ? 'Selected' : 'NotSelected'}
                        onClick={() =>
                            update({
                                crossAI,
                                noughtAI: !noughtAI,
                            })
                        }
                    >
                        Nought
                    </SettingCustomSelection>
                </Content>
            }
        </div>
    );
};

const Setting = ({
    updateGridOption,
    updateGameOption,
    updateMoveOption,
    updateMinimaxOption,
    updatePlayerOption,
    gridOption,
    minimaxOption,
    gameOption,
    moveOption,
    playerOption,
}: SettingProps): JSX.Element => (
    <Contents>
        <GameOptions
            type="Game Setting"
            options={['New Game', 'Download Current Game', 'Load Game']}
            update={updateGameOption}
            option={gameOption}
        />
        <PlayerOptions
            type="Player as AI"
            update={updatePlayerOption}
            options={playerOption}
        />
        <MinimaxOptions
            type="AI Level"
            options={[2, 3, 4, 5]}
            update={updateMinimaxOption}
            option={minimaxOption}
        />
        <GridOptions
            type="Grid"
            options={[3, 4, 5]}
            update={updateGridOption}
            option={gridOption}
        />
        <MoveOptions
            type="Move"
            options={['Undo Move', 'Redo Move']}
            update={updateMoveOption}
            option={moveOption}
        />
    </Contents>
);

const SettingCustomSelection = styled(Selection)`
    @media (max-width: 1117px) {
        font-size: 0.8em;
    }
    @media (max-width: 891px) {
        font-size: 0.7em;
    }
`;

const SettingTitle = styled(Title)`
    @media (max-width: 891px) {
        font-size: 1em !important;
    }
`;

export default Setting;
