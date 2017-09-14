const knex = require('./knex');

module.exports = {

  getUserByEmail(email) {
		return knex('users').where('email', email).first();
	},

  getArticlesByUserId(id){
    return knex('article').where('users_id', id);
  }

};
