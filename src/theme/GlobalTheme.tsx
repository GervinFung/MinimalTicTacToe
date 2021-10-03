import { createGlobalStyle } from 'styled-components';

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
        font-family: Consolas, monaco, monospace;
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