const grpc = require('grpc')
const path = require('path')

const BooksDefinition = grpc.load(path.resolve(__dirname, '../proto/books.proto'))
const bookHandlers = require('./handlers/BookHandler')

const AuthorsDefinition = grpc.load(path.resolve(__dirname, '../proto/authors.proto'))
const authorHandlers = require('./handlers/AuthorHandler')

const server = new grpc.Server()
server.addService(BooksDefinition.BookService.service, bookHandlers)
server.addService(AuthorsDefinition.AuthorService.service, authorHandlers)

server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure())
console.log('Listening...')
server.start()
