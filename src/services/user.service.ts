import { FastifyInstance } from "fastify";
import { FastifyInstanceToken, Inject, Service } from "fastify-decorators";
import User, { IUser } from "../models/user";

@Service()
export default class UserService {
  @Inject(FastifyInstanceToken)
  private fastify: FastifyInstance;

  public async createUser(userCandidate: IUser): Promise<void> {
    const user: IUser = new User(userCandidate);
    await user.save();
  }

  public async getUserById(id: string): Promise<IUser> {
    const user: IUser = await User.findById(id)
      .select("email login isPrivileged")
      .orFail(this.fastify.httpErrors.notFound());
    return user;
  }

  public async getUsersPerPage(page: number): Promise<IUser[]> {
    return await User.paginate({}, { page, select: "email login isPrivileged", sort: { login: "asc" } });
  }

  public async editUserById(id: string, userCandidate: IUser): Promise<void> {
    const user: IUser = await User.findById(id).orFail(this.fastify.httpErrors.notFound());
    user.email = userCandidate.email || user.email;
    user.login = userCandidate.login || user.login;
    user.password = userCandidate.password || user.password;
    if (userCandidate.isPrivileged !== undefined) {
      user.isPrivileged = userCandidate.isPrivileged;
    }
    await user.save();
  }

  public async deleteUserById(id: string): Promise<void> {
    await User.findByIdAndDelete(id).orFail(this.fastify.httpErrors.notFound());
  }
}
