import { FastifyInstance } from "fastify";
import { FastifyInstanceToken, Inject, Service } from "fastify-decorators";
import * as fs from "fs";
import * as path from "path";
import * as temp from "temp";
import Meme, { IMeme } from "../models/meme";
import Tag, { ITag } from "../models/tag";
import { IUser } from "../models/user";

@Service()
export default class MemeService {
  @Inject(FastifyInstanceToken)
  private fastify: FastifyInstance;

  public async createMeme(memeCandidate: IMeme): Promise<void> {
    const filename: string = memeCandidate.imageSrc.split("/").pop();
    const filepath: string = temp.dir + path.sep + filename;
    if (fs.existsSync(filepath)) {
      fs.renameSync(filepath, path.resolve(__dirname, "../../assets") + path.sep + filename);
      memeCandidate.createdAt = Date.now();
      const meme: IMeme = new Meme(memeCandidate);
      await meme.save();
    } else {
      this.fastify.httpErrors.internalServerError();
    }
  }

  public async getMemeById(id: string): Promise<IMeme> {
    const meme: IMeme = await Meme.findById(
      id,
      {},
      { populate: { path: "author tags", select: "email login tag slug" } }
    ).orFail(this.fastify.httpErrors.notFound());
    return meme;
  }

  public async getMemesPerPage(page: number, status: string, tag: string): Promise<IMeme[]> {
    const t: ITag = await Tag.findOne({ slug: tag });
    if (t) {
      console.log(t._id);
      return await Meme.paginate(
        { status: status || /\*/, tags: { $elemMatch: { $eq: t._id } } },
        {
          page,
          populate: { path: "author tags", select: "email login tag slug" },
          sort: { createdAt: "desc" }
        }
      );
    }
    return await Meme.paginate(
      { status: status || /\*/ },
      {
        page,
        populate: { path: "author tags", select: "email login tag slug" },
        sort: { createdAt: "desc" }
      }
    );
  }

  public async editMemeById(id: string, memeCandidate: IMeme): Promise<void> {
    const meme: IMeme = await Meme.findById(id).orFail(this.fastify.httpErrors.notFound());
    meme.author = memeCandidate.author || meme.author;
    meme.imageSrc = memeCandidate.imageSrc || meme.imageSrc;
    meme.status = memeCandidate.status || meme.status;
    meme.tags = memeCandidate.tags || meme.tags;
    meme.title = memeCandidate.title || meme.title;
    await meme.save();
  }

  public async deleteMemeById(id: string): Promise<void> {
    await Meme.findByIdAndDelete(id).orFail(this.fastify.httpErrors.notFound());
  }

  public async publishMemeById(id: string): Promise<void> {
    const meme: IMeme = await Meme.findById(id).orFail(this.fastify.httpErrors.notFound());
    meme.publishedAt = Date.now();
    meme.status = "APPROVED";
    await meme.save();
  }

  public async unpublishMemeById(id: string): Promise<void> {
    const meme: IMeme = await Meme.findById(id).orFail(this.fastify.httpErrors.notFound());
    meme.publishedAt = null;
    meme.status = "REJECTED";
    await meme.save();
  }

  public async likeMemeById(id: string, user: IUser): Promise<void> {
    const meme: IMeme = await Meme.findById(id).orFail(this.fastify.httpErrors.notFound());
    meme.likes.set(user._id, true);
    await meme.save();
  }

  public async unlikeMemeById(id: string, user: IUser): Promise<void> {
    const meme: IMeme = await Meme.findById(id).orFail(this.fastify.httpErrors.notFound());
    meme.likes.set(user._id, false);
    await meme.save();
  }
}
