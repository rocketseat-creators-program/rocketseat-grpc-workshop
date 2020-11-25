const BookRepository = require('../data/BookRepository.js')
const AuthorController = require('./AuthorController.js')

class BookController {

  constructor () {
    this.bookRepository = new BookRepository()
    this.authorController = new AuthorController()
  }

  find (id) {
    const book = this.bookRepository.findById(id)
    if (!book) throw new Error(`Book ${id} was not found`)
    return book
  }

  list () {
    return this.bookRepository.listAll()
  }

  create (params) {
    this.#assertAuthors(params.authors)
    const book = this.bookRepository.create(params)
    this.bookRepository.save()
    return book
  }

  update (bookId, updateData) {
    this.find(bookId) // Garante que o livro exista
    if (updateData?.authors.length > 0) this.#assertAuthors(updateData.authors)
    const book = this.bookRepository.update(bookId, updateData)
    this.bookRepository.save()
    return book
  }

  delete (bookId) {
    return this.bookRepository.delete(bookId).save()
  }

  #assertAuthors (authorList) {
    for (let author of authorList) {
      this.authorController.find(author) // garante a existencia dos autores
    }
  }

}

module.exports = BookController
