import React, {Suspense,  useCallback} from 'react';
import styled, {keyframes} from 'styled-components';
import InfiniteScroll from 'react-infinite-scroller';
import graphql from 'babel-plugin-relay/macro';
import PostForm from './PostForm';
import Post from './Post'

import Loading from './Loading'

import { usePaginationFragment } from 'react-relay/hooks';

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

const Wrapper= styled.div`
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
const MIN_POSTS = 5
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
  useEffect(() => {
    console.log(edges.length, "HasNext", hasNext)
    if(edges.length < MIN_POSTS - 1 ) {
      refetch({
        first: MIN_POSTS
      })
    }
    
  }, [edges, loadMore, hasNext, refetch])


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
      return (
      <Card key={`${node.id}${index}`}>
        <Post post={node} />
      </Card>
      )}
    )}
    </InfiniteScroll>
    </Suspense>
  
  </Wrapper>
}

export default Feed;