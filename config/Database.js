import { Sequelize } from "sequelize";

const db = new Sequelize("blog_wibu", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;