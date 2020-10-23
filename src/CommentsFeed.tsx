import React, { useState, useCallback} from 'react';
import styled from 'styled-components';
import graphql from 'babel-plugin-relay/macro'
import StyledTextarea from './styles/StyledTextarea';
import { CreateComment } from './mutations/CreateComment';
import { ConnectionHandler } from 'relay-runtime';
import { UseMutationConfig } from 'react-relay/lib/relay-experimental/useMutation';
import { CreateCommentMutation } from './mutations/__generated__/CreateCommentMutation.graphql';
import { useMutation, usePaginationFragment } from 'react-relay/lib/relay-experimental';
import { CommentsFeedPaginationQuery } from './__generated__/CommentsFeedPaginationQuery.graphql';
import {Post_post} from "./__generated__/Post_post.graphql";

const Comment = styled.div`
  margin-top: 12px;
  background-color: #e5e5e5;
  color: #7b7d82;
  border-radius: 10px;
  padding: 8px 12px;
  width: fit-content;
  
`
const Footer = styled.div`
  margin-top: 12px;
  padding: 8px 12px;
  width: 100%;  
  color: #666;
`
type Props = {
  postQuery: Post_post
}
const CommentsFeed:React.FC<Props> = ({postQuery}:Props) => {
  const [commitCreateComment] = useMutation(CreateComment);
  const [commentText, setCommentText] = useState('')
  const {data, loadNext, isLoadingNext, hasNext} = usePaginationFragment<CommentsFeedPaginationQuery>(
    graphql`
      fragment CommentsFeed_query on PostType
      @argumentDefinitions(first: {type: Int, defaultValue: 5}, after: { type: String })
      @refetchable(queryName: "CommentsFeedPaginationQuery")
      {
        comments(first: $first, after: $after)
        @connection(key: "Post_comments", filters: [])
        {
          pageInfo {
            startCursor
            endCursor
          }
          edges {
            node {
              id
              text
              createdAt
            }
          }
        }
      }
    `, postQuery
  )



  const loadMore = useCallback(() => {
    // Don't fetch again if we're already loading the next page
    if (isLoadingNext) {
      return;
    }
    loadNext(5);
  }, [isLoadingNext, loadNext]);


  const handleSubmitComment = (event: React.SyntheticEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    const configs: UseMutationConfig<CreateCommentMutation> = {
      variables: {
        id: postQuery.id,
        text: commentText,
      },
      updater:(store) => {
        const payload = store.getRootField('CreateComment');
        const newEdge = payload.getLinkedRecord('commentEdge');

        const root = store.get(postQuery.id);
        if(!root) return;
        const conn = ConnectionHandler.getConnection(
          root,
          'Post_comments'
        );
        if(conn) {
          ConnectionHandler.insertEdgeBefore(conn, newEdge);
        }
      },
    }

    commitCreateComment(configs)
    setCommentText('');
  }

  const commentsNodes = data.comments?.edges || []


  return (
    <>
      <StyledTextarea 
      placeholder="Write your comment here" 
      onKeyPress={e => {
        if(e.key === "Enter") {
          handleSubmitComment(e)
        }
      }}
      value={commentText}
      onChange={(e) => setCommentText(e?.target.value)}
      />

      {commentsNodes.map((comment:any) =>(
        <Comment key={comment.id}>
          {comment.node.text}
        </Comment>
      ))}

      {hasNext && (
      <Footer>
        <button onClick={loadMore}>
          Load more comments
        </button>
      </Footer>
      )}
    </>
  )
}
export default CommentsFeed;