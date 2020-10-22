import graphql from 'babel-plugin-relay/macro';

import { UseMutationConfig } from 'react-relay/lib/relay-experimental/useMutation';
import { CreatePostMutation, CreatePostMutationResponse} from './mutations/__generated__/CreatePostMutation.graphql'
import { ConnectionHandler } from 'relay-runtime';

export const CreatePost = graphql`
  mutation CreatePostMutation($title: String!, $text: String!) {
    CreatePost(input: { title: $title, text: $text, clientMutationId: "1"}) {
      post {
        id
        text
        title
        createdAt
      }
    }
  }
`;

// export type CreatePostConfigs = (title:string, text: string) => UseMutationConfig<CreatePostMutation>

// export const createPostConfigs: CreatePostConfigs = 
// (title, text,) => (
//   {
//     variables: { title, text },
//     optimisticUpdater: (store, data) => {
//       const createField = store.getRootField('CreatePost')
//       const postProxy = createField.getValue('')
//     },
//     updater:(store, data) => {
      
//     },
//     onCompleted: (response) => console.log('postCreated', response)
//   } as UseMutationConfig<CreatePostMutation>
// )