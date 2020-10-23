import graphql from 'babel-plugin-relay/macro';
import { UseMutationConfig } from 'react-relay/lib/relay-experimental/useMutation';
import { ConnectionHandler } from 'relay-runtime';
import { DeletePostMutation } from './__generated__/DeletePostMutation.graphql';


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

export type DeletePostConfigs = (postID:string) => UseMutationConfig<DeletePostMutation>

export const deletePostConfigs = 
(postID: string) => ({
  variables: { id: postID },
  updater: (store, data) => {
    const postId = data.DeletePost?.payload?.id;
    if(!postId) return;

    const root = store.getRoot();
    const conn = ConnectionHandler.getConnection(
      root,
      'Feed_posts'
    );
    if(conn) {
      ConnectionHandler.deleteNode(conn, postId);
    }
  }
}) as UseMutationConfig<DeletePostMutation>