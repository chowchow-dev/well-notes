export class Storage {
  constructor(prefix = "well-notes-v1") {
    this.storage = localStorage;
    this.prefix = prefix;
  }

  setItem(key, value) {
    this.storage.setItem(`${this.prefix}-${key}`, value);
  }

  getItem(key) {
    return this.storage.getItem(`${this.prefix}-${key}`);
  }

  removeItem(key) {
    this.storage.removeItem(`${this.prefix}-${key}`);
  }
}
