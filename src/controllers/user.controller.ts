import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Controller, DELETE, FastifyInstanceToken, GET, Inject, POST, PUT } from "fastify-decorators";
import { IncomingMessage, ServerResponse } from "http";
import authenticate from "../middlewares/authenticate.middleware";
import authorize from "../middlewares/authorize.middleware";
import { IUser } from "../models/user";
import UserService from "../services/user.service";

@Controller({ route: "/user" })
export default class UserController {
  @Inject(FastifyInstanceToken)
  private fastify: FastifyInstance;

  @Inject(UserService)
  private userService: UserService;

  @POST({ url: "/" })
  private async create(req: FastifyRequest<IncomingMessage>, res: FastifyReply<ServerResponse>): Promise<void> {
    await this.userService.createUser(req.body as IUser);
    res.code(201).send();
  }

  @GET({ url: "/:id" })
  private async read(req: FastifyRequest<IncomingMessage>, res: FastifyReply<ServerResponse>): Promise<void> {
    console.log("\n", req.params, "\n");
    const user: IUser = await this.userService.getUserById(req.params.id as string);
    res.send(user);
  }

  @GET({
    options: { preValidation: [authenticate, authorize] },
    url: "/page/:page"
  })
  private async readList(req: FastifyRequest<IncomingMessage>, res: FastifyReply<ServerResponse>): Promise<void> {
    // TODO: beutify assert
    this.fastify.assert(!Number.isNaN(parseInt(req.params.page, 10)), 400, "Invalid page number!");
    const users: IUser[] = await this.userService.getUsersPerPage(req.params.page as number);
    res.send(users);
  }

  @PUT({
    options: { preValidation: [authenticate, authorize] },
    url: "/:id"
  })
  private async update(req: FastifyRequest<IncomingMessage>, res: FastifyReply<ServerResponse>): Promise<void> {
    await this.userService.editUserById(req.params.id as string, req.body as IUser);
    res.code(204).send();
  }

  @DELETE({
    options: { preValidation: [authenticate, authorize] },
    url: "/:id"
  })
  private async delete(req: FastifyRequest<IncomingMessage>, res: FastifyReply<ServerResponse>): Promise<void> {
    await this.userService.deleteUserById(req.params.id as string);
    res.code(204).send();
  }
}
