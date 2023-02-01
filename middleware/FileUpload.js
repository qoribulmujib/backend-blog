import multer from "multer";
import * as fs from "fs-extra";

export const uploadFilesImage = (imageFile) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      let path = `uploads`;
      fs.mkdirsSync(path);
      cb(null, path);
    },
    filename: function (req, file, cb) {
      cb(null, new Date().getTime() + "-" + file.originalname);
    },
  });
  const fileFillter = function (req, file, cb) {
    if (file.fieldname === imageFile) {
      if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = {
          message: "Only image files are allowed",
        };
        return cb(new Error("Only image files are allowed"), false);
      }
    }
    cb(null, true);
  };
  const maxSize = 10 * 1000 * 1000; // max size 10MB

  const upload = multer({
    storage,
    fileFillter,
    limits: {
      fileSize: maxSize,
    },
  }).single(imageFile);

  return (req, res, next) => {
    upload(req, res, function (err) {
      if (req.fileValidationError)
        return res.status(400).send(req.fileValidationError);

      if (!req.file && !err)
        return res.status(400).send({
          message: "Please select files to upload",
        });

      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).send({
            message: "Max file size 10MB",
          });
        }
        return res.status(400).send(err);
      }

      return next();
    });
  };
};
