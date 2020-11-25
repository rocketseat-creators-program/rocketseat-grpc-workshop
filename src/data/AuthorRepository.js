const fs = require('fs')
const path = require('path')
const oid = require('bson-objectid')

class AuthorRepository {
  static dbLocation = path.resolve(__dirname, './.db')
  static collectionPath = path.resolve(AuthorRepository.dbLocation, 'authors.json')

  #collection = []

  constructor () {
    if (!fs.existsSync(AuthorRepository.dbLocation)) fs.mkdirSync(AuthorRepository.dbLocation, { recursive: true })
    if (!fs.existsSync(AuthorRepository.collectionPath)) fs.writeFileSync(AuthorRepository.collectionPath, '[]')
    this.#collection = require(AuthorRepository.collectionPath)
    this.#collection = this.#collection.map(author => ({ ...author, id: new oid(author.id) }))
  }

  findById (id) {
    return this.#collection.find((author) => (new oid(author.id)).equals(id))
  }

  search (key, value) {
    return this.#collection.find((author) => author[key] === value)
  }

  listAll () {
    return this.#collection.map(author => ({ ...author, id: author.id.toHexString() }))
  }

  create (author) {
    const newAuthor = { id: new oid(), ...author }
    this.#collection.push(newAuthor)
    return { ...author, id: newAuthor.id.toHexString() }
  }

  delete (authorId) {
    this.#collection = this.#collection.filter(author => !(new oid(author.id)).equals(authorId))
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
    fs.writeFileSync(AuthorRepository.collectionPath, this.#serialize(this.#collection))
    return this
  }
}

module.exports = AuthorRepository
