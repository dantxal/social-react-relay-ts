import graphql from 'babel-plugin-relay/macro';

export const CreatePost = graphql`
  mutation CreatePostMutation($title: String!, $text: String!) {
    CreatePost(input: { 
      title: $title, 
      text: $text, 
      # clientMutationId: $title
    }) {
      postEdge {
        cursor
        node {
          id
          text
          title
          createdAt
        }
      }
    }
  }
`;
