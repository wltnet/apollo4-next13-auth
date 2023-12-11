// npm install apollo-server-express apollo-server-core express graphql
import next from 'next';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import schema from './graphql/schema/index.js';
// import resolvers from './graphql/resolvers/index.js';
// import { User } from './types/users.js';

interface MyContext {
  user: { 
    id: string;
    username: string;
    role: string;
  },
  refreshToken: string;
  res: any;
}

const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production'; // true false
const MONGODB = process.env.MONGODB;
const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;
const URI = process.env.NEXT_PUBLIC_URI;
const PROTOCOL = dev ? 'http' : 'https';

if (!MONGODB || !SECRET_KEY || !REFRESH_SECRET_KEY) {
  throw new Error("Some env data are missing!");
}

const nextApp = next({ dev });
const handle = nextApp.getRequestHandler(); // part of next config

mongoose.connect(MONGODB)
  .then(() => {
    console.log("DB connected");

    nextApp.prepare().then(async() => {
      const app = express();
      const httpServer = http.createServer(app);
      const server = new ApolloServer<MyContext>({
        schema,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
      });
      await server.start();
      app.use(
        '/graphql',
        cors<cors.CorsRequest>(),
        bodyParser.json(),
        cookieParser(),
        expressMiddleware(server, {
          context: async ({ req, res }) => {
            const accessToken = req.headers.authorization ? req.headers.authorization.replace(/^Bearer\s+/, "") : '';
            const refreshToken = req?.cookies?.refreshToken || "";

            if (accessToken) {
                const user: any = jwt.verify(accessToken, SECRET_KEY, (err, decoded) => {
                  if (err) {
                    return { id: '', username: '', role: '' };
                  }
                  return decoded;
                });
                const { id, username, role } = user;
                return { user: {id, username, role}, refreshToken, res };
            }
            return { user: { id: '', username: '', role: ''} , refreshToken, res };
          },
        }),
      );
      app.get('*', (req, res) => {
        handle(req, res);
      }); // for all the react stuff

      await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));
      console.log(`🚀 Server ready at ${PROTOCOL}://${URI}:${PORT}/graphql`);
    });
  });