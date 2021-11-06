import styled from 'styled-components';
import { FullScreenContainer } from '../../theme/GlobalTheme';

interface SelectionProps {
    readonly type: 'Selected' | 'NotSelected';
}

export const Background = styled(FullScreenContainer)`
    background-color: #00000066;
`;

export const Contents = styled.div`
    padding: 0 20px 0 20px;
    border: none;
    width: auto;
    font-size: 1.5em;
    background-color: ${({ theme }) => theme.theme.primaryColor};
    border-radius: 10px;
`;

export const Title = styled.div`
    color: ${({ theme }) => theme.theme.tertiaryColor};
`;

export const HorizontalLine = styled.hr`
    border: 1px solid color ${({ theme }) => theme.theme.horizontalLine};
`;

export const Close = styled.span`
    color: #aaaaaa;
    float: right;
    margin-top: -15px;
    font-size: 1.5em;
    font-weight: bold;
    &:hover,
    &:focus {
        color: ${({ theme }) => theme.theme.secondaryColor};
        text-decoration: none;
        cursor: pointer;
    }
`;

export const Content = styled.div`
    display: inline-flex;
    flex-wrap: wrap;
    width: 100%;
    > label {
        margin: 15px;
    }
`;

export const Selection = styled.div`
    transition: all 0.25s ease;
    border-radius: 25px;
    padding: 6px 16px;
    margin: 5px;
    outline: none;
    &:hover {
        cursor: pointer;
    }
    color: ${({ type }: SelectionProps) =>
        type === 'Selected'
            ? ({ theme }) => theme.theme.primaryColor
            : ({ theme }) => theme.theme.secondaryColor};
    background-color: ${({ type }: SelectionProps) =>
        type === 'Selected'
            ? ({ theme }) => theme.pink
            : ({ theme }) => theme.theme.primaryColor};
`;
