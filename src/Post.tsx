import React, { useCallback, useMemo, unstable_useTransition as useTransition } from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'

import { useMutation } from 'react-relay/lib/relay-experimental';
import { useFragment } from 'react-relay/hooks';
import graphql from 'babel-plugin-relay/macro'

import edit from './assets/edit.svg';
import trashBin from './assets/trashBin.svg';
import Comments from './Comments';
import StyledTextarea from './styles/StyledTextarea';
import { Post_post$key } from './__generated__/Post_post.graphql';
import {DeletePost} from './mutations/DeletePost'
import { UseMutationConfig } from 'react-relay/lib/relay-experimental/useMutation';
import { DeletePostMutation } from './mutations/__generated__/DeletePostMutation.graphql';
import { ConnectionHandler } from 'relay-runtime';

dayjs.extend(relativeTime)

const Container = styled.div`
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

  textarea {
    margin-top: 22px;
    height: 30px;
    width: 100%;
    min-height: 48px;
    resize: vertical;
  }

`
const Comment = styled.div`
  margin-top: 12px;
  background-color: #e5e5e5;
  color: #7b7d82;
  border-radius: 10px;
  padding: 8px 12px;
  width: fit-content;
  
`
type Props = {
  post: Post_post$key
}

type FixMe = any

const Post:React.FC<Props> = ({post}:Props) => {
  const [startTransition] = useTransition()
  const [deletePost] = useMutation(DeletePost);
  const postNode = useFragment<Post_post$key>(graphql`
    fragment Post_post on PostType {
      id
      title
      text
      createdAt        
      comments {
        edges {
          node {
            id
            text
            createdAt
          }
        }
      }
    }
  `,
  post)
  const handleDelete = useCallback(()=> {
    startTransition(() => {
      const config:UseMutationConfig<DeletePostMutation> = {
        variables: {
          id: postNode.id
        },
        optimisticUpdater: (store, data) => {
          const postId = data.DeletePost?.payload?.id;
          if(!postId) return
          store.delete(postId)
        },
        updater: (store, data) => {
          const postId = data.DeletePost?.payload?.id;
          if(!postId) return
          store.delete(postId)
        }
      }
      deletePost(config)
    }) 
  }, [post])
  const createdAtDiff = useMemo(() => {
    const date:FixMe = postNode?.createdAt
    return dayjs(date).fromNow()
  }, [postNode])

  const comments = postNode.comments?.edges || []

  return <Container>
    <header>
      <div>
        <h3>{postNode.title}</h3>
        <p>{createdAtDiff}</p>
      </div>
      <div>
        <button>
          <img src={edit} alt="edit"/>
        </button>
        <button onClick={handleDelete}>
          <img src={trashBin} alt="delete"/>
        </button>
      </div>
    </header>

    <p>
      {postNode.text}
    </p>
    
    <StyledTextarea placeholder="Write your comment here" />
      {comments.map((comment:any) =>(
        <Comment key={comment.id}>
          {comment.node.text}
        </Comment>
      ))}
  </Container>
}

export default Post;