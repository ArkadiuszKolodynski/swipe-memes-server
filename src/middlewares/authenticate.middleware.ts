import { FastifyMiddleware, FastifyReply, FastifyRequest } from "fastify";
import { ServerResponse } from "http";

const authenticate: FastifyMiddleware = async (req: FastifyRequest, _res: FastifyReply<ServerResponse>) => {
  await req.jwtVerify();
};

export default authenticate;
