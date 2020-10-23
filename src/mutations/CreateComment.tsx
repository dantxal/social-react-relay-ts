import graphql from 'babel-plugin-relay/macro';

export const CreateComment = graphql`
  mutation CreateCommentMutation($id: String!, $text: String!) {
    CreateComment(input: { 
      postId: $id,
      text: $text, 
    }) {
      commentEdge {
        cursor
        node {
          id
          text
          createdAt
        }
      }
    }
  }
`;
