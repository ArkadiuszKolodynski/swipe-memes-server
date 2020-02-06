import { Document, model, Model, Schema } from "mongoose";
// tslint:disable-next-line: no-var-requires
import mongoosePaginate = require("mongoose-paginate-v2");
import * as mongooseSlugPlugin from "mongoose-slug-plugin";
import slugify from "slugify";

export interface ITag extends Document {
  tag: string;
  slug: string;
}

interface ITagModel extends Model<ITag> {
  getTagsRefs(tags: string[]): Promise<string[]>;
  paginate(query?: any, options?: any, callback?: any): any;
}

const TagSchema: Schema = new Schema({
  tag: { type: String, required: true, unique: true }
});

TagSchema.plugin(mongoosePaginate);
TagSchema.plugin(mongooseSlugPlugin, { tmpl: "<%=tag%>", slug: slugify });
// tslint:disable-next-line: only-arrow-functions
TagSchema.statics.getTagsRefs = function(tags: string[]): Promise<string[]> {
  return Promise.all(tags.map(findOneOrCreate));
};

const findOneOrCreate = async (tag: string) => {
  const result: ITag = await Tag.findOne({ tag: tag.toLowerCase() });
  if (result) {
    return result._id as string;
  }
  return (await Tag.create({ tag: tag.toLowerCase() }))._id as string;
};

const Tag: ITagModel = model<ITag, ITagModel>("Tag", TagSchema);
export default Tag;
