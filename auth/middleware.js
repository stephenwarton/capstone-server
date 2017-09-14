const jwt = require('jsonwebtoken');

function allowAccess(req, res, next){
  const authHeader = req.get('Authorization');
  // console.log(req.signedCookies);
  console.log(authHeader);
  const token = authHeader.split(' ')[1];
  if(token){
    // verify token
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      if(!err && req.params.id == decoded.id){
        return next();
       }
      res.status(401)
      next(new Error('Un-Authorized'));
    });
  }else{
    res.status(401)
    next(new Error('Un-Authorized'))
  }
}

module.exports = {
  allowAccess
};
