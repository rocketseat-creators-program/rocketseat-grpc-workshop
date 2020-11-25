const bookController = new (require('../controllers/BookController.js'))

function list (_, callback) {
  return callback(null, bookController.list())
}

function find ({ request }, callback) {
  const id = request.id
  try {
    const book = bookController.find(id)
    return callback(null, book)
  } catch (error) {
    return callback(error, null)
  }
}

function update ({ request }, callback) {
  const id = request.id
  const updateParams = request.bookUpdateParams
  try {
    const book = bookController.update(id, updateParams)
    return callback(null, book)
  } catch (error) {
    return callback(error, null)
  }
}

function remove ({ request }, callback) {
  const id = request.id
  return callback(null, bookController.delete(id))
}

function create ({ request }, callback) {
  try {
    return callback(null, bookController.create(request))
  } catch (error) {
    return callback(error, null)
  }
}

module.exports = {
  list,
  find,
  remove,
  create,
  update
}
