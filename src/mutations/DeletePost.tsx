import graphql from 'babel-plugin-relay/macro';
import { UseMutationConfig } from 'react-relay/lib/relay-experimental/useMutation';
import { DeletePostMutation } from './mutations/__generated__/DeletePostMutation.graphql';


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

export const deletePostConfigs: DeletePostConfigs = 
(postID) => (
  {
    variables: { id: postID },
    optimisticUpdater: (store, data) => {
      const postId = data.DeletePost?.payload?.id;
      if(!postId) return
      store.delete(postId)
    },
    updater: (store, data) => {
      const postId = data.DeletePost?.payload?.id;
      if(!postId) return
      store.delete(postId)
    },
    onCompleted: (response) => console.log('postDeleted', response)
  }
) as UseMutationConfig<DeletePostMutation>