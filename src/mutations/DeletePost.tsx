import graphql from 'babel-plugin-relay/macro';

export const DeletePost = graphql`
  mutation DeletePostMutation($id: String!) {
    DeletePost(input: { postId: $id, clientMutationId: "2"}) {
      payload {
        id
        text
        title
      }
    }
  }
`;
