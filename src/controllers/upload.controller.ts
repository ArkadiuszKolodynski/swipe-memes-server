import { FastifyReply, FastifyRequest } from "fastify";
import { Controller, Inject, POST } from "fastify-decorators";
import { IncomingMessage, ServerResponse } from "http";
import authenticate from "../middlewares/authenticate.middleware";
import UploadService from "../services/upload.service";

@Controller({ route: "/upload" })
export default class UploadController {
  @Inject(UploadService)
  private uploadService: UploadService;

  @POST({ options: { preValidation: authenticate }, url: "/" })
  private async upload(req: FastifyRequest<IncomingMessage>, res: FastifyReply<ServerResponse>): Promise<void> {
    const filename: string = this.uploadService.storeFile(req.body);
    res.send(filename);
  }
}
