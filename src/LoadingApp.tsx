import React from 'react';
import styled from 'styled-components';
import logo from './assets/logo.svg';

const FakeTextarea = styled.div`
  border-radius: 3px;
  width: 100%;
  background-color: #e5e5e5;
`
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

const Wrapper= styled.div`
  width: 600px;
  max-width: 90%;
  margin-top: 25px;
  padding-bottom: 20px;
  height: 100%;
`
const Card = styled.div`
  & + & {
    margin-top: 30px;
  }
  background-color: #fff;
  padding: 22px;
  border-radius: 3px;
`
const FakeForm = styled.div`
    .titleInput {
      border-radius: 3px;
      width: 100%;
      background-color: #e5e5e5;
      height: 46px;
    }
    .textInputContainer {
      margin-top: 20px;
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      
      .textInput {
        display: flex;
        flex: 1;
        height: 100px;
      }

      .buttonsContainer {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        button {
          border: 0;
          height: 48px;
          width: 48px;
          margin-left: 20px;
          padding: 12px;
          border-radius: 50%;
        }
        .confirm {
          background-color: #0458FD;
          box-shadow: 1px 0 8px #0458FD; 
        }
      }
    }
`
const SFakePost = styled.div`
  width: 100%;
  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    > div {
      display: flex;
      flex-direction: row;
      align-items: center;

      > .title {
        width: 100px;
        height: 18px;
        background-color: #e5e5e5;
      }i
      > p {
        background-color: #e5e5e5;
        width: 50px;
        height: 12px;
        margin: 0;
        margin-left: 8px;
      }
    }

    button {
      border: 0;
      height: 20px;
      width: 20px;
      border-radius: 3px;
      background-color: #e5e5e5;
    }

    button + button {
      margin-left: 25px;
    }
  }

  > p {
    margin-top: 15px;
    height: 16px;
    width: 100%;
    border-radius: 3px;
    background-color: #e5e5e5;
    & + p {
      margin-top: 8px;
    }
  }

  .commentInput {
    margin-top: 22px;
    height: 30px;
    width: 100%;
    min-height: 48px;
    resize: none;
  }

  .confirm {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    border-radius: 7px;
    background-color: green;
    color: #fff;
  }

  
`

const FakePost = () => (
  <Card>
    <SFakePost>
      <div className="header">
        <div>
          <div className="title"></div>
          <p />
        </div>
        <div>
          <button />
          <button />
        </div>
      </div>

      <p />
      <p />
      <p />
      <FakeTextarea className="commentInput"/>
    </SFakePost>
  </Card>
)

const LoadingApp: React.FC = () => (
  <SContainer>
    <SLogo src={logo} />
    <Wrapper>
      <Card>
        <FakeForm>
          <FakeTextarea className="titleInput" />
          <div className="textInputContainer">
            <FakeTextarea className="textInput" />
            <div className="buttonsContainer">
              <button className="confirm"></button>
            </div>
          </div>
      </FakeForm>
      </Card>
      <FakePost />
      <FakePost />
      <FakePost />
    </Wrapper>
  </SContainer>
  )

export default LoadingApp;