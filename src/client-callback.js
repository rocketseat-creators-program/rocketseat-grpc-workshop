const grpc = require('grpc')
const path = require('path')

const BooksDefinition = grpc.load(path.resolve(__dirname, '../proto/books.proto'))
const AuthorsDefinition = grpc.load(path.resolve(__dirname, '../proto/authors.proto'))

const authorClient = new AuthorsDefinition.AuthorService('localhost:50051', grpc.credentials.createInsecure())
const bookClient = new BooksDefinition.BookService('localhost:50051', grpc.credentials.createInsecure())

function handle (err, authors) {
  if (err) return console.error(err.message)
  console.log(authors)
}

authorClient.list({}, handle)
authorClient.find({ id: '5fbee76ca1280650228170cf' }, handle)
authorClient.remove({ id: '5fbebfe7b5871a850811b65a' }, handle)
authorClient.create({ name: 'Isaac Asimov', website: '' }, handle)
authorClient.update({ id: '5fbebfb8e97724840f6f2831', authorUpdateParams: { name: 'Lucas Santos' } }, handle)


bookClient.list({}, handle)
bookClient.find({ id: '5fbee86be0443b5569d9e57d' }, handle)
bookClient.create({
  title: 'Fundação',
  publisher: 'Aleph',
  pages: 280,
  isbn: 'xxxxx',
  authors: ['5fbee76ca1280650228170cf']
}, handle)
bookClient.remove({ id: '5fbee86be0443b5569d9e57d' }, handle)
bookClient.update({ id: '5fbee86be0443b5569d9e57d', bookUpdateParams: { pages: 250 } }, handle)
