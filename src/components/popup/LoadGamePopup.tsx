import * as React from 'react';
import styled from 'styled-components';
import { ActionType } from '../../type/AlertType';
import { Resources } from '../../type/GameType';
import { Background, Contents, Close, HorizontalLine } from '../common/Styling';

interface LoadGamePopupProps {
    readonly closePopup: () => void;
    readonly buttonClick: (actionType: ActionType) => void;
    readonly restoreGameFromFile: (resources: Resources) => void;
    readonly show: boolean;
}

const LoadGamePopup = ({
    show,
    closePopup,
    buttonClick,
    restoreGameFromFile,
}: LoadGamePopupProps): JSX.Element | null => {
    if (show) {
        const readFile = async (file: File) => {
            const text = await file.text();
            restoreGameFromFile(JSON.parse(text));
        };

        return (
            <Background
                onClick={(e) => {
                    const { currentTarget, target } = e;
                    if (currentTarget === target) {
                        closePopup();
                    }
                }}
            >
                <LoadGamePopupContents>
                    <LoadGamePopupClose onClick={closePopup}>
                        &times;
                    </LoadGamePopupClose>
                    Please upload one of your saved game
                    <HorizontalLine />
                    <ButtonContainer>
                        <UploadLabel htmlFor="upload">Upload File</UploadLabel>
                        <UploadFile
                            id="upload"
                            onChange={(e) => {
                                buttonClick('Positive');
                                const files = e.target.files;
                                if (files) {
                                    const [saved] = Array.from(files);
                                    readFile(saved);
                                }
                            }}
                        />
                        <Button
                            onClick={() => {
                                buttonClick('Negative');
                                closePopup();
                            }}
                        >
                            Cancel
                        </Button>
                    </ButtonContainer>
                </LoadGamePopupContents>
            </Background>
        );
    }
    return null;
};

const LoadGamePopupContents = styled(Contents)`
    margin: auto;
    padding: 20px;
`;

const LoadGamePopupClose = styled(Close)`
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
    color: ${({ theme }) => theme.theme.secondaryColor};
    background-color: ${({ theme }) => theme.theme.primaryColor};
`;

const UploadFile = styled.input.attrs({
    type: 'file',
})`
    border-radius: 25px;
    padding: 6px 16px;
    margin: 0 5px 0 5px;
    outline: none;
    &:hover {
        cursor: pointer;
    }
    color: transparent;
    background-color: transparent;
    z-index: -1;
`;

const UploadLabel = styled.label`
    border-radius: 25px;
    padding: 6px 16px;
    margin: 0 5px 0 5px;
    outline: none;
    &:hover {
        cursor: pointer;
    }
    color: ${({ theme }) => theme.theme.primaryColor};
    background-color: ${({ theme }) => theme.theme.secondaryColor};
`;

export default LoadGamePopup;
