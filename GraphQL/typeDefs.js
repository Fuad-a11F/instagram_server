const { gql } = require('apollo-server-express')

const typeDefs = gql`
    type User {
        id: Int
        name: String
        email: String
        password: String
        nickname: String
        site: String
        about_me: String
        number: String
        gender: String
        image_url: String
        post_length: Int
        subscribers_length: Int
        subscriptions_length: Int
        posts: [Post]
        subscribers: [Subscribes]
    }

    type Subscribes {
        subscriber_id: Int
        user_id:  Int
    }

    type Comments {
        text: String!
        time: String!
        likes: Int!
        user: User!
    }

    type Post {
        id: Int!
        photo_url: String!
        title: String
        likes: String!
        comments: [Comments]
        user_main: User
    }

    type Search {
        id: Int!
        search_id: Int!
    }

    type Query {
        getUser(token: String!): User!
        getUserTop(id: Int!): User!
        getUsers(name: String!): [User] 
        loginUser(email: String, password: String): String
        getPassword(token: String!): User
        getPosts(id: Int!): [Post!]!
        getPost(token: String!, id: Int!): Post!
        getSearch(token: String!): [User]
        getSubscriber(token: String!, subscriber_id: Int!): Boolean
        getSubscribers(id: Int!): [User]
        getSubscribtion(id: Int!): [User]
        getHintComponentFriend(token: String!): Boolean
        getHintComponentNumber(token: String!): Boolean
        getHintComponentPhoto(token: String!): Boolean
    }

    type Mutation {
        registerUser(name:String!, nickname: String, email: String, password: String!): User
        changeMainData(token: String, image_url: String, name: String!,  nickname: String!,  email: String!, number: String, site: String, about_me: String, gender: String): String
        changePassword(token: String!, old_password: String!, new_password: String!): String
        addPost(token: String!, image_path: String, comment_title: String ): String
        addComment(token: String!, time: String!, text: String!, post_id: Int! ): String
        addSearch(token: String!, search_id: Int!): String
        addSubscribe(token: String!, subscriber_id:Int!): String
        removeSubscribe(token: String!, subscriber_id:Int!): String
    }
`

module.exports = typeDefs