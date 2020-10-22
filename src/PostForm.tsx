import React, {Suspense, useState, useEffect, unstable_useTransition as useTransition} from 'react';
import styled from 'styled-components';
import graphql from 'babel-plugin-relay/macro';

import StyledTextarea from './styles/StyledTextarea'
import feather from './assets/feather.svg';
import { useMutation } from 'react-relay/lib/relay-experimental';
import { CreatePost, createPostConfigs } from './mutations/CreatePost';

type Props = {
  setPosts?:any
}

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

const PostForm: React.FC<Props> = ({setPosts}:Props) => {
  const [startTransition] = useTransition({timeoutMs: 5000})
  const [formData, setFormData] = useState({
    postTitle: '',
    postText: ''
  })
  const [commit] = useMutation(CreatePost);
  
  function onChange(event: any) {
    const {name, value} = event.target
    setFormData({
      ...formData,
      [name]: value
    });
  }
  const postSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    startTransition(() => {
      // event.preventDefault()
      commit(createPostConfigs(formData.postTitle, formData.postText))
    })
  }

  return <Wrapper>
      <form onSubmit={postSubmit}>
        <StyledTextarea
        value={formData.postTitle}
        onChange={onChange}
          name="postTitle"
          placeholder="How to right a post title" 
        />
        <div>
          <StyledTextarea
            value={formData.postText}
            onChange={onChange}
            name="postText"
            placeholder="Write your post's content here" 
          />
          <button type="submit">
            <img src={feather} alt="Add post"/>
          </button>
        </div>
      </form>
    </Wrapper>
    
}

export default PostForm;