import React, {Suspense, useState, useEffect} from 'react';
import { RelayEnvironmentProvider } from 'react-relay/hooks';

import logo from './assets/logo.svg';

import environment from './relay/environment';

import styled from 'styled-components';
import GlobalStyle from './styles/global'
import Feed from './Feed'


const App = () => {
  const SLogo = styled.img`
    margin-top: 60px;
    width: 140px;
  `
  const SContainer = styled.div`
    background-color: #e5e5e5;
    padding: 20px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center; 
  `

  return (
    <SContainer className="App">
          <Suspense fallback="loading...">
            <SLogo src={logo} />
            <Feed />
          </Suspense>
    </SContainer>
  );
}

const AppRoot = () => (
  <RelayEnvironmentProvider environment={environment}>
    <App/>
    <GlobalStyle />
  </RelayEnvironmentProvider>
)

export default AppRoot;
