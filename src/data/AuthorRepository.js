const fs = require('fs')
const path = require('path')
const oid = require('bson-objectid')

class AuthorRepository {
  static dbLocation = path.resolve(__dirname, './.db')
  static collectionPath = path.resolve(AuthorRepository.dbLocation, 'authors.json')

  static #collection = []

  constructor () {
    if (!fs.existsSync(AuthorRepository.dbLocation)) fs.mkdirSync(AuthorRepository.dbLocation, { recursive: true })
    if (!fs.existsSync(AuthorRepository.collectionPath)) fs.writeFileSync(AuthorRepository.collectionPath, '[]')
    AuthorRepository.#collection = require(AuthorRepository.collectionPath)
    AuthorRepository.#collection = AuthorRepository.#collection
  }

  findById (id) {
    const author = AuthorRepository.#collection.find((author) => author.id === id)
    console.log(`[DEBUG]  --------------------------------------------------------------------------------------------`)
    console.log(`[DEBUG]  ~ file: AuthorRepository.js ~ line 20 ~ AuthorRepository ~ findById ~ author`, author)
    console.log(`[DEBUG]  --------------------------------------------------------------------------------------------`)
    return author
  }

  search (key, value) {
    return AuthorRepository.#collection.find((author) => author[key] === value)
  }

  listAll () {
    return AuthorRepository.#collection.map(author => ({ ...author, id: author.id }))
  }

  create (author) {
    const newAuthor = { id: new oid().toHexString(), ...author }
    AuthorRepository.#collection.push(newAuthor)
    return { ...author, id: newAuthor.id }
  }

  delete (authorId) {
    AuthorRepository.#collection = AuthorRepository.#collection.filter(author => !(new oid(author.id)).equals(authorId))
    return this
  }

  update (authorId, updateData) {
    const author = this.findById(authorId)
    const filteredData = Object.entries(updateData).reduce((acc, [key, value]) => { if (value) acc[key] = value; return acc }, {}) // remove chaves em branco
    const updatedAuthor = this.delete(authorId).create({ ...author, ...filteredData })
    return updatedAuthor
  }

  #serialize (entity) {
    return JSON.stringify(entity)
  }
  save () {
    fs.writeFileSync(AuthorRepository.collectionPath, this.#serialize(AuthorRepository.#collection))
    return this
  }
}

module.exports = AuthorRepository
