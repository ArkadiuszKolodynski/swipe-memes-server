import { FastifyReply, FastifyRequest } from "fastify";
import { Controller, DELETE, GET, Inject, POST, PUT } from "fastify-decorators";
import { IncomingMessage, ServerResponse } from "http";
import authenticate from "../middlewares/authenticate.middleware";
import authorize from "../middlewares/authorize.middleware";
import { IMeme } from "../models/meme";
import Tag from "../models/tag";
import { IUser } from "../models/user";
import MemeService from "../services/meme.service";

@Controller({ route: "/meme" })
export default class MemeController {
  @Inject(MemeService)
  private memeService: MemeService;

  @POST({ options: { preValidation: authenticate }, url: "/" })
  private async create(req: FastifyRequest<IncomingMessage>, res: FastifyReply<ServerResponse>): Promise<void> {
    req.body.author = (req.user as IUser)._id;
    req.body.tags = await Tag.getTagsRefs(req.body.tags);
    console.log("\n", req.body, "\n");
    await this.memeService.createMeme(req.body as IMeme);
    res.code(201).send();
  }

  @GET({ url: "/:id" })
  private async read(req: FastifyRequest<IncomingMessage>, res: FastifyReply<ServerResponse>): Promise<void> {
    const meme: IMeme = await this.memeService.getMemeById(req.params.id as string);
    res.send(meme);
  }

  @GET({ url: "/page/:page" })
  private async readList(req: FastifyRequest<IncomingMessage>, res: FastifyReply<ServerResponse>): Promise<void> {
    const memes: IMeme[] = await this.memeService.getMemesPerPage(
      req.params.page as number,
      req.query.status as string,
      req.query.tag as string
    );
    res.send(memes);
  }

  @PUT({ options: { preValidation: [authenticate, authorize] }, url: "/:id" })
  private async update(req: FastifyRequest<IncomingMessage>, res: FastifyReply<ServerResponse>): Promise<void> {
    this.memeService.editMemeById(req.params.id as string, req.body as IMeme);
    res.code(204).send();
  }

  @DELETE({ options: { preValidation: [authenticate, authorize] }, url: "/:id" })
  private async delete(req: FastifyRequest<IncomingMessage>, res: FastifyReply<ServerResponse>): Promise<void> {
    this.memeService.deleteMemeById(req.params.id as string);
    res.code(204).send();
  }

  @POST({ options: { preValidation: [authenticate, authorize] }, url: "/:id/publish" })
  private async publish(req: FastifyRequest<IncomingMessage>, res: FastifyReply<ServerResponse>): Promise<void> {
    this.memeService.publishMemeById(req.params.id as string);
    res.code(204).send();
  }

  @POST({ options: { preValidation: [authenticate, authorize] }, url: "/:id/unpublish" })
  private async unpublish(req: FastifyRequest<IncomingMessage>, res: FastifyReply<ServerResponse>): Promise<void> {
    this.memeService.unpublishMemeById(req.params.id as string);
    res.code(204).send();
  }

  @POST({ options: { preValidation: [authenticate, authorize] }, url: "/:id/like" })
  private async like(req: FastifyRequest<IncomingMessage>, res: FastifyReply<ServerResponse>): Promise<void> {
    this.memeService.likeMemeById(req.params.id as string, req.user as IUser);
    res.code(204).send();
  }

  @POST({ options: { preValidation: authenticate }, url: "/:id/dislike" })
  private async dislike(req: FastifyRequest<IncomingMessage>, res: FastifyReply<ServerResponse>): Promise<void> {
    this.memeService.unlikeMemeById(req.params.id as string, req.user as IUser);
    res.code(204).send();
  }
}
