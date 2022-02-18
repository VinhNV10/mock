import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';

import { ThemeProvider, StyledEngineProvider } from '@material-ui/core';

import GlobalStyles from './components/Layout/GlobalStyles';
import theme from './theme';
import routes from './routes';

import LoadingSpinner from 'components/Layout/LoadingSpinner';

import 'react-perfect-scrollbar/dist/css/styles.css';

function App() {

  const content = useRoutes(routes);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Suspense
          fallback={
            <LoadingSpinner />
          }
        >
          {content}
        </Suspense>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
