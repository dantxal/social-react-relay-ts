import React, { useState, useEffect, unstable_useTransition as useTransition} from 'react';
import { ConnectionHandler } from 'relay-runtime';
import styled from 'styled-components';
import { FiFeather, FiX } from 'react-icons/fi';

import StyledTextarea from './styles/StyledTextarea'

import { commitMutation } from 'react-relay';
import environment from './relay/environment'

import { CreatePost } from './mutations/CreatePost';
import { CreatePostMutation } from './mutations/__generated__/CreatePostMutation.graphql';
import { Options, RefetchFnDynamic } from 'react-relay/lib/relay-experimental/useRefetchableFragmentNode';
import { FeedPaginationQuery } from './__generated__/FeedPaginationQuery.graphql';
import { Feed_query$key } from './__generated__/Feed_query.graphql';

type Props = {
  refetchPosts: RefetchFnDynamic<FeedPaginationQuery, Feed_query$key, Options>
}

type CancelButtonProps = {
  isFormEmpty: boolean
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
      resize: none;
      height: 100px;
      min-height: 100px;
    }

    div {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      button {
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
}
`
const CancelButton = styled.button<CancelButtonProps>`
  opacity: ${({isFormEmpty}) => isFormEmpty ? 0 : 1};
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  
  background-color: #fd0404;
  box-shadow: 1px 0 8px #fd0404;
  height: 40px !important;
  width: 40px !important;
  padding: 10px;
`

const PostForm: React.FC<Props> = ({refetchPosts}:Props) => {
  const [startTransition] = useTransition({timeoutMs: 200})
  const [formData, setFormData] = useState({
    title: '',
    text: ''
  })
  const [isFormEmpty, setIsFormEmpty] = useState(true)
  
  
  function onChange(event: any) {
    const {name, value} = event.target
    setFormData({
      ...formData,
      [name]: value
    });
  }
  useEffect(() => {
    setIsFormEmpty(!formData.text && !formData.title ? true : false)
  }, [formData])
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if(!formData.text || !formData.title) return;
    startTransition(() => {
      const dispose = commitMutation<CreatePostMutation>(environment, {
        mutation: CreatePost,
        variables: {
          text: formData.text,
          title: formData.title
        },
        updater:(store) => {
          const payload = store.getRootField('CreatePost');
          const newEdge = payload.getLinkedRecord('postEdge');

          const root = store.getRoot();
          const conn = ConnectionHandler.getConnection(
            root,
            'Feed_posts'
          );
          if(conn) {
            ConnectionHandler.insertEdgeBefore(conn, newEdge);
          }
        },
        onCompleted: () => {
          refetchPosts({first: 10})
        }
      });
      setFormData({text: '', title: ''})
    })
  }

  const handleClear = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setFormData({title: '', text: ''})
  }
  return <Wrapper>
      <form onSubmit={handleSubmit}>
        <StyledTextarea
        value={formData.title}
        onChange={onChange}
          name="title"
          placeholder="How to right a post title" 
        />
        <div>
          <StyledTextarea
            value={formData.text}
            onChange={onChange}
            name="text"
            placeholder="Write your post's content here" 
          />
          <div>
          <CancelButton 
            className="cancel" 
            type="button" 
            onClick={handleClear}
            isFormEmpty={isFormEmpty}
          >
            <FiX size={24} color="#fff" />
          </CancelButton>
          <button className="confirm" type="submit">
            <FiFeather size={24} color="#fff" />
          </button>
          </div>
        </div>
      </form>
    </Wrapper>
    
}

export default PostForm;