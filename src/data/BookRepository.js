const fs = require('fs')
const path = require('path')
const oid = require('bson-objectid')

class BookRepository {
  static dbLocation = path.resolve(__dirname, './.db')
  static collectionPath = path.resolve(BookRepository.dbLocation, 'books.json')

  static #collection = []

  constructor () {
    if (!fs.existsSync(BookRepository.dbLocation)) fs.mkdirSync(BookRepository.dbLocation, { recursive: true })
    if (!fs.existsSync(BookRepository.collectionPath)) fs.writeFileSync(BookRepository.collectionPath, '[]')
    BookRepository.#collection = require(BookRepository.collectionPath)
    BookRepository.#collection = BookRepository.#collection
  }

  findById (id) {
    return BookRepository.#collection.find((book) => book.id === id)
  }

  search (key, value) {
    return BookRepository.#collection.find((book) => book[key] === value)
  }

  listAll () {
    return BookRepository.#collection.map(book => ({ ...book, id: book.id }))
  }

  create (book) {
    const newBook = { id: new oid().toHexString(), ...book }
    BookRepository.#collection.push(newBook)
    return newBook
  }

  delete (bookId) {
    BookRepository.#collection = BookRepository.#collection.filter(book => !(new oid(book.id)).equals(bookId))
    return this
  }

  update (bookId, updateData) {
    const book = this.findById(bookId)
    const filteredData = Object.entries(updateData).reduce((acc, [key, value]) => {
      if ((Array.isArray(value) && value.length > 0) || (value && !Array.isArray(value))) acc[key] = value
      return acc
    }, {}) // remove chaves em branco
    const updatedBook = this.delete(bookId).create({ ...book, ...filteredData })
    return updatedBook
  }

  #serialize (entity) {
    return JSON.stringify(entity)
  }
  save () {
    fs.writeFileSync(BookRepository.collectionPath, this.#serialize(BookRepository.#collection))
    return this
  }
}

module.exports = BookRepository
