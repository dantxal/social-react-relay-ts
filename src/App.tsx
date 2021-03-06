import React, {Suspense} from 'react';
import {  RelayEnvironmentProvider, useLazyLoadQuery } from 'react-relay/hooks';
import PerfectScrollbar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css';

import logo from './assets/logo.svg';
import graphql from 'babel-plugin-relay/macro';
import environment from './relay/environment';

import styled from 'styled-components';
import GlobalStyle from './styles/global'
import Feed from './Feed'
import ErrorBoundary from './ErrorBoundary';
import { AppQuery } from './__generated__/AppQuery.graphql';
import LoadingApp from './LoadingApp';

const App = () => {
  const SLogo = styled.img`
    margin-top: 20px;
    width: 140px;
  `
  const SContainer = styled.div`
    position:relative;
    overflow: hidden;
    height: 100%;

    .perfectScrollBar {
      position: relative;
      overflow:hidden !important;
      height:100%;
      background-color: #e5e5e5;
      padding: 20px;
      width: 100%;
      min-height: 100vh;

      display: flex;
      flex-direction: column;
      align-items: center; 
    }
   
  `

const query = useLazyLoadQuery<AppQuery>(
    graphql`
      query AppQuery {
        ...Feed_query
      }
    `, {},
    {fetchPolicy: 'store-or-network'}
  )

  return (
    <SContainer className="App">
      <PerfectScrollbar 
      component="div" 
      className="perfectScrollBar"
      id="appScrollable"
      >
          <SLogo src={logo} />
          <Feed query={query}/>
      </PerfectScrollbar>
    </SContainer>
  );
}

const AppRoot = () => (
  <RelayEnvironmentProvider environment={environment}>
    <Suspense fallback={<LoadingApp />}>
      <ErrorBoundary>
        <App/>
        <GlobalStyle />
      </ErrorBoundary>
    </Suspense>
  </RelayEnvironmentProvider>
)

export default AppRoot;
