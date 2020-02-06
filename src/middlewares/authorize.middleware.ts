import { FastifyInstance, FastifyMiddleware, FastifyReply, FastifyRequest } from "fastify";
import { FastifyInstanceToken, getInstanceByToken } from "fastify-decorators";
import { ServerResponse } from "http";
import { IUser } from "models/user";

const authorize: FastifyMiddleware = async (req: FastifyRequest, _res: FastifyReply<ServerResponse>) => {
  const fastify: FastifyInstance = getInstanceByToken<FastifyInstance>(FastifyInstanceToken);
  if (!(req.user as IUser).isPrivileged) {
    throw fastify.httpErrors.forbidden();
  }
};

export default authorize;
