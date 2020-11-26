const grpc = require('grpc')
const path = require('path')

const BooksDefinition = grpc.load(path.resolve(__dirname, '../proto/books.proto'))
const AuthorsDefinition = grpc.load(path.resolve(__dirname, '../proto/authors.proto'))

const authorClient = new AuthorsDefinition.AuthorService('localhost:50051', grpc.credentials.createInsecure())
const bookClient = new BooksDefinition.BookService('localhost:50051', grpc.credentials.createInsecure())

function promisify (client, method) { // Retorna um método aguardando parâmetros para ser executado como uma promise
  return (param) => {
    return new Promise((resolve, reject) => {
      client[method](param, (err, response) => { // executa o método com os parâmetros e cria um novo callback
        if (err) return reject(err) // rejeita no erro
        resolve(response) // resolve no sucesso
      })
    })
  }
}

; (async () => {
  console.log(`---------------------------------------------------------------------------------`)
  console.log('CRIANDO AUTORES')
  console.log(`---------------------------------------------------------------------------------`)
  const Asimov = await promisify(authorClient, 'create')({ name: 'Isaac Asimov' })
  const Lucas = await promisify(authorClient, 'create')({ name: 'Lucas Santos', website: 'https://blog.lsantos.dev' })

  console.log(`---------------------------------------------------------------------------------`)
  console.log('LISTANDO AUTORES')
  console.log(`---------------------------------------------------------------------------------`)
  console.log(await promisify(authorClient, 'list')({}))

  console.log(`---------------------------------------------------------------------------------`)
  console.log('PROCURANDO ISAAC ASIMOV')
  console.log(`---------------------------------------------------------------------------------`)
  console.log(await promisify(authorClient, 'find')({ id: Asimov.id }))

  console.log(`---------------------------------------------------------------------------------`)
  console.log('CRIANDO LIVROS')
  console.log(`---------------------------------------------------------------------------------`)
  const Foundation = await promisify(bookClient, 'create')({
    title: 'Fundação',
    publisher: 'Aleph',
    pages: 240,
    isbn: '9788576570660',
    authors: [Asimov.id]
  })
  const Kubernetes = await promisify(bookClient, 'create')({
    title: 'Kubernetes - Tudo sobre Orquestração de Containers',
    publisher: 'Casa do Código',
    pages: 333,
    isbn: '9788572540247',
    authors: [Lucas.id]
  })
  console.log(await promisify(bookClient, 'list')({}))

  console.log(`---------------------------------------------------------------------------------`)
  console.log('ATUALIZANDO LIVRO')
  console.log(`---------------------------------------------------------------------------------`)
  await promisify(bookClient, 'update')({ id: Kubernetes.id, bookUpdateParams: { summary: '' } })
  console.log(await promisify(bookClient, 'find')({ id: Kubernetes.id }))

  console.log(`---------------------------------------------------------------------------------`)
  console.log('REMOVENDO LIVROS E AUTORES')
  console.log(`---------------------------------------------------------------------------------`)
  await promisify(bookClient, 'remove')({ id: Foundation.id })
  await promisify(authorClient, 'remove')({ id: Asimov.id })
  try {
    console.log(await promisify(bookClient, 'find')({ id: Foundation.id }))
  } catch (err) {
    console.error(err.message)
  }

  try {
    console.log(await promisify(authorClient, 'find')({ id: Asimov.id }))
  } catch (err) {
    console.error(err.message)
  }
})()
