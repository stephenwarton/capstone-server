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
          let grouped = groupBy(articles, 'playlist_name');
          return knex('playlist').where('playlist.users_id', id).then(result => {
            for(let item of result){
              let id = {playlist_id: item.id};
              let name = item.name;
              let isObjectInArray = false;
              for(let grouping of grouped){
                if(Object.keys(grouping)[0] === item.name){
                  isObjectInArray = true;
                }
              }
              if(!isObjectInArray){
                let newPlaylist = {};
                newPlaylist[name] = [id];
                grouped.push(newPlaylist);
              }
            }
            return grouped;
          });
      });
  },

  createArticle(article){
    return knex('article').insert(article, '*');
  },

  createPlaylist(playlist){
    return knex('playlist').insert(playlist, '*');
  },

  deleteArticle(id) {
    return knex('article').where('id', id).del();
  },

  deletePlaylist(id) {
    return knex('playlist').where('id', id).del();
  },

  addArticleToPlaylist(article_playlist){
    return knex('article_playlist').insert(article_playlist, '*');
  },

  deleteArticle_Playlist(id) {
    return knex('article_playlist').where('id', id).del();
  },

  createUser(user) {
    return knex('users').insert(user, '*');
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
