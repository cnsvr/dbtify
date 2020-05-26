# DBtify

## This is a database project about DBMS

- [x] Create server
- [x] Create SQL database connection with mysql package
- [x] Create sql database and tables
- [x] Login and Sign Up authentication for listener and artist
- [x] JWT authentication
- [x] Artists shall be able to add/update/delete albums.
  * -[x] add album with /:artist_name
  * -[x] update song album /:artist_name/:album_id
  * -[x] delete album with /:artist_name/:album_id
- [ ] Artists shall be able to add/update/delete songs in the albums.
  * -[x] add song with /:artist_name/:album_id
  * -[x] update song with /:artist_name/:song_id
  * -[x] delete song with /:artist_name/:song_id
  * -[ ] can title of song be duplicate?
- [x] Listeners shall be able to separately view all songs, albums, and artists in DBtify.Listeners shall be able to view all songs and albums of an artist.
  * -[x] view all songs
  * -[x] view all albums
  * -[x] view all artist
  * -[x] view all songs of artist
  * -[x] view all albums of artist
- [x] Listeners shall be able to view all songs of an album.
- [ ] Listeners shall be able to like songs and albums.
  * -[x] like songs with song_id ? listener only likes song once or more ?
  * -[ ] like albums with album_id ? listener only likes album once or more?
  * -[x] After listener likes song, insert this song to liked_song with listener username once.
- [x] Listeners shall be able to view other listeners’ liked songs as well as his/her liked songs.
- [x] Listeners shall be able to view popular songs (according to number of likes) of an artist.
- [ ] Listeners shall be able to rank all artists by the total number of likes of their songs.
- [x] Listeners shall be able to view songs of a specific genre.
  -[x] "SELECT * FROM song JOIN album ON song.album_id = album.album_id AND album.genre = ${genre}";
- [x] Listeners shall be able to search a keyword and view the songs that contain this keyword in their titles.
- [ ] Listeners shall be able to view the artists who produced a song together. This must be implemented as a stored procedure. Parameters of this procedure are the artist’s name and surname.
- [ ] The system shall have three triggers:
  * - [ ] When an album is deleted, all the songs in this album must also be deleted.
  * - [ ] When a song is deleted, it must be removed from listeners’ likes.
  * - [ ] When a listener likes an album, all the songs of this album must also be liked by that listener.