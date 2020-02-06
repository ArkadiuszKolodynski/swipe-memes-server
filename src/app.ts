import * as Fastify from "fastify";
import * as cors from "fastify-cors";
import { bootstrap } from "fastify-decorators";
import * as helmet from "fastify-helmet";
import * as jwt from "fastify-jwt";
import * as sensible from "fastify-sensible";
import * as fastifyStatic from "fastify-static";
import * as swagger from "fastify-swagger";
import * as mongoose from "mongoose";
import * as path from "path";
import { assetsPath, dbConnectionString, jwtSecret, port, swaggerOptions } from "./config";

// TODO: better error handling in controllers

const fastify: Fastify.FastifyInstance = Fastify({ logger: true });

fastify.register(helmet);
fastify.register(swagger, swaggerOptions);
fastify.register(bootstrap, {
  directory: path.join(__dirname, "controllers"),
  mask: /\.controller\./,
  prefix: "/api/v1"
});
fastify.register(jwt, { secret: jwtSecret });
fastify.register(sensible, { errorHandler: true });

// TODO: ======= dev only =======
fastify.register(cors, {
  origin: ["http://localhost:3001", "http://localhost:8080"]
});
fastify.register(fastifyStatic, {
  prefix: assetsPath,
  root: path.resolve(__dirname, "../assets")
});
// TODO: ======= dev only =======

// fastify.decorateRequest("user", null);

mongoose.connection.on("connected", () => {
  fastify.log.info({ actor: "MongoDB" }, "connected");
});

mongoose.connection.on("error", err => {
  fastify.log.error({ actor: "MongoDB" }, err);
});

mongoose.connection.on("disconnected", () => {
  fastify.log.error({ actor: "MongoDB" }, "disconnected");
});

const start: () => Promise<void> = async () => {
  try {
    await mongoose.connect(dbConnectionString, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // fastify
    //       .decorate('mongo', mongoose.connection)
    //       .addHook('onClose', (fastify, done) => {
    //         fastify.mongo.db.close(done)
    //       })

    await fastify.ready();
    await fastify.listen(port);
    fastify.swagger();
  } catch (ex) {
    fastify.log.error(ex);
    process.exit(1);
  }
};

start();
