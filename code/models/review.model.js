const db = require("../data/database");
const Base = require("./base.model");

class Review extends Base {
  constructor(reviewData, id) {
    super();
    this.id = id;
    if (reviewData) {
      this.setReviewData(reviewData);
    }
  }

  setReviewData(reviewData) {
    this.user_id = reviewData.user_id;
    this.text = reviewData.text;
    this.rating = reviewData.rating;
    this.trip_id = reviewData.trip_id;
    this.imageLocation = reviewData.imageLocation;
    this.reviewer_name = reviewData.reviewer_name;
    this.date = reviewData.date;
  }

  async fetchByTrip(tripId) {
    const numericTripId = parseInt(tripId, 10);
    const query = `SELECT * FROM review WHERE trip_id = ?`;
    const [records] = await db.query(query, [numericTripId]);

    return records;
  }

  async fetch() {
    if (!this.id) {
      return null;
    }

    const query = `
    SELECT * FROM review
    WHERE rev_id = ?`;

    try {
      const [records] = await db.query(query, [this.id]);

      Object.assign(this, records[0]);
      return this;
    } catch (error) {
      console.log(error.message);
    }
  }

  async save() {
    if (this.id) {
      const imageLoc =
        this.imageLocation === undefined ? null : this.imageLocation;
      const query = `
        UPDATE review set text = ?, rating = ?, imageLocation = ?
        WHERE rev_id = ?
        `;

      await db.query(query, [this.text, this.rating, imageLoc, this.id]);
    } else {
      const [userResult] = await db.query(
        `
        SELECT name, surname FROM user 
        WHERE user_id = ?
        `,
        [this.user_id]
      );

      const reviewer_name = `${userResult[0].name} ${userResult[0].surname}`;
      const query = `
        INSERT INTO review (reviewer_name, text, rating, trip_id,imageLocation, user_id)
        VALUES (?)
        `;
      await db.query(query, [
        [
          reviewer_name,
          this.text,
          this.rating,
          this.trip_id,
          this.imageLocation || null,
          this.user_id,
        ],
      ]);
    }
  }

  async delete() {
    if (!this.id) {
      return;
    }
    await db.query("DELETE FROM review WHERE rev_id = ?", [this.id]);
  }

  static async deleteByUserId(userId) {
    const query = "DELETE FROM review WHERE user_id=?";
    const [result] = await db.query(query, [userId]);
    return result;
  }
}

module.exports = Review;
