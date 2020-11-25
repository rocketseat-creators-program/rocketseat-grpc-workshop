const AuthorRepository = require('../data/AuthorRepository.js')
class AuthorController {

  constructor () {
    this.authorRepository = new AuthorRepository()
  }

  find (id) {
    const author = this.authorRepository.findById(id)
    if (!author) throw new Error(`Author ${id} was not found`)
    return author
  }

  list () {
    return this.authorRepository.listAll()
  }

  create (params) {
    const author = this.authorRepository.create(params)
    this.authorRepository.save()
    return author
  }

  update (authorId, updateData) {
    this.find(authorId) // Garante que o autor exista
    const author = this.authorRepository.update(authorId, updateData)
    this.authorRepository.save()
    return author
  }

  delete (authorId) {
    return this.authorRepository.delete(authorId).save()
  }

}

module.exports = AuthorController
