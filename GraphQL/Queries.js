let { user, posts, comments, search, subscribes } = require("../models");
let jwd = require("jsonwebtoken");
let bcrypt = require("bcryptjs");

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

    getPosts: async (_, {id}) => {
      let post_array = await posts.findAll({where: {user_id: id}, raw: true});
      let post_comment = await post_array.map(async item =>  {
        let comment_array = await comments.findAll({where: {post_id: item.id}, raw: true});
        item.comments = comment_array       
        return item
      })
      return post_comment
    },

    getPost: async (_, {token, id}) =>  {
      console.log(_);
      let post = await posts.findByPk(id)
      let comment = await comments.findAll({where: {post_id: post.dataValues.id}, raw: true});
      let user_main = await user.findByPk(jwd.decode(token, "LOGIN_SECRET").id);
      post.dataValues.comments = comment
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
      return user_array
    },
    getSubscribtion: async (_, {id}) => {
      let sub_array = await subscribes.findAll({where: {user_id: id}, raw: true})
      let user_array  = sub_array.map(async item => {
        return await user.findOne({where: {id: item.subscriber_id }, raw: true})
      })
      return user_array
    },
    getHintComponentFriend: async (_, {token})  => {
      let component_friend = await subscribes.findAll({where: {subscriber_id: jwd.decode(token, "LOGIN_SECRET").id}, raw: true})
      if (component_friend.length < 3) return false
      return true
    },
    getHintComponentNumber: async (_, {token})  => {
      let component_number = await user.findByPk(jwd.decode(token, "LOGIN_SECRET").id, {raw: true})
      if (component_number.number === null || component_number.number === '') return false
      return true
    },
    getHintComponentPhoto: async (rrr, {token}, tt, uu)  => {
      console.log(uu);
      let component_photo = await user.findByPk(jwd.decode(token, "LOGIN_SECRET").id, {raw: true})
      if (component_photo.image_url === null || component_number.image_url === '') return false
      return true
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
    addComment: async (_, {token, time, text, post_id}) => {
      await comments.create({text: text, time: time, user_id: jwd.decode(token, "LOGIN_SECRET").id, post_id: post_id})
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
    }


  },
};

module.exports = resolvers;
