const fs = require('fs')
const path = require('path')
const oid = require('bson-objectid')

class BookRepository {
  static dbLocation = path.resolve(__dirname, './.db')
  static collectionPath = path.resolve(BookRepository.dbLocation, 'books.json')

  #collection = []

  constructor () {
    if (!fs.existsSync(BookRepository.dbLocation)) fs.mkdirSync(BookRepository.dbLocation, { recursive: true })
    if (!fs.existsSync(BookRepository.collectionPath)) fs.writeFileSync(BookRepository.collectionPath, '[]')
    this.#collection = require(BookRepository.collectionPath)
    this.#collection = this.#collection.map(book => ({ ...book, id: new oid(book.id) }))
  }

  findById (id) {
    return this.#collection.find((book) => (new oid(book.id)).equals(id))
  }

  search (key, value) {
    return this.#collection.find((book) => book[key] === value)
  }

  listAll () {
    return this.#collection
  }

  create (book) {
    this.#collection.push({ id: new oid(), ...book })
    return this
  }

  delete (bookId) {
    this.#collection = this.#collection.filter(book => !(new oid(book.id)).equals(bookId))
    return this
  }

  update (bookId, updateData) {
    const book = this.findById(bookId)
    const updatedBook = { ...book, ...updateData }
    this.delete(bookId).create(updatedBook)
    return this
  }

  #serialize (entity) {
    return JSON.stringify(entity)
  }
  async save () {
    await fs.promises.writeFile(BookRepository.collectionPath, this.#serialize(this.#collection))
    return this
  }
}

module.exports = BookRepository
