import React, {Suspense, useState, useEffect, useCallback} from 'react';
import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroller';
import graphql from 'babel-plugin-relay/macro';
import PostForm from './PostForm';
import Post from './Post'

import Loading from './Loading'

import { usePaginationFragment } from 'react-relay/hooks';

import { FeedPaginationQuery } from './__generated__/FeedPaginationQuery.graphql';
import { Feed_query$key } from './__generated__/Feed_query.graphql';

const Wrapper= styled.div`
  width: 600px;
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
  border-radius: 10px;
`

type Props = {
  query: any
};

const Feed: React.FC<Props> = ({query}: Props) => {
  const {data, loadNext, isLoadingNext, hasNext, refetch} = usePaginationFragment<FeedPaginationQuery, Feed_query$key>(
    graphql`
      fragment Feed_query on RootQueryType 
      @argumentDefinitions(first: {type: Int, defaultValue: 2}, after: { type: String })
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
            }
          }
        }
      }
    `, query
  )

  

  const loadMore = useCallback(() => {
    // Don't fetch again if we're already loading the next page
    if (isLoadingNext) {
      return;
    }
    loadNext(2);
  }, [isLoadingNext, loadNext]);

  const edges = data.posts.edges|| []

  return <Wrapper>
    <Card>
      <PostForm refetchPosts={refetch} />
    </Card>
    <Suspense fallback={<div>Loading...</div>}>
    <InfiniteScroll
      style={{marginTop: 30}}
      loadMore={loadMore}
      hasMore={hasNext}
      loader={<Loading />}
    >
    {edges?.map(({node}:any, index) => {
      // if(!node) return <div></div>
      return (
      <Card key={`${node.id}${index}`}>
        <Post post={node}/>
      </Card>
      )}
    )}
    </InfiniteScroll>
    </Suspense>
  
  </Wrapper>
}

export default Feed;