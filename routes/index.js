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
router.post("/register", Register);
router.post("/login", Login);
router.get("/token", verifyToken, refreshToken);
router.delete("/logout", verifyToken, Logout);

//?BLOG
router.get("/posts", verifyToken, getPosts);
router.get("/posts/:slug", verifyToken, getPostById);
router.post("/posts", verifyToken, uploadFilesImage("image"), savePost);
router.patch(
  "/posts/:slug",
  verifyToken,
  uploadFilesImage("image"),
  updatePost
);
router.delete("/posts/:slug", verifyToken, deletePost);

export default router;
