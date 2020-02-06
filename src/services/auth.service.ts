import { FastifyInstance } from "fastify";
import { FastifyInstanceToken, Inject, Service } from "fastify-decorators";
import User, { IUser } from "../models/user";

@Service()
export default class AuthService {
  @Inject(FastifyInstanceToken)
  private fastify: FastifyInstance;

  public async generateToken(login: string, password: string): Promise<string> {
    const user: IUser = await User.findOne({
      $or: [{ email: login }, { login }]
    });

    if (user === null) {
      throw this.fastify.httpErrors.unauthorized("User does not exist!");
    }

    if (await user.verifyPassword(password)) {
      return this.fastify.jwt.sign({
        _id: user._id,
        email: user.email,
        isPrivileged: user.isPrivileged,
        login: user.login
      } as IUser);
    } else {
      throw this.fastify.httpErrors.unauthorized("Wrong password!");
    }
  }
}
