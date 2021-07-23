const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const {sequelize}= require('./models')
const cors =   require('cors')
const typeDefs =  require('./GraphQL/typeDefs')
const resolvers =  require('./GraphQL/Queries')
const app = express()
const http = require('http').createServer(app)
const socketio = require('socket.io')(http,{cors:{origin:'*'}})
let jwd = require("jsonwebtoken");
let firebase = require('firebase/app')






app.use(express.json())
app.use(cors())

const server_1 = new ApolloServer({typeDefs, resolvers})

server_1.applyMiddleware({app})

socketio.on('connection', socket => {
    console.log('new connect');
    socket.on('join', ({user_id, my_id}) => {
        socket.join(user_id + jwd.decode(my_id, "LOGIN_SECRET").id)
    })
    socket.on('message', ({room,token}) =>  {
        socketio.in(room+jwd.decode(token, "LOGIN_SECRET").id).emit('messageSend')
    })
    
})


http.listen(8000, () => {
    console.log('Сервер запущен');
    sequelize.authenticate().then(() => console.log('db start'))
})