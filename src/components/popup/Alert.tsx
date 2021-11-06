import * as React from 'react';
import styled from 'styled-components';
import { Background, Contents, Close, HorizontalLine } from '../common/Styling';
import AlertProperty, { ActionType } from '../../type/AlertType';

interface AlertProps {
    readonly closeAlert: () => void;
    readonly buttonClick: (actionType: ActionType) => void;
    readonly alertProperty: AlertProperty;
}

interface ButtonProps {
    readonly actionType: ActionType;
}

const MultiChoiceAlert = ({
    alertProperty,
    closeAlert,
    buttonClick,
}: AlertProps): JSX.Element | null => {
    if (alertProperty) {
        const { content, requireButton } = alertProperty;
        return (
            <Background
                onClick={(e) => {
                    const { currentTarget, target } = e;
                    if (currentTarget === target) {
                        closeAlert();
                    }
                }}
            >
                <AlertContents>
                    <AlertClose onClick={closeAlert}>&times;</AlertClose>
                    {content}
                    <HorizontalLine />
                    {requireButton ? (
                        <ButtonContainer>
                            <Button
                                actionType="Positive"
                                onClick={() => buttonClick('Positive')}
                            >
                                Yes
                            </Button>
                            <Button
                                actionType="Negative"
                                onClick={() => buttonClick('Negative')}
                            >
                                No
                            </Button>
                            <Button
                                actionType="Neutral"
                                onClick={() => buttonClick('Neutral')}
                            >
                                Cancel
                            </Button>
                        </ButtonContainer>
                    ) : null}
                </AlertContents>
            </Background>
        );
    }
    return null;
};

export const Alert = ({
    alertProperty,
    closeAlert,
    buttonClick,
}: AlertProps): JSX.Element | null => {
    if (alertProperty) {
        const { content } = alertProperty;
        return (
            <Background
                onClick={(e) => {
                    const { currentTarget, target } = e;
                    if (currentTarget === target) {
                        closeAlert();
                    }
                }}
            >
                <AlertContents>
                    <AlertClose onClick={closeAlert}>&times;</AlertClose>
                    {content}
                    <HorizontalLine />
                    <ButtonContainer>
                        <Button
                            actionType="Positive"
                            onClick={() => buttonClick('Positive')}
                        >
                            Yes
                        </Button>
                        <Button
                            actionType="Negative"
                            onClick={() => buttonClick('Negative')}
                        >
                            No
                        </Button>
                    </ButtonContainer>
                </AlertContents>
            </Background>
        );
    }
    return null;
};

const AlertContents = styled(Contents)`
    margin: auto;
    padding: 20px;
`;

const AlertClose = styled(Close)`
    padding: 0 0 5px 10px;
    margin-top: -25px;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Button = styled.div`
    border-radius: 25px;
    padding: 6px 16px;
    margin: 0 5px 0 5px;
    outline: none;
    &:hover {
        cursor: pointer;
    }
    color: ${({ actionType }: ButtonProps) =>
        actionType === 'Positive'
            ? ({ theme }) => theme.theme.primaryColor
            : actionType === 'Negative'
            ? ({ theme }) => theme.theme.secondaryColor
            : ({ theme }) => theme.theme.primaryColor};
    background-color: ${({ actionType }: ButtonProps) =>
        actionType === 'Positive'
            ? ({ theme }) => theme.theme.secondaryColor
            : actionType === 'Negative'
            ? ({ theme }) => theme.theme.primaryColor
            : ({ theme }) => theme.theme.tertiaryColor};
`;

export default MultiChoiceAlert;
