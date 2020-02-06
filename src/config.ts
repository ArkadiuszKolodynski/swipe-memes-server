import { FastifyDynamicSwaggerOptions } from "fastify-swagger";

export const assetsPath: string = "/assets/";
export const dbConnectionString: string = "mongodb://127.0.0.1/swipe_memes";
export const jwtSecret: string = "supersecret";
export const port: number = 3000;
export const swaggerOptions: FastifyDynamicSwaggerOptions = {
  exposeRoute: true,
  swagger: {
    basePath: "/api/v1",
    consumes: ["application/json"],
    externalDocs: {
      description: "Find more info here",
      url: "https://swagger.io"
    },
    host: "localhost:3000",
    info: {
      description: "Building a blazing fast REST API with Node.js, MongoDB, Fastify and Swagger",
      title: "Fastify API",
      version: "1.0.0"
    },
    produces: ["application/json"],
    schemes: ["https", "http"]
  }
};
