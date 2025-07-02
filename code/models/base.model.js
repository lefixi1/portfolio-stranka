class Base {
  constructor(data, id) {
    for (const key in data) {
      this[key] = data[key];
    }
    this.id = id;
  }
}

module.exports = Base;
