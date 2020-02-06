import * as bcrypt from "bcrypt";
import { Document, HookNextFunction, model, Model, Schema } from "mongoose";
// tslint:disable-next-line: no-var-requires
import mongoosePaginate = require("mongoose-paginate-v2");

export interface IUser extends Document {
  email: string;
  login: string;
  password: string;
  isPrivileged: boolean;
  verifyPassword(candidatePassword: string): Promise<boolean>;
}

interface IUserModel extends Model<IUser> {
  paginate(query?: any, options?: any, callback?: any): any;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  isPrivileged: { type: Boolean, default: false },
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

UserSchema.pre<IUser>("save", async function(next: HookNextFunction) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// tslint:disable-next-line: only-arrow-functions
UserSchema.methods.verifyPassword = async function(candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.plugin(mongoosePaginate);

const User: IUserModel = model<IUser, IUserModel>("User", UserSchema);
export default User;
