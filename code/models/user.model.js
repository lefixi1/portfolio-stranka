const crypto = require("crypto");

const db = require("../data/database");
const Base = require("./base.model");
const Review = require("./review.model");

class User extends Base {
  async getUserWithSameEmail() {
    const query = `
      SELECT * FROM user WHERE email = ?
      `;
    const [records] = await db.query(query, [this.email]);
    if (records.length === 0) {
      return null;
    }
    return records[0];
  }

  static async fetchAll() {
    const query = "SELECT * FROM user";
    const [records] = await db.query(query);
    return records;
  }

  static async findById(id) {
    const query = "SELECT * FROM user WHERE user_id = ?";
    const [records] = await db.query(query, [id]);
    if (records.length === 0) {
      return null;
    }
    return new User(records[0]);
  }

  static async delete(id) {
    await Review.deleteByUserId(id);
    const query = "DELETE FROM user WHERE user_id = ?";
    const [result] = await db.query(query, [id]);
    return result;
  }

  async existsAlready() {
    const existingUser = await this.getUserWithSameEmail();
    if (existingUser) {
      return true;
    } else {
      return false;
    }
  }

  async update() {
    const query = `
    UPDATE user SET name = ?, surname = ?, email = ? 
    WHERE user_id = ?
    `;
    await db.query(query, [this.name, this.surname, this.email, this.user_id]);
  }

  async signup() {
    const salt = crypto.randomBytes(16).toString("hex");
    const hashedPassword = crypto
      .pbkdf2Sync(this.password.trim(), salt, 1000, 64, "sha512")
      .toString("hex");
    const query = `
      INSERT INTO user (name, surname, email, gender, password, salt) VALUES (?)
      `;
    const [result] = await db.query(query, [
      [
        this.name.trim(),
        this.surname.trim(),
        this.email.trim(),
        this.gender,
        hashedPassword,
        salt,
      ],
    ]);
    return result;
  }

  login(comparePassword, salt) {
    const hash_pwd = crypto
      .pbkdf2Sync(this.password, salt, 1000, 64, "sha512")
      .toString("hex");
    return comparePassword === hash_pwd;
  }
}

module.exports = User;
