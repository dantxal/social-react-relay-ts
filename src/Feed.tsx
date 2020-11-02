import React, { useCallback } from 'react';
import styled, {css, keyframes} from 'styled-components';
import InfiniteScroll from 'react-infinite-scroller';
import graphql from 'babel-plugin-relay/macro';
import { usePaginationFragment } from 'react-relay/hooks';

import PostForm from './PostForm';
import Post from './Post'
import Loading from './Loading'

import { FeedPaginationQuery } from './__generated__/FeedPaginationQuery.graphql';
import { Feed_query$key } from './__generated__/Feed_query.graphql';

export const fadeDown = keyframes`
0% {
  opacity: 0; transform: translateY(-10px);
}
100% {
  opacity: 1; transform: translateY(0px);
}
`

const Wrapper = styled.div`
  width: 600px;
  margin-top: 25px;
  padding-bottom: 20px;
  height: 100%;

  > div:last-child {
    animation: ${fadeDown} 0.5s cubic-bezier(0.65, 0.05, 0.36, 1);
  }
`
const Card = styled.div`
  & + & {
    margin-top: 30px;
  }
  background-color: #fff;
  padding: 22px;
  border-radius: 3px;
`

type Props = {
  query: any
};
const Feed: React.FC<Props> = ({query}: Props) => {
  const {data, loadNext, isLoadingNext, hasNext, refetch} = usePaginationFragment<FeedPaginationQuery, Feed_query$key>(
    graphql`
      fragment Feed_query on RootQueryType 
      @argumentDefinitions(first: {type: Int, defaultValue: 5}, after: { type: String })
      @refetchable(queryName: "FeedPaginationQuery")
      {
        posts(first: $first, after: $after) 
        @connection(key: "Feed_posts", filters: [])
        {
          pageInfo {
            startCursor
            endCursor
          }
          edges {
            node {
              id
              ...Post_post
              ...CommentsFeed_query 
            }
          }
        }
      }
    `, query
  )
  const loadMore = useCallback(() => {
    console.log("Load more");
    
    // Don't fetch again if we're already loading the next page
    if (isLoadingNext) {
      return;
    }
    loadNext(5);
  }, [isLoadingNext, loadNext]);
  const edges = data?.posts?.edges || [];

  return (
    <Wrapper>
        <Card>
          <PostForm refetchPosts={refetch} />
        </Card>
          <InfiniteScroll
          style={{marginTop: 30}}
          loadMore={loadMore}
          hasMore={hasNext}
          loader={<Loading key="loading" />}
        >
        {edges?.map(({node}:any, index) => {
          return (
          <Card key={`${node.id}`}>
            <Post post={node} refetchPosts={refetch} postsLength={edges.length || 0}/>
          </Card>
          )}
        )}
        </InfiniteScroll>
    </Wrapper>
  );
}

export default Feed;