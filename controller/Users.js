import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import Joi from "joi";
import Jwt from "jsonwebtoken";

export const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ["id", "name", "email"],
    });
    res.json(users);
  } catch (error) {
    console.error(error);
  }
};

export const Register = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(5).required(),
    email: Joi.string().email().min(5).required(),
    password: Joi.string().min(6).required(),
    confirPassword: Joi.string().min(6).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: {
        message: error.details[0].message,
      },
    });
  }

  // cek dulu apakah passwod dan confirm password sesuai
  if (req?.body?.password !== req?.body?.confirPassword)
    return res
      .status(400)
      .json({ message: "Password dan Confirm Password tidak sesuai!" });

  try {
    //cek apakah password match ??
    const salt = await bcrypt.genSalt();
    const hasPassword = await bcrypt.hash(req?.body?.password, salt);

    //cari email yang sudah terdaftar
    const emailCheck = await Users.findOne({
      where: { email: req.body.email },
    });

    if (emailCheck) {
      return res.status(400).json({
        status: "Email sudah terdaftar!",
      });
    } else {
      try {
        const newUser = await Users.create({
          name: req?.body?.name,
          email: req?.body?.email,
          password: hasPassword,
        });
        res.json({
          status: "Register berhasil!",
          data: {
            name: newUser?.name,
            email: newUser?.email,
          },
        });
      } catch (error) {
        console.error();
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "Server Error",
    });
  }
};

export const Login = async (req, res) => {
  try {
    const user = await Users.findOne({ where: { email: req?.body?.email } });
    const match = await bcrypt.compare(req?.body?.password, user?.password);
    if (!match)
      return res.status(400).json({ message: "Passwod tidak sesuai!" });

    const userID = user?.id;
    const name = user?.name;
    const email = user?.email;

    const accesToken = Jwt.sign(
      { userID, name, email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "20s" }
    );
    const refreshToken = Jwt.sign(
      { userID, name, email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    await Users.update(
      { refresh_token: refreshToken },
      {
        where: { id: userID },
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      // secure: true
    });
    res.json({ accesToken });
  } catch (error) {
    res.status(404).json({
      message: "Email tidak ditemukan!",
    });
  }
};

export const Logout = async (req, res) => {
  const refresToken = req.cookies.refreshToken;
  if (!refresToken) return res.sendStatus(204);
  const user = await Users.findAll({
    where: { refresh_token: refresToken },
  });
  if (!user[0]) return res.sendStatus(204);
  const userId = user[0].id;
  await Users.update({ refresh_token: null }, { where: { id: userId } });
  res.clearCookie("refreshToken");
  return res.sendStatus(200);
};
