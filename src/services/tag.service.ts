import { FastifyInstance } from "fastify";
import { FastifyInstanceToken, Inject, Service } from "fastify-decorators";
import Tag, { ITag } from "../models/tag";

@Service()
export default class TagService {
  @Inject(FastifyInstanceToken)
  private fastify: FastifyInstance;

  public async createTag(tagCandidate: ITag): Promise<void> {
    const tag: ITag = new Tag(tagCandidate);
    await tag.save();
  }

  public async getTagBySlug(slug: string): Promise<ITag> {
    const tag: ITag = await Tag.findOne({ slug })
      .select("tag slug")
      .orFail(this.fastify.httpErrors.notFound());
    return tag;
  }

  public async getTagsPerPage(page: number): Promise<ITag[]> {
    return await Tag.paginate({}, { page, select: "tag slug", sort: { tag: "asc" } });
  }

  public async editTagBySlug(slug: string, tagCandidate: ITag): Promise<void> {
    const tag: ITag = await Tag.findOne({ slug }).orFail(this.fastify.httpErrors.notFound());
    tag.slug = tagCandidate.slug || tag.slug;
    tag.tag = tagCandidate.tag || tag.tag;
    await tag.save();
  }

  public async deleteTagBySlug(slug: string): Promise<void> {
    await Tag.findOneAndDelete({ slug }).orFail(this.fastify.httpErrors.notFound());
  }
}
