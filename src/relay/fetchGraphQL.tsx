import { RequestParameters } from 'relay-runtime/lib/util/RelayConcreteNode';
import { Variables } from 'relay-runtime/lib/util/RelayRuntimeTypes';

export function getToken(): string {
  const currentToken = localStorage.getItem('authToken');
  return currentToken ? currentToken : '';
}

const GRAPHQL_URL= process.env.REACT_APP_GRAPHQL_URL

async function fetchGraphQL(request: RequestParameters, variables: Variables) {
    const loggedUser = Promise.resolve().then(() => getToken());
  
    // Fetch data from GitHub's GraphQL API:
    const response = await fetch( GRAPHQL_URL as string, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
        Authorization: await loggedUser
      },
      body: JSON.stringify({
        query: request.text,
        variables,
      }),
    });
  
    // Get the response as JSON
    return await response.json();
  }


  
export { fetchGraphQL};
