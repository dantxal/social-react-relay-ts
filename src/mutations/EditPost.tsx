import graphql from 'babel-plugin-relay/macro';

export const EditPost= graphql`
  mutation EditPostMutation($id: ID!, $title: String!, $text: String!) {
    UpdatePost(input: { 
      postId: $id,
      title: $title, 
      text: $text, 
      # clientMutationId: $title
    }) {
      post {
        id
        text
        title
        createdAt
      }
    }
  }
`;
