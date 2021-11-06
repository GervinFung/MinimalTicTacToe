import 'styled-components';

interface Theme {
    readonly primaryColor: '#121212' | '#FEFEFE';
    readonly secondaryColor: '#FEFEFE' | '#121212';
    readonly hoverColor: '#000000B3' | '#0000001A';
    readonly scrollBarBackground: '#000D0D' | '#F5F5F5';
    readonly tertiaryColor: '#007ACC' | '#BfA75D';
    readonly horizontalLine: '#3E3E42' | '#C9C9C9';
}

declare module 'styled-components' {
    export interface DefaultTheme {
        readonly theme: Theme;
        readonly pink: '#E91E63';
    }
}
