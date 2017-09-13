const knex = require('./knex');

module.exports = {

  getUserByEmail(email) {
		return knex('users').where('email', email).first();
	}

};
