import { IncomingMessage } from "http";
import { IUser } from "../../models/user";

declare module "fastify" {
  // export interface FastifyRequest<
  //   HttpRequest = IncomingMessage,
  //   Query = DefaultQuery,
  //   Params = DefaultParams,
  //   Headers = DefaultHeaders,
  //   Body = DefaultBody
  // > {
  //   user: IUser;
  // }
}
