const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const {sequelize}= require('./models')
const cors =   require('cors')
const typeDefs =  require('./GraphQL/typeDefs')
const resolvers =  require('./GraphQL/Queries')
const app = express()
app.use(express.json())
app.use(cors())

const server = new ApolloServer({typeDefs, resolvers})

server.applyMiddleware({app})




app.listen(8000, () => {
    console.log('Сервер запущен');
    sequelize.authenticate().then(() => console.log('db start'))
})