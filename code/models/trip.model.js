const db = require("../data/database");
const Base = require("./base.model");

class Trip extends Base {
  constructor(data, id) {
    super(data, id);
  }

  static async fetchAll() {
    const query = `SELECT * FROM trip
    INNER JOIN country ON country.count_id = trip.count_id`;
    const [records] = await db.query(query);
    return records;
  }

  async fetchDetailsById() {
    if (!this.id) {
      return;
    }
    const query = `SELECT trip.*, country.count_name, country.count_descr
     FROM trip
     JOIN country ON trip.count_id = country.count_id
     WHERE trip.trip_id = ?`;
    const [records] = await db.query(query, [this.id]);

    if (records.length > 0) {
      return records[0];
    }

    return null;
  }

  async fetchByCountryName() {
    if (!this.count_name) {
      return;
    }
    const query = `SELECT trip.*, country.count_name, country.count_descr_long FROM trip
    JOIN country ON trip.count_id = country.count_id
    WHERE country.count_name = ?`;
    const [records] = await db.query(query, [this.count_name]);
    if (records.length === 0) {
      return;
    }
    return records;
  }

  async fetchExists() {
    if (!this.trip_tit || !this.count_id) {
      return;
    }

    const query = `
  SELECT trip_id FROM trip
  WHERE trip_tit = ? AND count_id = ?
  `;
    const [records] = await db.query(query, [this.trip_tit, this.count_id]);

    if (records.length === 0) {
      return;
    }
  }

  async fetchByCountryId() {
    if (!this.count_id) {
      return;
    }

    const query = `
  SELECT trip_id, trip_tit FROM trip WHERE count_id = ?
  `;
    const [records] = await db.query(query, [this.count_id]);

    if (records.length === 0) {
      return;
    }

    return records;
  }

  static async fetchLastMinute() {
    const query = `
    SELECT trip.*, 
      country.count_name, 
      country.count_descr,
      country.count_descr_long,
      country.imageLocation AS country_imageLocation FROM trip
    INNER JOIN country ON country.count_id = trip.count_id 
    WHERE date_dep <= DATE_ADD(CURDATE(), INTERVAL 1 MONTH)`;

    const [records] = await db.query(query);
    return records;
  }

  async updateSeats(newSeats) {
    if (!this.id) {
      return;
    }
    const query = `
    UPDATE trip SET amount=? WHERE trip_id =?
    `;
    await db.query(query, [newSeats, this.id]);

    this.amount = newSeats;
  }

  async save() {
    if (this.id) {
      const query = `
        UPDATE trip SET trip_descr = ?, amount = ?, date_dep = ?, date_ret = ?, room_type = ?, trip_type = ?, price = ?, old_price = ?, imageLocation = ? WHERE trip_id = ?`;

      await db.query(query, [
        this.trip_descr,
        this.amount,
        this.date_dep,
        this.date_ret,
        this.room_type,
        this.trip_type,
        this.price,
        this.old_price,
        this.imageLocation,
        this.id,
      ]);
    } else {
      const query = `
        INSERT INTO trip (trip_tit, trip_descr, amount, city, date_dep, date_ret, room_type, trip_type, price, old_price, imageLocation, count_id) VALUES (?)
        `;
      await db.query(query, [
        [
          this.trip_tit,
          this.trip_descr,
          this.amount,
          this.city,
          this.date_dep,
          this.date_ret,
          this.room_type,
          this.trip_type,
          this.price,
          this.old_price,
          this.imageLocation,
          this.count_id,
        ],
      ]);
    }
  }

  async delete() {
    if (!this.id) {
      return;
    }
    await db.query("DELETE FROM book WHERE trip_id = ?", [this.id]);
    await db.query("DELETE FROM review WHERE trip_id = ?", [this.id]);
    await db.query("DELETE FROM trip WHERE trip_id = ?", [this.id]);
  }

  async deleteByCountryId(countryId) {
    await db.query("DELETE FROM trip WHERE count_id = ?", [countryId]);
  }
}

module.exports = Trip;
