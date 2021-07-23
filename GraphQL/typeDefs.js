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
        id: Int!
        user: User!
        send_user_id: Int!
        user_id: User!
    }

    type Post {
        id: Int!
        photo_url: String
        title: String
        likes: Int!
        comments: Int
        user_main: User
        liked: Boolean!
        favourite: Boolean!
    }

    type Search {
        id: Int!
        search_id: Int!
    }

    type Action {
        action: String!
        post_id: Post
        is_looked: Boolean!
        user_id: User!
        id: Int!
    }

    type Chat {
        chat_user_id: User
    }

    type Message {
        id: Int!
        text: String!
        time: String!
        isRead: Boolean!
        user_id:Int!
        is_image: Boolean!
    }


    type Query {
        getUser(token: String!): User!
        getUserTop(id: Int!): User!
        getUsers(name: String!): [User] 
        loginUser(email: String, password: String): String
        getPassword(token: String!): User
        getPosts(id: Int!, limit: Int!, offset: Int!): [Post!]!
        getPost(token: String!, id: Int!, user_id: Int!): Post!
        getSearch(token: String!): [User]
        getSubscriber(token: String!, subscriber_id: Int!): Boolean
        getSubscribers(id: Int!): [User]
        getSubscribtion(id: Int!): [User]
        getHintComponentFriend(token: String!): Boolean
        getHintComponentNumber(token: String!): Boolean
        getHintComponentPhoto(token: String!): Boolean
        getMainUser(token: String!): User!
        getHint(token: String!): Boolean
        getUserPhoto(token: String!): User!
        getAction(token: String!): [Action]!
        getChat(token: String!): [User]
        getMessages(token: String!, id: Int): [Message]
        getMessageHave(token: String!): Boolean!
        getUserChat(id: Int): User!
        getUserBlock(token: String!, id: Int!): String!
        getFavourites(token: String!, limit: Int!, offset: Int!): [Post]
        getPostComment(post_id: Int!, limit: Int!, offset: Int!): [Comments]
        getUserName(id: Int): String!
        getRecommend(token: String!): [User!]!
    }   


    type Mutation {
        registerUser(name:String!, nickname: String, email: String, password: String!): User
        changeMainData(token: String, image_url: String, name: String!,  nickname: String!,  email: String!, number: String, site: String, about_me: String, gender: String): String
        changePassword(token: String!, old_password: String!, new_password: String!): String
        addPost(token: String!, image_path: String, comment_title: String ): String
        addComment(token: String!, user_id: Int!, text: String!, post_id: Int! ): String
        addSearch(token: String!, search_id: Int!): String
        addSubscribe(token: String!, subscriber_id:Int!): String
        removeSubscribe(token: String!, subscriber_id:Int!): String
        removeHint(token: String!): String
        addAction(token: String!, action: String!, user_id: Int!, post_id: Int): String
        addLikePost(token: String!, user_id: Int!, post_id: Int!): String
        readAction(token: String!): String
        addChat(token: String!, id:Int!): String
        addMessage(token: String!, send_user_id: Int!, text: String!, is_image: Boolean!): String
        deleteMessage(id: Int!): String
        makeRead(token: String!,send_id: Int!): String
        deleteChat(id: Int!): String
        addBlock(token: String!, id: Int!): String
        deleteBlock(token: String!, id: Int!): String
        addFavourite(token: String!, post_id: Int!): String
        deleteFavourite(token: String!, post_id: Int!): String
        deletePost(id: Int!): String
    }
`

module.exports = typeDefs