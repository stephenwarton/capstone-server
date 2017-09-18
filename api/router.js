const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { extract } = require('article-parser');

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
	if (!isNaN(req.params.id)) {
		queries.getArticlesByUserId(req.params.id).then(articles => {
		res.json(articles);
	});
	} else {
		next(new Error('Invalid ID'));
	}
});

router.get('/users/:id/playlists', authMiddleware.allowAccess, (req, res, next) => {
	if (!isNaN(req.params.id)) {
		queries.getPlaylistsByUserId(req.params.id).then(playlists => {
      res.json(playlists);
    });
	} else {
		next(new Error('Invalid ID'));
	}
});

router.post('/article', authMiddleware.allow, (req, res, next) => {
  let url = req.body.url;

  extract(url).then((parsedArticle) => {
    let article = {
      users_id: req.body.users_id,
      title: parsedArticle.title,
      content: parsedArticle.content,
      url: url
    };
    queries.createArticle(article).then(response => {
      res.json(response);
    });
  }).catch((err) => {
      next(new Error(err));
  });
});

router.post('/playlist', authMiddleware.allow, (req, res, next) => {
  let playlist = {
    users_id: req.body.users_id,
    name: req.body.name
  };

  queries.createPlaylist(playlist).then(response => {
    res.json(response);
  }).catch((err) => {
      next(new Error(err));
  });
});

router.delete('/article/:id', authMiddleware.allow, (req, res, next) => {
  queries.deleteArticle(req.params.id).then(response => {
    res.json(response);
  }).catch((err) => {
      next(new Error(err));
  });
});

module.exports = router;
