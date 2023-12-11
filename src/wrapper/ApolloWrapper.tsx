"use client";
// ^ this file needs the "use client" pragma
import { gql, ApolloLink, HttpLink, FetchResult } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { Observable } from '@apollo/client/utilities';
import {
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
  NextSSRApolloClient,
  SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support/ssr";
import { GraphQLError } from 'graphql';

interface AccessToken {
  accessToken: string;
}

const REFRESH_TOKEN = gql`
  mutation refreshToken {
    refreshToken {
      accessToken
    }
  }
`;

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  const accessToken = sessionStorage?.getItem('accessToken');
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${accessToken}` : null,
    }
  }));

  return forward(operation);
});

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        switch (err.extensions.code) {
          case 'UNAUTHENTICATED':
            // ignore 401 error for a refresh request
            if (operation.operationName === 'refreshToken') return;

            const observable = new Observable<FetchResult<Record<string, any>>>(
              (observer) => {
                // used an annonymous function for using an async function
                (async () => {
                  try {
                    const accessToken = await refreshToken();

                    if (!accessToken) {
                      throw new GraphQLError('Empty AccessToken');
                    }

                    // Retry the failed request
                    const subscriber = {
                      next: observer.next.bind(observer),
                      error: observer.error.bind(observer),
                      complete: observer.complete.bind(observer),
                    };

                    forward(operation).subscribe(subscriber);
                  } catch (err) {
                    observer.error(err);
                  }
                })();
              }
            );

            return observable;
        }
      }
    }
  
    if (networkError) console.log(`[Network error]: ${networkError}`);
  }
);

  // Request a refresh token to then stores and returns the accessToken.
const refreshToken = async () => {
  try {
    const refreshResolverResponse = await makeClient().mutate<{
      refreshToken: AccessToken;
    }>({
      mutation: REFRESH_TOKEN,
    });

    const accessToken = refreshResolverResponse.data?.refreshToken.accessToken;
    sessionStorage.setItem('accessToken', accessToken || '');
    return accessToken;
  } catch (err) {
    sessionStorage.clear();
    await makeClient().clearStore();
    window.location.assign('/');
  }
};

 // have a function to create a client for you
 function makeClient() {
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const port = process.env.NODE_ENV === 'development' ? ':3000' : '';
  const httpLink = new HttpLink({
    // this needs to be an absolute url, as relative urls cannot be used in SSR
    uri: `${protocol}://${process.env.NEXT_PUBLIC_URI}${port}/graphql`,
    // you can disable result caching here if you want to
    // (this does not work if you are rendering your page with `export const dynamic = "force-static"`)
    fetchOptions: { cache: "no-store" },
    // you can override the default `fetchOptions` on a per query basis
    // via the `context` property on the options passed as a second argument
    // to an Apollo Client data fetching hook, e.g.:
    // const { data } = useSuspenseQuery(MY_QUERY, { context: { fetchOptions: { cache: "force-cache" }}});
  });

  return new NextSSRApolloClient({
    // use the `NextSSRInMemoryCache`, not the normal `InMemoryCache`
    cache: new NextSSRInMemoryCache(),
    link:
      typeof window === "undefined"
        ? ApolloLink.from([
            // in a SSR environment, if you use multipart features like
            // @defer, you need to decide how to handle these.
            // This strips all interfaces with a `@defer` directive from your queries.
            new SSRMultipartLink({
              stripDefer: true,
            }),
            ApolloLink.from([errorLink, authMiddleware, httpLink]),
            // concat(authMiddleware, httpLink),
          ])
        : ApolloLink.from([errorLink, authMiddleware, httpLink]),
        // : concat(authMiddleware, httpLink),
    credentials: "same-origin",
    connectToDevTools: process.env.NODE_ENV === 'development',
  });
 }

// you need to create a component to wrap your app in
export function ApolloWrapper({ children }: React.PropsWithChildren) {
  // const forceUpdate = useForceUpdate();

  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
