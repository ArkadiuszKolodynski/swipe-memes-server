import { Document, model, Model, Schema } from "mongoose";
// tslint:disable-next-line: no-var-requires
import mongoosePaginate = require("mongoose-paginate-v2");
import { ITag } from "../models/tag";
import { IUser } from "../models/user";

export interface IMeme extends Document {
  author: IUser["_id"];
  createdAt: number;
  imageSrc: string;
  likes: Map<IUser["_id"], boolean>;
  publishedAt: number;
  status: string;
  tags: [ITag["_id"]];
  title: string;
}

interface IMemeModel extends Model<IMeme> {
  paginate(query?: any, options?: any, callback?: any): any;
}

const MemeSchema: Schema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, required: true },
  imageSrc: { type: String, required: true },
  likes: {
    default: new Map<string, boolean>(),
    of: Boolean,
    type: Map
  },
  publishedAt: { type: Date, default: null },
  status: {
    default: "WAITING",
    enum: ["APPROVED", "REJECTED", "WAITING"],
    type: String
  },
  tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
  title: { type: String, required: true }
});

MemeSchema.plugin(mongoosePaginate);

const Meme: IMemeModel = model<IMeme, IMemeModel>("Meme", MemeSchema);
export default Meme;
