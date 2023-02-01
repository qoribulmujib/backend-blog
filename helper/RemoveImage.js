import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const RemoveLocalImage = (filePath) => {
  console.log("filePath", filePath);
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  filePath = path.join(__dirname, "../", filePath);
  fs.unlink(filePath, (err) => console.log("err", err));
};
