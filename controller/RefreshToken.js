import Jwt from "jsonwebtoken";
import Users from "../models/UserModel.js";

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);
    const user = await Users.findAll({
      where: { refresh_token: refreshToken },
    });
    if (!user[0]) return res.sendStatus(403);
    Jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) return res.sendStatus(403);
        const userId = user[0].id;
        const name = user[0].name;
        const email = user[0].email;

        const accesToken = Jwt.sign(
          { userId, name, email },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15s" }
        );
        res.status(200).json({ accesToken });
      }
    );
  } catch (error) {
    console.error("error ", error);
  }
};
