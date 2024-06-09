import React, { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
// import { Helmet } from 'react-helmet';
import { HelmetProvider } from 'react-helmet-async';

// ** Global css styles
import '../styles/globals.css';
import './app.css';
// ** Component Imports
// import UserLayout from '@theme-ui';

// import NxWelcome from './nx-welcome';
// import { HelmetProvider } from 'react-helmet-async'
// import { BrowserRouter } from 'react-router-dom'

// ** MUI Imports
// import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ThemeProvider as MuiThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';

// ** Loader Import
import NProgress from 'nprogress'

// ** Redux Imports
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { store, persistor } from '../redux/store'

// ** Emotion Imports
import { CacheProvider } from '@emotion/react';
import { BlankLayout, createEmotionCache } from '@theme-ui';
import type { EmotionCache } from '@emotion/cache';

// ** Navigation Routes
import { Router as AppRoutes } from '@theme-ui';

// ** Config Imports
import { themeConfig } from '@theme-ui'

// ** Component Imports
import { UserLayout } from '@theme-ui'
import { ThemeProvider } from '@theme-ui'

// ** Contexts
import { AuthProvider, SettingsConsumer, SettingsProvider } from '@theme-ui'

// ** Extend App Props with Emotion
type ExtendedAppProps = {
  Component: React.ComponentType & { getLayout?: (page: React.ReactNode) => React.ReactNode };
  emotionCache?: EmotionCache;
  pageProps?: any;
};

const clientSideEmotionCache = createEmotionCache();

// ** Theme MUI Imports
const themeOptions = {
  contentWidth: 'full',
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
};

let theme = createTheme(themeOptions);

// ** Enable responsive font sizes
theme = responsiveFontSizes(theme);

const helmetContext = {};

// export function App() {
const App = ({ Component, emotionCache = clientSideEmotionCache, pageProps }: ExtendedAppProps) => {
  // Variables
  const getLayout = Component?.getLayout ?? ((page: React.ReactNode) => <UserLayout>{page}</UserLayout>);

  return (
  <AuthProvider>
  <CacheProvider value={emotionCache}>
    <HelmetProvider context={helmetContext}>
      <title>{`${themeConfig.templateName} - Dashboard`}</title>
        <meta
          name='description'
          content={`${themeConfig.templateName} – Dashboard.`}
        />
        <meta name='keywords' content='Material Design, MUI, Admin Template, React Admin Template' />
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SettingsProvider>
          <BrowserRouter>
            <SettingsConsumer>
              {({ settings }) =>
              // (
              //   <MuiThemeProvider theme={responsiveFontSizes(createTheme(settings))}>
              //     { getLayout(<Component {...pageProps} />) }
              //   </MuiThemeProvider>
              // )
              // {
              //   return <ThemeProvider settings={settings}>{getLayout(<Component {...pageProps} />)}</ThemeProvider>
              // } 
              (<ThemeProvider settings={settings}>
                    {/* <Router> */}
                      <AppRoutes {...pageProps}/>
                    {/* </Router> */}
                </ThemeProvider>)
              }
            </SettingsConsumer>
            </BrowserRouter>
          </SettingsProvider>
        </PersistGate>
      </ReduxProvider>
    </HelmetProvider>
  </CacheProvider>
  </AuthProvider>
  );
}

export default App;
