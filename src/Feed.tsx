import React, {Suspense, useState, useEffect} from 'react';
import styled from 'styled-components';

import edit from './assets/edit.svg';
import trashBin from './assets/trashBin.svg';
import like from './assets/like.svg';
import liked from './assets/liked.svg';

import PostForm from './PostForm';

const Wrapper= styled.div`
  width: 600px;
  margin-top: 25px;
  padding-bottom: 20px;
`
const Card = styled.div`
  & + & {
    margin-top: 30px;
  }
  background-color: #fff;
  padding: 22px;
  border-radius: 10px;
`
const Post = styled.div`
  min-height: 200px;
  width: 100%;
  /* border: 1px red solid; */

  header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    > div {
      display: flex;
      flex-direction: row;
      align-items: center;

      > h3 {
        font-size: 18px;
        color: #061057;
      }
      > p {
        color: #b1b6be;
        font-size: 12px;
        margin: 0;
        margin-left: 8px;
      }
    }

    button {
      height: 18px;
      
    }

    button + button {
      margin-left: 25px;
    }
  }

  > p {
    margin-top: 15px;
    color: #7B7D82;
    font-size: 16px;
  }

  > .like {
    margin-top: 15px;
    display: flex;
    flex-direction: row;
    align-items: center;
    h4 {
      margin-left: 8px;
      font-size: 16px;
    }
  }

  textarea {
    margin-top: 22px;
    height: 30px;
    min-height: 30px;
    min-width: 100%;
    max-width: 100%;
    
    background-color: #e5e5e5;
    border: 0;
    border-radius: 10px;
    padding: 8px 12px;
    &::placeholder {
      color: #B1B6BE;
    }
    overflow: hidden;
  }

  .comments {
    margin-top: 12px;
    p {
      background-color: #e5e5e5;
      color: #7b7d82;
      border-radius: 10px;
      padding: 8px 12px;
      width: fit-content;
    }
    p + p {
      margin-top: 8px;
    }
  }

`

const Feed: React.FC = () => {

  return <Wrapper>
    <Card>
      <PostForm />
    </Card>
    <Card>
      <Post>
        <header>
          <div>
            <h3>Hello world</h3>
            <p>há 12 min</p>
          </div>
          <div>
            <button>
              <img src={edit} alt="edit"/>
            </button>
            <button>
              <img src={trashBin} alt="delete"/>
            </button>
          </div>
        </header>
        <p>
          A delicious mixture of French and Ranch dressings. 
          <br />
          You: Wow, this salad is delicious! What dressing is this? 
          <br />
          Me: Oh, it's called Franch. It's 1/2 French dressing 
          <br />
          <br />
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do 
          eiusmod tempor incididunt ut labore et dolore magna aliqua. 
          Ut enim ad minim veniam, quis nostrud exercitation ullamco 
          laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure 
          dolor in reprehenderit in voluptate velit esse cillum dolore eu 
          fugiat nulla pariatur. Excepteur sint occaecat cupidatat non 
          proident, sunt in culpa qui officia deserunt mollit anim id est 
          laborum.
        </p>
        <div className="like">
          <button>
            <img src={like} alt="like"/>
          </button>
          <h4>0</h4>
        </div>
        
        <textarea placeholder="Write your comment here" />

        <div className="comments">
          <p>
            Wow! Very cool!
          </p>
          <p>
            Wow! Very cool indeed! I always dreamed of working as a French chef so I could create some amazing recipes 
            like that. Awesome storytelling!
          </p>
          <p>
            Wow! Very cool!
          </p>
        </div>        
      </Post>
    </Card>
    </Wrapper>
}

export default Feed;