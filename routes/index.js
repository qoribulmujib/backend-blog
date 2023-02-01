import express from "express";
import {
  getPosts,
  getPostById,
  deletePost,
  savePost,
  updatePost,
} from "../controller/PostController.js";
import { refreshToken } from "../controller/RefreshToken.js";

import { getUsers, Login, Logout, Register } from "../controller/Users.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { uploadFilesImage } from "../middleware/FileUpload.js";

const router = express.Router();
//!AUTH
router.get("/users", verifyToken, getUsers);
router.post("/users", Register);
router.post("/login", Login);
router.get("/token", refreshToken);
router.delete("/logout", Logout);

//?BLOG
router.get("/posts", getPosts);
router.get("/posts/:slug", getPostById);
router.post("/posts", uploadFilesImage("image"), savePost);
router.patch("/posts/:slug", uploadFilesImage("image"), updatePost);
router.delete("/posts/:slug", deletePost);

export default router;
