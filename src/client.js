const grpc = require('grpc')
const path = require('path')

const BooksDefinition = grpc.load(path.resolve(__dirname, '../proto/books.proto'))
const AuthorsDefinition = grpc.load(path.resolve(__dirname, '../proto/authors.proto'))

const client = new AuthorsDefinition.AuthorService('localhost:50051', grpc.credentials.createInsecure())

function handle (err, authors) {
  if (err) return console.error(err.message)
  console.log(authors)
}

client.list({}, handle)
client.find({ id: '1' }, handle)
client.remove({ id: '5fbebfe7b5871a850811b65a' }, handle)
client.create({ name: 'lucas', website: 'lsantos.dev' }, handle)
client.update({ id: '5fbebfb8e97724840f6f2831', authorUpdateParams: { name: 'Lucas Santos' } }, handle)
