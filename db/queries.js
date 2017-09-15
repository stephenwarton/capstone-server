const knex = require('./knex');

module.exports = {

  getUserByEmail(email) {
		return knex('users').where('email', email).first();
	},

  getArticlesByUserId(id){
    return knex('article').where('users_id', id);
  },

  getPlaylistsByUserId(id){
    return knex('playlist').where('playlist.users_id', id)
      .join('article_playlist', 'article_playlist.playlist_id', '=', 'playlist.id')
      .join('article', 'article.id', '=', 'article_playlist.article_id')
      .select('article_playlist.id as id',
              'article_playlist.article_id',
              'article_playlist.playlist_id',
              'playlist.name as playlist_name',
              'article.title as article_title',
              'article.content as article_content',
              'article.url as article_url')
      .then(articles => {
          return groupBy(articles, 'playlist_name');
      });
  }
};

function groupBy(items, prop) {
  let grouped = {};
  for(let item of items){
    let newKey = item[prop];
    if(grouped.hasOwnProperty(newKey)){
      grouped[newKey].push(item);
    } else {
      grouped[newKey] = [];
      grouped[newKey].push(item);
    }
  }
  let array = [];
  for(let group in grouped){
    let object = {};
    object[group] = grouped[group];
    //console.log(grouped[group]);
    array.push(object);
  }
  return array;
}
