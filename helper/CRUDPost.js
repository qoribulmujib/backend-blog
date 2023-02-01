import Posts from "../models/PostModel.js";

export const addPost = async ({
  title,
  image,
  text,
  slug,
  active,
  url,
  res,
}) => {
  const newPost = await Posts.create({
    title: title,
    image: image,
    text: text,
    slug: slug,
    active: active,
    url: url,
  });
  res.status(200).json({
    status: true,
    data: newPost,
    message: "Created Successfully!",
  });
};
export const editPost = async ({
  title,
  image,
  text,
  slug,
  active,
  url,
  res,
  paramsSlug,
}) => {
  const newPost = await Posts.update(
    {
      title: title,
      image: image,
      text: text,
      slug: slug,
      active: active,
      url: url,
    },
    { where: { slug: paramsSlug } }
  );
  res.status(200).json({
    status: true,
    message: "Update Successfully!",
  });
};
