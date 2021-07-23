let { user, posts, comments, search, subscribes, action, likes,  chat, message, blocked, favourite } = require("../models");
let jwd = require("jsonwebtoken");
let bcrypt = require("bcryptjs");
let moment = require('moment')
const { Op, Sequelize } = require("sequelize");


let generatorToken = (id, password, email) => {
  const payload = {
    id,
    password,
    email,
  };
  return jwd.sign(payload, "LOGIN_SECRET", { expiresIn: "1h" });
};

const resolvers = {
  Query: {
    getUser: async (_, { token }) => {
      return await user.findByPk(jwd.decode(token, "LOGIN_SECRET").id);
    },
    getUserTop: async (_, { id }) => {
      let user_top = await user.findByPk(id);
      let posts_array = await posts.findAll({where: {user_id: id}, raw: true})
      let subscribers_array = await subscribes.findAll({where: {subscriber_id: id}, raw: true})
      let subscriptions_array = await subscribes.findAll({where: {user_id: id}, raw: true})
      user_top.dataValues.post_length = posts_array.length
      user_top.dataValues.subscribers_length = subscribers_array.length
      user_top.dataValues.subscriptions_length = subscriptions_array.length
      return user_top.dataValues

    },
    loginUser: async (_, { email, password }) => {
      if (email && password) {
        let login_user = await user.findAll({
          where: { email: email },
          raw: true,
        });
        if (login_user.length != 0) {
          if (bcrypt.compareSync(password, login_user[0].password)) {
            return await generatorToken(
              login_user[0].id,
              login_user[0].password,
              login_user[0].email
            );
          }
        }
        return "error";
      }
    },
    getPassword: async (_, { token }) => {
      return await user.findByPk(jwd.decode(token, "LOGIN_SECRET").id);
    },

    getPosts: async (_, {id, limit, offset}) => {
      let post_array = await posts.findAll({where: {user_id: id}, raw: true, limit, offset});
      let post_comment = await post_array.map(async item =>  {
        let comment_array = await comments.findAll({where: {post_id: item.id}, raw: true});
        item.comments = comment_array.length       
        return item
      })
      return post_comment
    },

    getPost: async (_, {token, id, user_id}) =>  {
      let post = await posts.findByPk(id)
      let user_main = await user.findByPk(user_id);
      let check_like = await likes.findOne({where: {user_id: jwd.decode(token, "LOGIN_SECRET").id, post_id: id}})
      let check_favourite = await favourite.findOne({where: {user_id: jwd.decode(token, "LOGIN_SECRET").id, post_id: id}})
      check_like ? post.dataValues.liked = true : post.dataValues.liked = false
      check_favourite ? post.dataValues.favourite = true : post.dataValues.favourite = false
      post.dataValues.user_main = user_main
      return post.dataValues
    },

    getUsers: async (_, {name}) => {
        let users = await user.findAll({raw: true})
        let user_filter = []
        users.forEach(item => {
          if (item.name.includes(name)) {
            user_filter.push(item)
          }
        })
        return user_filter
    },

    getSearch: async (_, {token}) => {
      let search_array = await search.findAll({where: {user_id: jwd.decode(token, "LOGIN_SECRET").id}, raw: true})
      search_array = search_array.map(async item  => {
        return await user.findOne({where: {id: item.search_id}, raw: true})
      })
      return search_array.reverse()
    },

    getSubscriber: async (_, {token, subscriber_id}) => {
      let flag = await subscribes.findAll({where: {user_id: jwd.decode(token, "LOGIN_SECRET").id, subscriber_id: subscriber_id}})
      if (flag.length > 0)  return true
      return false
    },

    getSubscribers: async (_, {id}) => {
      let sub_array = await subscribes.findAll({where: {subscriber_id: id}, raw: true})
      let user_array  = sub_array.map(async item => {
        return await user.findOne({where: {id: item.user_id}, raw: true})
      })
      return user_array.slice(0,10)
    },
    getSubscribtion: async (_, {id}) => {
      let sub_array = await subscribes.findAll({where: {user_id: id}, raw: true})
      let user_array  = sub_array.map(async item => {
        return await user.findOne({where: {id: item.subscriber_id }, raw: true})
      })
      return user_array.slice(0,10)
    },
    getHintComponentFriend: async (_, {token})  => {
      let user_hint = await user.findByPk(jwd.decode(token, "LOGIN_SECRET").id)
      if (user_hint.hint) {
        let component_friend = await subscribes.findAll({where: {subscriber_id: jwd.decode(token, "LOGIN_SECRET").id}, raw: true})
        if (component_friend.length < 3) return false
        return true 
      }
      else return true
    },
    getHintComponentNumber: async (_, {token})  => {
      let user_hint = await user.findByPk(jwd.decode(token, "LOGIN_SECRET").id)
      if (user_hint.hint) {
        let component_number = await user.findByPk(jwd.decode(token, "LOGIN_SECRET").id, {raw: true})
        if (component_number.number === null || component_number.number === '') return false
        return true
      }
      else return true
    },
    getHintComponentPhoto: async (_, {token})  => {
      let user_hint = await user.findByPk(jwd.decode(token, "LOGIN_SECRET").id)
      if (user_hint.hint) {
        let component_photo = await user.findByPk(jwd.decode(token, "LOGIN_SECRET").id, {raw: true})
        if (component_photo.image_url === null || component_number.image_url === '') return false
        return true
      }
      else return true
    },
    getMainUser: async (_, {token}) => {
      return await user.findByPk(jwd.decode(token, "LOGIN_SECRET").id)
    },
    getHint: async(_, {token}) => {
      let user_check_hint = await user.findByPk(jwd.decode(token, "LOGIN_SECRET").id)
      return user_check_hint.hint
    },
    getUserPhoto: async (_, {token}) => {
      return await user.findByPk(jwd.decode(token, "LOGIN_SECRET").id);
    },
    getAction: async (_, {token}) => {
      let actions = await action.findAll({where: {action_user_id: jwd.decode(token, "LOGIN_SECRET").id}, raw: true});
      actions  = actions.map(async item => {
        let action_post = await posts.findByPk(item.post_id)
        let action_user = await user.findByPk(item.user_id)
        if (action_post) {
          item.post_id = action_post
        }
        item.user_id = action_user
        return item
      })

      return actions.reverse().slice(0,5)
    },
    getChat:async (_,{token}) => {
      let chats_id = await chat.findAll({where: {user_id: jwd.decode(token, "LOGIN_SECRET").id}})
      chats_id = chats_id.map(item => {
        return user.findByPk(item.chat_user_id)
      })
      return chats_id
    },
    //ASC DESC
    getMessages: async (_, {token, id}) => {
      let temp_message = await message.findAll({order: [['id', 'DESC'],['time', 'ASC']], limit: 20, where: {
        [Op.or]: [
          {user_id: jwd.decode(token, "LOGIN_SECRET").id, send_user_id: id},
          {send_user_id: jwd.decode(token, "LOGIN_SECRET").id, user_id: id},
        ]
         }
      })
      return temp_message.reverse()
    },
    getMessageHave:async (_, {token}) =>{
      let check_messages = await message.findOne({where: {send_user_id: jwd.decode(token, "LOGIN_SECRET").id, isRead: 0}})
      if (check_messages) return true
      else return false
    },
    getUserChat: async (_, {id}) => {
      return await user.findByPk(id)
    },
    getUserBlock: async (_, {token, id}) => {
      let blocked_user = await blocked.findOne({where: {user_id: jwd.decode(token, "LOGIN_SECRET").id, blocked_user_id: id}})
      if (blocked_user) return 'Вы добавили пользователя в черный список'
      else {
        blocked_user = await blocked.findOne({where: {user_id: id, blocked_user_id: jwd.decode(token, "LOGIN_SECRET").id}}) 
        if (blocked_user) return 'Вы у пользователя в черном списке'
        else return 'Ок'
      }
    },
    getFavourites: async (_, {token, limit, offset}) => {
      let favourites_id = await favourite.findAll({raw: true, where: {user_id: jwd.decode(token, "LOGIN_SECRET").id}, limit, offset})
      let favourites_post = favourites_id.map(async item => {
        let post = await posts.findByPk(item.post_id) 
        let comment = await comments.findAll({where: {post_id: post.dataValues.id}, raw: true});
        let user_main = await user.findByPk(post.dataValues.user_id);
        let check_like = await likes.findOne({where: {user_id: post.dataValues.user_id, post_id: post.dataValues.id}})
        console.log(comment.length);
        post.comments = comment.length
        post.user_main = user_main
        check_like ? post.liked = true : post.liked = false
        return post
      })
      return favourites_post
    },
    getPostComment: async (_, {post_id, limit, offset}) => {
      let comment = await comments.findAll({order: [['id', 'DESC']], where: {post_id: post_id}, raw: true, limit, offset});
      comment = comment.map(async item => {
        let user_send = await user.findOne({where: {id: item.user_id}});
        return {...item, user_id: user_send.dataValues}
      })
      return comment.reverse()
    },
    getUserName: async (_, {id}) => {
      let username
      if (id) {
        username = await user.findByPk(id) 
        return username.name
      }
      username = 'Начните беседу'
      return username
    },

    getRecommend: async (_, {token}) => {
      let random_users = subscribes.findAll({ order: Sequelize.literal('rand()'), limit: 25, where: {subscriber_id: jwd.decode(token, "LOGIN_SECRET").id}, raw: true }).then(data => {
        let temp_id = data.map( item => {
          let kk = subscribes.findOne({where: {user_id: item.user_id}}).then(async data => await user.findOne({where: {id: data.subscriber_id}}))
          return kk
        })
        return temp_id 
      })
      return random_users
    }

  },

  Mutation: {
    registerUser: async (_, { name, nickname, email, password }) => {
      let double = await user.findAll({ where: { email: email } });
      if (double.length == 0) {
        let hash_password = bcrypt.hashSync(password, 7);
        let add_user = await user.create({
          name: name,
          nickname: nickname,
          email: email,
          password: hash_password,
          hint: 1
        });
        return add_user.dataValues;
      }
    },
    changeMainData: async (_, { token, image_url, name, nickname, email, number, site, about_me, gender }) => {
    user.update(
        {
          name: name, nickname: nickname,email: email,number: number,site: site,about_me: about_me,gender: gender,image_url: image_url,
        },
        {
          where: {
            id: jwd.decode(token, "LOGIN_SECRET").id,
          },
        }
      );

    },
    changePassword: async (_, {token, old_password, new_password}) => {
      let user_p = await user.findByPk(jwd.decode(token, "LOGIN_SECRET").id)
      try {
        if (bcrypt.compareSync(old_password, user_p.password)) {
          let hash_password_2 = bcrypt.hashSync(new_password, 7);
          user.update({password: hash_password_2}, {where: {id: jwd.decode(token, "LOGIN_SECRET").id}})
        }
        else {
          console.log('kk2');
        }
      } catch (error) {
        console.log('kek');
      }  
    },
    addPost: async (_, {token, image_path, comment_title}) => {
      await posts.create({photo_url: image_path, user_id: jwd.decode(token, "LOGIN_SECRET").id, title: comment_title}) //check 
    },
    addSearch: async (_, {token, search_id}) => {
      let search_array = await search.findAll({where: {user_id: jwd.decode(token, "LOGIN_SECRET").id}, raw: true})
      if (search_array.length > 10) {
        let delete_user = await search.findOne({where: {user_id: jwd.decode(token, "LOGIN_SECRET").id},raw: true})
        await search.destroy({where: {id: delete_user.id}})
      }
      await search.create({search_id: search_id, user_id: jwd.decode(token, "LOGIN_SECRET").id})
    },
    addSubscribe: async (_, {token, subscriber_id}) => {
      await subscribes.create({user_id: jwd.decode(token, "LOGIN_SECRET").id, subscriber_id: subscriber_id})
    },
    removeSubscribe: async (_, {token, subscriber_id}) => {  
      await subscribes.destroy({where: {user_id: jwd.decode(token, "LOGIN_SECRET").id, subscriber_id: subscriber_id}})
    },
    removeHint: async (_, {token}) => {
      await user.update({hint: 0}, {where: {id: jwd.decode(token, "LOGIN_SECRET").id}})
    },
    addAction: async (_, {token, action, user_id, post_id})  => {
      await action.create({action_user_id: jwd.decode(token, "LOGIN_SECRET").id, action: action, user_id: user_id, post_id: post_id})
    },
    addComment: async (_, {token, user_id, text, post_id}) => {
      let find_post = await posts.findByPk(post_id)
      let correct_time = moment(Date.now()).format('YYYY-MM-DD')
      await comments.create({text: text, time: correct_time, send_user_id: find_post.user_id, user_id: jwd.decode(token, "LOGIN_SECRET").id, post_id: post_id})
      if (jwd.decode(token, "LOGIN_SECRET").id != user_id) {
        await action.create({action_user_id: user_id,  user_id: jwd.decode(token, "LOGIN_SECRET").id, post_id: post_id, action: "Комментарий" })
      }
    },
    addLikePost: async(_, {token, post_id, user_id}) => {
      let check_like = await likes.findOne({where: {user_id: jwd.decode(token, "LOGIN_SECRET").id, post_id: post_id}})
      let like_post = await posts.findByPk(post_id)
      if (!check_like) {
        await posts.update({likes: like_post.likes + 1}, {where: {id:post_id}})
        await likes.create({user_id: jwd.decode(token, "LOGIN_SECRET").id, post_id: post_id})
        if (jwd.decode(token, "LOGIN_SECRET").id != user_id) {
          await action.create({action_user_id: user_id,  user_id: jwd.decode(token, "LOGIN_SECRET").id, post_id: post_id, action: "Лайк" })
        }
      } 
      else {
        await posts.update({likes: like_post.likes - 1}, {where: {id:post_id}})
        await likes.destroy({where: {user_id: jwd.decode(token, "LOGIN_SECRET").id, post_id: post_id}})
        if (jwd.decode(token, "LOGIN_SECRET").id != user_id) {
          await action.destroy({where: {action_user_id: user_id,  user_id: jwd.decode(token, "LOGIN_SECRET").id, post_id: post_id, action: "Лайк" }})
        }
      }
    },
    readAction: async (_, {token}) => {
      await action.update({is_looked: 1}, {where:  {action_user_id: jwd.decode(token, "LOGIN_SECRET").id}})
    },
    addChat: async (_,{token, id}) =>  {
      let chat_user = await chat.findOne({where:{user_id: jwd.decode(token, "LOGIN_SECRET").id, chat_user_id: id}})
      if (!chat_user) {
        await chat.create({user_id: jwd.decode(token, "LOGIN_SECRET").id, chat_user_id: id})
      }
    },
    addMessage: async (_, {token, send_user_id, text, is_image}) => {
      await message.create({user_id: jwd.decode(token, "LOGIN_SECRET").id, send_user_id, text, time: Date.now(), isRead: 0, is_image})
    },
    deleteMessage: async (_, {id}) => {
      await message.destroy({where: {id}})
    },
    makeRead: async (_, {token, send_id}) => {
      await message.update({isRead: 1}, {where: {send_user_id: jwd.decode(token, "LOGIN_SECRET").id, user_id: send_id}})
    },
    deleteChat: async (_, {id}) => {
      await chat.destroy({where: {chat_user_id: id}})
    },
    addBlock: async (_, {token, id}) => {
      await blocked.create({user_id: jwd.decode(token, "LOGIN_SECRET").id, blocked_user_id: id})
    },
    deleteBlock: async (_, {token, id}) => {
      await blocked.destroy({where: {user_id: jwd.decode(token, "LOGIN_SECRET").id, blocked_user_id: id}})
    },
    addFavourite: async (_, {token, post_id}) => {
      let check_favourite = await favourite.findOne({where: {user_id: jwd.decode(token, "LOGIN_SECRET").id, post_id}})
      if (check_favourite) {
       await favourite.destroy({where: {user_id: jwd.decode(token, "LOGIN_SECRET").id, post_id}})
      }
      else await favourite.create({user_id: jwd.decode(token, "LOGIN_SECRET").id, post_id})
    },
    deletePost: async (_, {id}) => {
      await posts.destroy({where: {id}})
    }
  },
};

module.exports = resolvers;
