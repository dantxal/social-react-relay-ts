import React from 'react';
import styled from 'styled-components';

import like from './assets/like.svg';
import liked from './assets/liked.svg';

const Container = styled.div`
    margin-top: 15px;
    display: flex;
    flex-direction: row;
    align-items: center;
    h4 {
      margin-left: 8px;
      font-size: 16px;
    }
`

const Like:React.FC = () => {

  return (
    <Container>
      <button>
        <img src={like} alt="like"/>
      </button>
      <h4>0</h4>
    </Container>
  )
}

export default Like;