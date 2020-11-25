const authorController = new (require('../controllers/AuthorController.js'))

function list (_, callback) {
  return callback(null, authorController.list())
}

function find ({ request }, callback) {
  const id = request.id
  try {
    const author = authorController.find(id)
    return callback(null, author)
  } catch (error) {
    return callback(error, null)
  }
}

function update ({ request }, callback) {
  const id = request.id
  const updateParams = request.authorUpdateParams
  try {
    const author = authorController.update(id, updateParams)
    return callback(null, author)
  } catch (error) {
    return callback(error, null)
  }
}

function remove ({ request }, callback) {
  const id = request.id
  return callback(null, authorController.delete(id))
}

function create ({ request }, callback) {
  return callback(null, authorController.create(request))
}

module.exports = {
  list,
  find,
  remove,
  create,
  update
}
