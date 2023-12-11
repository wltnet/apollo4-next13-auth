import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";

export const { getClient } = registerApolloClient(() => {
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const port = process.env.NODE_ENV === 'development' ? ':3000' : '';
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      // this needs to be an absolute url, as relative urls cannot be used in SSR
      uri: `${protocol}://${process.env.NEXT_PUBLIC_URI}${port}/graphql`,
      // you can disable result caching here if you want to
      // (this does not work if you are rendering your page with `export const dynamic = "force-static"`)
      // fetchOptions: { cache: "no-store" },
    }),
    connectToDevTools: process.env.NODE_ENV === 'development',
    credentials: "same-origin"
  });
});

// You can then use that getClient function in your server components:
// const { data } = await getClient().query({ query: userQuery });