import { FastifyReply, FastifyRequest } from "fastify";
import { Controller, Inject, POST } from "fastify-decorators";
import { IncomingMessage, ServerResponse } from "http";
import AuthService from "../services/auth.service";

@Controller({ route: "/auth" })
export default class AuthController {
  @Inject(AuthService)
  private authService: AuthService;

  @POST({ url: "/" })
  private async auth(req: FastifyRequest<IncomingMessage>, res: FastifyReply<ServerResponse>): Promise<void> {
    const token: string = await this.authService.generateToken(req.body.login, req.body.password);
    res.send({ jwt: token });
  }
}
