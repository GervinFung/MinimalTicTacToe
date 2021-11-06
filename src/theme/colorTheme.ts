import { DefaultTheme } from 'styled-components';
import { Theme } from './Theme';

const darkTheme: Theme = {
    primaryColor: '#121212',
    secondaryColor: '#FEFEFE',
    hoverColor: '#000000B3',
    scrollBarBackground: '#000D0D',
    tertiaryColor: '#BfA75D',
    horizontalLine: '#3E3E42',
};

const lightTheme: Theme = {
    primaryColor: '#FEFEFE',
    secondaryColor: '#121212',
    hoverColor: '#0000001A',
    scrollBarBackground: '#F5F5F5',
    tertiaryColor: '#007ACC',
    horizontalLine: '#C9C9C9',
};

export const primaryTheme: DefaultTheme = {
    theme: darkTheme,
    pink: '#E91E63',
};

export const secondaryTheme: DefaultTheme = {
    theme: lightTheme,
    pink: '#E91E63',
};

export const getTheme = (theme: DefaultTheme) =>
    isPrimary(theme) ? secondaryTheme : primaryTheme;
export const isPrimary = (theme: DefaultTheme) => theme.theme === darkTheme;

export const KEY = '8bf5222d-ABAS912-038e-4dfd-ab93-ab6267f8dc55';
export const PRIMARY = '7611fdc9-ABA123A-cb5c-4e4f-9c66-9bd609c70a08';
export const SECONDARY = '50a47b63-JA2JDA9-cfde-4c7a-a9c6-3329a841188b';
