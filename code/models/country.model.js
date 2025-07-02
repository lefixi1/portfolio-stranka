const db = require("../data/database");

class Country {
  constructor(data, id) {
    if (data) {
      for (const key in data) {
        this[key] = data[key];
      }
    }
    this.id = id;
  }

  static async fetchAll() {
    const query = `SELECT * FROM country`;
    const [records] = await db.query(query);
    return records;
  }

  static async fetch() {
    const query = "SELECT count_id, count_name FROM country";
    const [records] = await db.query(query);
    return records;
  }

  async save() {
    if (this.id) {
      const query = `
        UPDATE country SET count_descr = ?, count_descr_long = ?, imageLocation = ? WHERE count_id = ?
        `;
      await db.query(query, [
        this.count_descr,
        this.count_descr_long,
        this.imageLocation,
        this.id,
      ]);
    } else {
      const query = `
        INSERT INTO country (count_name, count_descr, count_descr_long, imageLocation)
        VALUES (?)`;
      await db.query(query, [
        [
          this.count_name,
          this.count_descr,
          this.count_descr_long,
          this.imageLocation,
        ],
      ]);
    }
  }

  async delete() {
    await db.query("DELETE FROM country WHERE count_id = ?", [this.id]);
  }
}

module.exports = Country;
