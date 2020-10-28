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
import { Post_post$key } from "./__generated__/Post_post.graphql";
import Loading from './Loading';


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
  postQuery: Post_post$key
  postId: string
}
const CommentsFeed:React.FC<Props> = ({ postQuery, postId}:Props) => {
  const [commitCreateComment] = useMutation(CreateComment);
  const [commentText, setCommentText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const {data, loadNext, isLoadingNext, hasNext} = usePaginationFragment<CommentsFeedPaginationQuery, Post_post$key>(
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


  const handleSubmitComment = async (event: React.SyntheticEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const configs: UseMutationConfig<CreateCommentMutation> = {
      variables: {
        id: postId,
        text: commentText,
      },
      updater:(store) => {
        const payload = store.getRootField('CreateComment');
        const newEdge = payload.getLinkedRecord('commentEdge');

        const root = store.get(postId);
        if(!root) return;
        const conn = ConnectionHandler.getConnection(
          root,
          'Post_comments'
        );
        if(conn) {
          ConnectionHandler.insertEdgeBefore(conn, newEdge);
        }
        
      },
      optimisticResponse: {
        CreateComment: {
          commentEdge: {
            cursor: "",
            node: {
              id: "tempId",
              text: commentText,
              createdAt: new Date()
            }
          }
        }
      },
    }

    await commitCreateComment(configs)
    setIsLoading(false);
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

      {isLoading && <Loading style={{marginTop: 10}} />}

      <div>
        {commentsNodes.map((comment:any) =>(
          <Comment key={comment.id}>
            {comment.node.text}
          </Comment>
        ))}
      </div>
      
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