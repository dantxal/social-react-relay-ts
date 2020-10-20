import React, {Suspense, useState, useEffect} from 'react';
import styled from 'styled-components';

import feather from './assets/feather.svg';

const Wrapper = styled.div`
form {
  > textarea {
    width: 100%;
    resize: none;
  }
  > div {
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    textarea {
      display: flex;
      flex: 1;
      resize: vertical;
      height: 100px;
      min-height: 100px;
      
      
    }

    button {
      height: 48px;
      width: 48px;
      margin-left: 20px;
      background-color: #0458FD;
      padding: 12px;
      border-radius: 50%;
      box-shadow: 1px 0 8px #0458FD 

    }
  }
}
`

const TextArea = styled.textarea`
  background-color: #e5e5e5;
  border: 0;
  border-radius: 10px;
  padding: 8px 12px;
  &::placeholdejhr {
    color: #B1B6BE;
  }
  overflow: auto;
`
const PostForm: React.FC = () => {
  return <Wrapper>
      <form>
        <TextArea 
          placeholder="How to right a post title" 
        />
        <div>
          <TextArea 
            placeholder="Write your post's content here" 
          />
          <button>
            <img src={feather} alt="Add post"/>
          </button>
        </div>
      </form>
    </Wrapper>
    
}

export default PostForm;