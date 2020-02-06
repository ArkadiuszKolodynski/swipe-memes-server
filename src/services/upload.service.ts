import { Service } from "fastify-decorators";
import * as fs from "fs";
import * as path from "path";
import * as temp from "temp";
import { assetsPath } from "../config";

@Service()
export default class UploadService {
  public storeFile(item: any): string {
    const openedFile: temp.OpenFile = temp.openSync({
      prefix: item.nameWithoutExtension + "_",
      suffix: "." + item.extension
    });
    fs.writeSync(openedFile.fd, Buffer.from(item.data, "base64"));
    const filename: string = assetsPath + openedFile.path.split(path.sep).pop();
    return filename;
  }
}
