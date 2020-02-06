import { FastifyReply, FastifyRequest, FastifyInstance } from "fastify";
import { Controller, DELETE, FastifyInstanceToken, GET, Inject, POST, PUT } from "fastify-decorators";
import { IncomingMessage, ServerResponse } from "http";
import authenticate from "../middlewares/authenticate.middleware";
import authorize from "../middlewares/authorize.middleware";
import { ITag } from "../models/tag";
import TagService from "../services/tag.service";

@Controller({ route: "/tag" })
export default class TagController {
  @Inject(FastifyInstanceToken)
  private fastify: FastifyInstance;

  @Inject(TagService)
  private tagService: TagService;

  @POST({ url: "/" })
  private async create(req: FastifyRequest<IncomingMessage>, res: FastifyReply<ServerResponse>): Promise<void> {
    await this.tagService.createTag(req.body as ITag);
    res.code(201).send();
  }

  @GET({ url: "/:slug" })
  private async read(req: FastifyRequest<IncomingMessage>, res: FastifyReply<ServerResponse>): Promise<void> {
    const tag: ITag = await this.tagService.getTagBySlug(req.params.slug as string);
    res.send(tag);
  }

  @GET({
    options: {
      preValidation: [authenticate, authorize]
    },
    url: "/page/:page"
  })
  private async readList(req: FastifyRequest<IncomingMessage>, res: FastifyReply<ServerResponse>): Promise<void> {
    this.fastify.assert(!Number.isNaN(parseInt(req.params.page, 10)), 400, "Wrong page number!");
    const tags: ITag[] = await this.tagService.getTagsPerPage(req.params.page as number);
    res.send(tags);
  }

  @PUT({ url: "/:slug" })
  private async update(req: FastifyRequest<IncomingMessage>, res: FastifyReply<ServerResponse>): Promise<void> {
    this.tagService.editTagBySlug(req.params.slug as string, req.body as ITag);
    res.code(204).send();
  }

  @DELETE({ url: "/:slug" })
  private async delete(req: FastifyRequest<IncomingMessage>, res: FastifyReply<ServerResponse>): Promise<void> {
    this.tagService.deleteTagBySlug(req.params.slug as string);
    res.code(204).send();
  }
}
