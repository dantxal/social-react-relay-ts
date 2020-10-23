import React, { useCallback, useMemo, unstable_useTransition as useTransition, useState } from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import { useMutation } from 'react-relay/lib/relay-experimental';
import { useFragment } from 'react-relay/hooks';
import graphql from 'babel-plugin-relay/macro'
import { commitMutation } from 'react-relay';
import environment from './relay/environment'
import { FiEdit2, FiFeather, FiTrash, FiX } from 'react-icons/fi'
import StyledTextarea from './styles/StyledTextarea';
import { Post_post$key } from './__generated__/Post_post.graphql';
import { DeletePost, deletePostConfigs } from './mutations/DeletePost'
import {EditPost} from './mutations/EditPost';
import {EditPostMutation} from './mutations/__generated__/EditPostMutation.graphql';
import CommentsFeed from './CommentsFeed';
dayjs.extend(relativeTime)

const Container = styled.div`
  width: 100%;
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

  .editForm {
    > textarea {
      margin: 0 !important;
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
        margin: 0;
        
      }

      div {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-left: 20px;

      button {
        border-radius: 50% !important;
      }
      .confirm {
        height: 48px;
        width: 48px;
        padding: 12px;

        background-color: #0458FD;
        box-shadow: 1px 0 8px #0458FD; 
      }
    }
    }
  }
`
const CancelButton = styled.button`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  background-color: #fd0404;
  box-shadow: 1px 0 8px #fd0404;
  height: 40px !important;
  width: 40px !important;
  padding: 10px;
`

type Props = {
  post: Post_post$key
}

const Post:React.FC<Props> = ({post}:Props) => {
  const [formData, setFormData] = useState({
    title: '',
    text: ''
  })
  const [isEditing, setIsEditing] = useState(false)

  const [startTransition] = useTransition()
  const [deletePost] = useMutation(DeletePost);
  const postResponse = useFragment<Post_post$key>(graphql`
    fragment Post_post on PostType {
      id
      title
      text
      createdAt        
      ...CommentsFeed_query 
    }
  `,
  post)
  
  const postNode = {
    id: postResponse.id || '',
    title: postResponse.title || '',
    text: postResponse.text || '',
    createdAt: postResponse.createdAt,
  }
  const createdAtDiff = useMemo(() => {
    const date = postNode?.createdAt
    return dayjs(date as string).fromNow()
  }, [postNode])

  const handleDelete = useCallback(()=> {
    startTransition(() => {
      deletePost(deletePostConfigs(postNode.id))
    }) 
  }, [deletePost, postNode.id, startTransition])

  const handleStartEdit = useCallback(() => {
    setFormData({
      title: postNode.title || '',
      text: postNode.text || ''
    })
    setIsEditing(true);
  }, [postNode.text, postNode.title])

  const handleChange = (event: any) => {
    const {name, value} = event.target
    setFormData({
      ...formData,
      [name]: value
    });
  }

  const handleEdit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if(!formData.text || !formData.title) return;
    const optimisticResponse = {
      UpdatePost: {
        post: {
          id: postNode.id,
          text: formData.text,
          title: formData.title,
          createdAt: postNode.createdAt
        }
      }
    }
    startTransition(() => {
      const dispose = commitMutation<EditPostMutation>(environment, {
        mutation: EditPost,
        variables: {
          id: postNode.id,
          text: formData.text,
          title: formData.title
        },
        optimisticResponse
      });
      setFormData({text: '', title: ''})
      setIsEditing(false);
    })
  }


 
  return (
  <Container >
    {isEditing ? 
    <form onSubmit={handleEdit} className="editForm">
      <StyledTextarea 
        name="title"
        value={formData.title} 
        placeholder={postNode.title}
        onChange={handleChange}
      />
      <div>
        <StyledTextarea 
          name="text"
          value={formData.text} 
          placeholder={postNode.text}
          onChange={handleChange}
        />
        <div>
          <CancelButton type="button" onClick={ () => setIsEditing(false)}>
            <FiX size={24} color="#fff" />
          </CancelButton>
          <button type="submit" className="confirm">
            <FiFeather size={24} color="#fff"/>
          </button>
        </div>
      </div>
    </form>
    :
    <>
      <header>
        <div>
          <h3>{postNode.title}</h3>
          <p>{createdAtDiff}</p>
        </div>
        <div>
          <button onClick={handleStartEdit}>
            <FiEdit2 size={20} color="#b5b5b5"/>
          </button>
          <button onClick={handleDelete}>
            <FiTrash size={20} color="#b5b5b5"/>
          </button>
        </div>
      </header>

      <p>
        {postNode.text}
      </p>
    </>}
    
    <CommentsFeed postQuery={postResponse} />
  </Container>
  )
}

export default Post;