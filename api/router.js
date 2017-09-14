const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const queries = require('../db/queries');
const valid = require('./validate');
const authMiddleware = require('../auth/middleware');

const router = express.Router();

router.post('/auth/login', (req,res,next) => {
	if(valid.user(req.body)){
		queries.getUserByEmail(req.body.email).then(user => {
			if(user) {
				bcrypt.compare(req.body.password, user.password).then(result => {
					if(result) {
						jwt.sign({id: user.id}, process.env.TOKEN_SECRET, (err, token) => {
							//console.log(err, token);
							res.json({
								//message: `Logged in as ${user.name}.`,
								token,
								id: user.id
							});
						});
					} else {
						next(new Error('Invalid Email/Password'));
					}
				});
			} else {
				next(new Error('Invalid Email/Password'));
			}
		});
	} else {
		next(new Error('Invalid Email/Password'));
	}
});

router.get('/users/:id/articles', authMiddleware.allowAccess, (req, res, next) => {
//router.get('/users/:id/articles', (req, res) => {
	if (!isNaN(req.params.id)) {
		queries.getArticlesByUserId(req.params.id).then(articles => {
		res.json(articles);
	});
	} else {
		res.Error(res, 500, 'Invalid ID');
	}
});

module.exports = router;
