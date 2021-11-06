import styled, { createGlobalStyle } from 'styled-components';

export const FullScreenContainer = styled.div`
    position: fixed;
    width: 100vw;
    height: 100vh;
    z-index: 1;
    left: 0;
    top: 0;
    overflow: auto;
    align-items: center;
    justify-content: center;
    display: flex;
`;

const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        padding: 0;
        overflow-x: hidden;
        background-color: ${({ theme }) => theme.theme.primaryColor};
        transition: all ease-in-out 0.5s;
    }
    html {
        scroll-behavior: smooth;
    }
    * {
        scrollbar-width: thin;
        scrollbar-color: gray ${({ theme }) => theme.theme.scrollBarBackground};
        font-family: 'Roboto', sans-serif;
    }
    *::-webkit-scrollbar {
        width: 7px;
    }
    *::-webkit-scrollbar-track {
        background: ${({ theme }) => theme.theme.scrollBarBackground};
    }
    *::-webkit-scrollbar-thumb {
        background-color: gray;
    }
`;

export default GlobalStyle;
