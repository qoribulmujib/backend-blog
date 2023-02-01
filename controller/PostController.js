import Posts from "../models/PostModel.js";
import Joi from "joi";
import slug from "slug";
import { addPost, editPost } from "../helper/CRUDPost.js";
import e from "express";
import { RemoveLocalImage } from "../helper/RemoveImage.js";

export const getPosts = async (req, res) => {
  try {
    const posts = await Posts.findAll();
    res
      .status(200)
      .json({ status: true, data: posts, message: "Successfully!" });
  } catch (error) {
    console.error(error);
  }
};

export const getPostById = async (req, res) => {
  const { slug } = req?.params;

  const post = await Posts.findOne({ where: { slug } });
  try {
    if (!post)
      return res
        .status(404)
        .json({ status: false, message: "Data not found!" });
    res
      .status(200)
      .json({ status: true, data: post, message: "Successfully!" });
  } catch (error) {
    console.error(error);
  }
};

export const savePost = async (req, res) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    image: Joi.any(),
    text: Joi.string().required(),
    slug: Joi.string(),
    url: Joi.string(),
    active: Joi.boolean(),
  });
  const { error } = schema.validate(req?.body);
  if (error) {
    return res.status(400).json({
      error: {
        message: error.details[0].message,
      },
    });
  }

  try {
    const tempSlug = slug(req?.body?.title, "-");
    const checkSlug = await Posts.findAll({ where: { slug: tempSlug } });
    if (checkSlug.length > 0) {
      let x = Math.floor(Math.random() * 100000 + 1);
      const newSlug = slug(req?.body?.title + "-" + x);
      addPost({
        title: req?.body?.title,
        image: req?.file?.path,
        text: req?.body?.text,
        slug: newSlug,
        active: req?.body?.active,
        url: process.env.PATH_FILE + "uploads/" + req?.file?.filename,
        res: res,
      });
    } else {
      addPost({
        title: req?.body?.title,
        image: req?.file?.path,
        text: req?.body?.text,
        slug: tempSlug,
        active: req?.body?.active,
        url: process.env.PATH_FILE + "uploads/" + req?.file?.filename,
        res: res,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Server Error",
    });
  }
};

export const updatePost = async (req, res) => {
  const paramsSlug = req?.params?.slug;
  const file = req?.file;
  const schema = Joi.object({
    title: Joi.string().required(),
    image: Joi.any(),
    text: Joi.string().required(),
    slug: Joi.string(),
    url: Joi.string(),
    active: Joi.boolean(),
  });
  const { error } = schema.validate(req?.body);
  if (error) {
    return res.status(400).json({
      error: {
        message: error.details[0].message,
      },
    });
  }
  try {
    const checkSlug = await Posts.findOne({ where: { slug: paramsSlug } });
    if (!checkSlug)
      return res.status(404).json({
        status: false,
        message: "Data Tidak ditemukan!",
      });

    if (file && checkSlug?.image) {
      RemoveLocalImage(checkSlug?.image);
    }

    let x = Math.floor(Math.random() * 100000 + 1);
    const newSlug = slug(req?.body?.title + "-" + x);

    editPost({
      title: req?.body?.title,
      image: req?.file?.path,
      text: req?.body?.text,
      slug: newSlug,
      active: req?.body?.active,
      url: process.env.PATH_FILE + "uploads/" + req?.file?.filename,
      res: res,
      paramsSlug: paramsSlug,
    });
  } catch (error) {
    console.error(error);
  }
};

export const deletePost = async (req, res) => {
  const { slug } = req?.params;
  try {
    const post = await Posts.findOne({ where: { slug: slug } });
    if (!post)
      return res
        .status(404)
        .json({ status: false, message: "Data Tidak ditemukan!" });
    if (post?.image) {
      RemoveLocalImage(post?.image);
    }
    await Posts.destroy({ where: { slug: slug } });
    res.status(202).json({
      status: true,
      message: "Data Berhasil dihapus!",
    });
  } catch (error) {
    console.error(error);
  }
};
