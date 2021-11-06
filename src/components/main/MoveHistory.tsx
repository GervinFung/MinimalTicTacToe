import * as React from 'react';
import styled from 'styled-components';
import { MoveNotation } from '../../ts/move';

interface MoveHistoryProps {
    readonly moveLog: ReadonlyArray<MoveNotation>;
    readonly restoreBoard: (index: number) => void;
}

interface AllMovesMadeProps {
    readonly isEvenNum: boolean;
}

const MoveHistory = ({ moveLog, restoreBoard }: MoveHistoryProps) => {
    const AllMovesMade = ({ isEvenNum }: AllMovesMadeProps) => (
        <MovesMadeTemplateColumns>
            {moveLog
                .map((move, index) => ({ move, index }))
                .filter((_, index) =>
                    isEvenNum ? index % 2 === 0 : index % 2 !== 0
                )
                .map(({ move, index }) => (
                    <MovesMade
                        onClick={() => restoreBoard(index)}
                        key={index}
                    >{`${index + 1}. ${move}`}</MovesMade>
                ))}
        </MovesMadeTemplateColumns>
    );

    return (
        <>
            <MoveHistoryTitle>Move Log</MoveHistoryTitle>
            <MovesMadeContainer>
                <AllMovesMade isEvenNum={true} />
                <AllMovesMade isEvenNum={false} />
            </MovesMadeContainer>
        </>
    );
};

export default MoveHistory;

const MoveHistoryTitle = styled.div`
    width: 100%;
    text-align: center;
    color: ${({ theme }) => theme.theme.tertiaryColor};
    font-size: 1.5em;
    padding: 0 0 15px 0;
`;

const MovesMadeContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
`;

const MovesMadeTemplateColumns = styled.div`
    width: 100%;
`;

const MovesMade = styled.div`
    padding: 10px;
    height: fit-content;
    color: ${({ theme }) => theme.theme.secondaryColor};
    font-size: 1.5em;
    cursor: pointer;
    margin: 1px;
    border: 1px solid ${({ theme }) => theme.theme.secondaryColor};
    @media (max-width: 1117px) {
        font-size: 1.2em;
    }
`;
