const db = require("../data/database");
const Base = require("./base.model");

class Book extends Base {
  constructor(data, id = null) {
    super();
    this.id = id;

    this.user_id = data?.user_id;
    this.name = data?.name;
    this.surname = data?.surname;
    this.phone = data?.phone;
    this.email = data?.email;
    this.country = data?.country;
    this.city = data?.city;
    this.ppl_amount = data?.ppl_amount;
    this.count_id = data?.count_id;
    this.trip_id = data?.trip_id;
  }
  static async fetchAll() {
    const query = `
    SELECT book.*, trip.trip_tit FROM book
    INNER JOIN trip ON book.trip_id = trip.trip_id
    INNER JOIN user ON book.user_id = user.user_id
    WHERE user.isAdmin = 0`;
    const [records] = await db.query(query);
    return records;
  }

  async fetchByUser() {
    if (!this.user_id) {
      return;
    }
    const query = `
        SELECT book.book_id, book.name, book.surname, book.phone, book.email, book.country, book.city, book.ppl_amount, trip.trip_tit  FROM book
        INNER JOIN trip ON book.trip_id = trip.trip_id
         WHERE book.user_id = ?
        `;

    const [records] = await db.query(query, [this.user_id]);
    if (records.length === 0) {
      return;
    }
    return records;
  }

  async fetchById() {
    if (!this.id) {
      return;
    }

    const query = `
    SELECT book.book_id, book.ppl_amount, book.count_id, book.trip_id, trip.trip_tit FROM book
    INNER JOIN trip ON book.trip_id = trip.trip_id
    WHERE book.book_id = ?
    `;

    const [records] = await db.query(query, [this.id]);

    if (records.length === 0) {
      return null;
    }

    return records[0];
  }

  async save() {
    if (this.id) {
      const query = `
            UPDATE book SET ppl_amount = ?, trip_id = ?, count_id = ? WHERE book_id = ?
            `;
      await db.query(query, [
        this.ppl_amount,
        this.trip_id,
        this.count_id,
        this.id,
      ]);
    } else {
      const query = `
            INSERT INTO book (user_id, name, surname, phone, email, country, city, ppl_amount, count_id, trip_id)
            VALUES (?)
            `;
      await db.query(query, [
        [
          this.user_id,
          this.name,
          this.surname,
          this.phone,
          this.email,
          this.country,
          this.city,
          this.ppl_amount,
          this.count_id,
          this.trip_id,
        ],
      ]);
    }
  }

  async delete() {
    if (!this.id) {
      return;
    }
    await db.query("DELETE FROM book WHERE book_id = ?", [this.id]);
  }
}

module.exports = Book;
