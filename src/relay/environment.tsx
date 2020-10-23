import { Environment, Network, RecordSource, Store } from 'relay-runtime';
import { RelayDefaultHandlerProvider } from 'relay-runtime/lib/handlers/RelayDefaultHandlerProvider';
import { fetchGraphQL } from './fetchGraphQL';

declare global {
    interface Window {
        relayEnvironment:Environment
        debugRelayStore: any
    }
};

const network = Network.create(fetchGraphQL);

const env = new Environment({
    network,
    store: new Store(new RecordSource()),
    handlerProvider: RelayDefaultHandlerProvider,
    // log: isDev ? relayTransactionLogger : null,
});

// TODO make this be only in development
window.relayEnvironment = env;
window.debugRelayStore = () => env.getStore().getSource().toJSON()


export default env as any;