'use client'
import { useState, createContext, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';

export interface ThemeContextContent {
  currentTheme: string;
  setCurrentTheme: React.Dispatch<React.SetStateAction<string>>;
}

interface ThemePreference {
  themePreference: string;
}
interface ThemesMap {
  [key: string]: {
    fontColour: string;
    backgroundColour: string;
    buttonBackground: string;
    buttonBackgroundHover: string;
    buttonFont: string;
    buttonHover: string;
    warningFont: string;
    warningBackground: string;
    headerBackgroundColour: string;
    headerFont: string;
    linkHover: string;
  },
}

const themesMap: ThemesMap = {
  light: {
    fontColour: '#000',
    backgroundColour: '#fff',
    buttonBackground: '#003d73',
    buttonBackgroundHover: '#00305c',
    buttonFont: '#fff',
    buttonHover: '#fff',
    warningFont: '#ee0000',
    warningBackground: '#fbcccc',
    headerBackgroundColour: '#003d73',
    headerFont: '#fff',
    linkHover: '#F5DD90',
  },
  dark: {
    fontColour: '#fff',
    backgroundColour: '#000',
    buttonBackground: '#FFFF00',
    buttonBackgroundHover: '#cccc00',
    buttonFont: '#000',
    buttonHover: '#000',
    warningFont: '#ffe900',
    warningBackground: '#fff8b2',
    headerBackgroundColour: '#000',
    headerFont: '#fff',
    linkHover: '#FFFF00',
  },
}

const defaultValue = {
  currentTheme: 'light',
  setCurrentTheme: () => {},
}

export const ThemePreferenceContext = createContext<ThemeContextContent>(defaultValue);

const Theme = ({ children, themePreference }: React.PropsWithChildren & ThemePreference) => {
  // const savedTheme = themePreference;
  const [currentTheme, setCurrentTheme] = useState<string>(themePreference || 'light');

  // useEffect(() => {
  //   const themeQuery = window.matchMedia('(prefers-color-scheme: light)')
  //   setCurrentTheme(themeQuery.matches ? 'light' : 'dark')
  //   themeQuery.addEventListener('change', ({ matches }) => {
  //     setCurrentTheme(matches ? 'light' : 'dark')
  //   })
  // }, []);

  const theme = { colors: themesMap[currentTheme] };

  return (
    <ThemePreferenceContext.Provider value={{ currentTheme, setCurrentTheme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemePreferenceContext.Provider>
  );
};

export default Theme;
