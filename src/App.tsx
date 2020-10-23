import React, {Suspense} from 'react';
import {  RelayEnvironmentProvider, useLazyLoadQuery } from 'react-relay/hooks';

import logo from './assets/logo.svg';
import graphql from 'babel-plugin-relay/macro';
import environment from './relay/environment';

import styled from 'styled-components';
import GlobalStyle from './styles/global'
import Feed from './Feed'
import ErrorBoundary from './ErrorBoundary';
import { AppQuery } from './__generated__/AppQuery.graphql';

const App = () => {
  const SLogo = styled.img`
    margin-top: 60px;
    width: 140px;
  `
  const SContainer = styled.div`
    background-color: #e5e5e5;
    padding: 20px;
    width: 100%;
    min-height: 100vh;;
    display: flex;
    flex-direction: column;
    align-items: center; 
  `
  const query = useLazyLoadQuery<AppQuery>(
    graphql`
      query AppQuery {
        ...Feed_query
      }
    `, {},
    {fetchPolicy: 'store-or-network'}
  )

  console.log(query)

  return (
    <SContainer className="App">
          <SLogo src={logo} />
          <Feed query={query}/>
    </SContainer>
  );
}

const AppRoot = () => (
  <RelayEnvironmentProvider environment={environment}>
    <Suspense fallback={() => <div>Loading...</div>}>
      <ErrorBoundary>
        <App/>
        <GlobalStyle />
      </ErrorBoundary>
    </Suspense>
  </RelayEnvironmentProvider>
)

export default AppRoot;
