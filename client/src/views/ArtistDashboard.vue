<template>
  <div>
    <Navigation v-bind:form="user.user" v-bind:user="user"></Navigation>
    <h1 class="text-center py-3">Artist Dashboard</h1>
    <template>
      <v-data-table
        :headers="headers"
        :items="albums"
        class="elevation-1"
        item-key="album_id"
        @item-expanded="getSongs"
        :single-expand=true
        show-expand
        expand-icon="mdi-information"
        no-data-text="No albums are found."
      >
        <template v-slot:top>
          <v-toolbar flat color="#5C6BC0">
            <v-toolbar-title>Albums</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                >New Album</v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <div v-if="errorMessage" ref="message" class="alert alert-danger px-5" role="alert">
                      {{ errorMessage }}
                </div>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.album_id" label="Album ID"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.title" label="Title"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.genre" label="Genre"></v-text-field>
                      </v-col>
                      <v-col v-if="editedIndex == -1" cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.song_id" label="Song ID"></v-text-field>
                      </v-col>
                      <v-col v-if="editedIndex == -1" cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.song_title"
                        label="Song Title"></v-text-field>
                      </v-col>
                      <v-col v-if="editedIndex == -1" cols="12" sm="12" md="6">
                        <v-select
                          v-model="editedItem.contributers"
                          :items="contributers"
                          return-object
                          label="Contributors of Song"
                          multiple
                          chips
                          hint="Please choose contributors if exists"
                          persistent-hint
                          ></v-select>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                  <v-btn color="blue darken-1" text @click="save">Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:expanded-item="{ headers }">
          <td :colspan="headers.length" class="ma-5 pa-5">
            <v-data-table :items="songs" :headers="headerSong" :items-per-page="5"
              class="elevation-1">
              <template v-slot:top>
                <v-toolbar flat color="success">
                  <v-toolbar-title>Songs</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-dialog v-model="songDialog" max-width="500px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="primary"
                        dark
                        class="mb-2"
                        v-bind="attrs"
                        v-on="on"
                      >New Song</v-btn>
                    </template>
                    <v-card>
                      <v-card-title>
                        <span class="headline">{{ songFormTitle }}</span>
                      </v-card-title>
                      <div v-if="errorMessage" ref="message"
                        class="alert alert-danger px-5" role="alert">
                            {{ errorMessage }}
                      </div>
                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field v-model="editedSong.song_id"
                                label="Song ID"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field v-model="editedSong.title" label="Title"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="6">
                              <v-select
                                v-model="editedSong.contributers"
                                :items="contributers"
                                label="Contributors of Song"
                                multiple
                                chips
                                return-object
                                hint="Please choose contributors if exists"
                                persistent-hint
                                ></v-select>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="closeSong">Cancel</v-btn>
                        <v-btn color="blue darken-1" text @click="saveSong">Save</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-toolbar>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="editSong(item)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteSong(item)">mdi-delete</v-icon>
              </template>
            </v-data-table>
          </td>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="editItem(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            small
            @click="deleteItem(item)"
          >
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </template>
  </div>
</template>

<script>
import Navigation from './Navigation.vue';

const API_URL = 'http://localhost:5000/';
const ARTIST_URL = 'http://localhost:5000/api/v1/artists';
const ALBUM_URL = 'http://localhost:5000/api/v1/albums';
const SONG_URL = 'http://localhost:5000/api/v1/songs';

export default {
  components: {
    Navigation,
  },
  data: () => ({
    expanded: [],
    errorMessage: '',
    user: {
      user: '',
      role: '',
    },
    songDialog: false,
    dialog: false,
    contributers: [],
    selectedContributers: [],
    headers: [
      {
        text: 'Album ID',
        align: 'start',
        sortable: false,
        value: 'album_id',
      },
      {
        text: 'Title', align: 'center', value: 'title', sortable: false,
      },
      {
        text: 'Genre', align: 'center', value: 'genre', sortable: false,
      },
      { text: 'Likes', align: 'center', value: 'number_of_likes' },
      {
        text: 'Actions', align: 'center', value: 'actions', sortable: false,
      },
      {
        text: 'Details', align: 'center', value: 'data-table-expand', sortable: false,
      },
    ],
    albums: [],
    headerSong: [
      {
        text: 'Song ID',
        align: 'center',
        sortable: false,
        value: 'song_id',
      },
      {
        text: 'Title', align: 'center', value: 'title', sortable: false,
      },
      { text: 'Likes', align: 'center', value: 'number_of_likes' },
      {
        text: 'Actions', align: 'center', value: 'actions', sortable: false,
      },
    ],
    songs: [],
    currentLike: 0,
    editedIndex: -1,
    editedItem: {
      album_id: '',
      title: '',
      genre: '',
      song_id: '',
      song_title: '',
      contributers: [],
    },
    defaultItem: {
      album_id: '',
      title: '',
      genre: '',
      song_id: '',
      song_title: '',
      contributers: [],
    },
    editedSongIndex: -1,
    editedSong: {
      song_id: '',
      title: '',
      contributers: [],
    },
    defaultSong: {
      song_id: '',
      title: '',
      contributers: [],
    },
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Album' : 'Edit Album';
    },
    songFormTitle() {
      return this.editedSongIndex === -1 ? 'New Song' : 'Edit Song';
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    songDialog(val) {
      val || this.closeSong();
    },
  },
  mounted() {
    fetch(API_URL, {
      headers: {
        authorization: `Bearer ${localStorage.token}`,
      },
    }).then((res) => res.json())
      .then((result) => {
        if (result.user) {
          // console.log(result.user);
          this.user = result.user;
          console.log(this.user);
          this.getAlbums();
        }
      });
    fetch(ARTIST_URL, {
      headers: {
        authorization: `Bearer ${localStorage.token}`,
      },
    }).then((res) => res.json())
      .then((artistResult) => {
        if (artistResult.result) {
          // console.log(artistResult);
          artistResult.result.forEach((result) => {
            if (result.artist_name !== this.user.user) {
              this.contributers.push(`${result.artist_name[0].toUpperCase()}${result.artist_name.slice(1)} ${result.artist_surname[0].toUpperCase()}${result.artist_surname.slice(1)}`);
            }
          });
          // console.log(this.artists);
        }
      });
  },
  methods: {
    getSongs(item) {
      fetch(`${SONG_URL}/${item.item.album_id}`, {
        method: 'GET',
        headers: {
          authorization: `Bearer ${localStorage.token}`,
        },
      }).then((res) => res.json())
        .then((result) => {
          // console.log(result.result);
          this.songs = result.result;
          this.editedItem = { ...item.item };
          // console.log(this.songItems);
        });
    },
    getAlbums() {
      // console.log(this.user);
      fetch(`${ALBUM_URL}/${this.user.user}`, {
        method: 'GET',
        headers: {
          authorization: `Bearer ${localStorage.token}`,
        },
      }).then((res) => res.json())
        .then((result) => {
          // console.log(result);
          this.albums = result.result;
        // console.log(this.items);
        });
    },
    editSong(item) {
      this.currentLike = item.number_of_likes;
      this.editedSongIndex = item.song_id;
      /*
      this.editedSong = {
        song_id: item.song_id,
        title: item.title,
        contributers: item.contributers.split(','),
      };
      */
      this.editedSong = { ...item };
      this.songDialog = true;
    },
    editItem(item) {
      this.editedIndex = item.albumId;
      this.editedItem = { ...item };
      this.dialog = true;
    },
    deleteSong(item) {
      if (this.songs.length === 1) {
        if (confirm('Are you sure you want to delete this item? If you delete this song, album also will be deleted.')) {
          fetch(`${SONG_URL}/${this.user.user}/${item.song_id}`, {
            method: 'DELETE',
            headers: {
              authorization: `Bearer ${localStorage.token}`,
            },
          }).then((res) => res.json())
            .then((result) => {
              if (result.message) {
              // this.errorMessage = 'You have to enter unique album ID';
                this.errorMessage = result.message;
                // console.log(result.message);
                setTimeout(() => {
                  this.errorMessage = '';
                }, 2000);
              } else {
                this.errorMessage = `Song ${item.song_id} is deleted. 😬`;
                // console.log(result.message);
                setTimeout(() => {
                  this.errorMessage = '';
                }, 2000);
                this.songs = [];
                this.closeSong();
              }
            }).then(() => {
              fetch(`${ALBUM_URL}/${this.user.user}/${this.editedItem.album_id}`, {
                method: 'DELETE',
                headers: {
                  authorization: `Bearer ${localStorage.token}`,
                },
              }).then((res) => res.json())
                .then((result) => {
                  if (result.message) {
                  // this.errorMessage = 'You have to enter unique album ID';
                    this.errorMessage = result.message;
                    // console.log(result.message);
                    setTimeout(() => {
                      this.errorMessage = '';
                    }, 2000);
                  } else {
                    this.errorMessage = `Album ${this.editedItem.album_id} is deleted. 😬`;
                    // console.log(result.message);
                    setTimeout(() => {
                      this.errorMessage = '';
                    }, 2000);
                    this.close();
                  }
                });
            });
        }
      } else if (confirm('Are you sure you want to delete this item?')) {
        fetch(`${SONG_URL}/${this.user.user}/${item.song_id}`, {
          method: 'DELETE',
          headers: {
            authorization: `Bearer ${localStorage.token}`,
          },
        }).then((res) => res.json())
          .then((result) => {
            if (result.message) {
              // this.errorMessage = 'You have to enter unique album ID';
              this.errorMessage = result.message;
              // console.log(result.message);
              setTimeout(() => {
                this.errorMessage = '';
              }, 2000);
            } else {
              this.errorMessage = `Song ${item.song_id} is deleted. 😬`;
              // console.log(result.message);
              setTimeout(() => {
                this.errorMessage = '';
              }, 2000);
              const newSongs = this.songs.filter((element) => element.song_id !== item.song_id);
              this.songs = newSongs;
              this.closeSong();
            }
          });
      }
    },
    deleteItem(item) {
      if (confirm('Are you sure you want to delete this album?')) {
        fetch(`${ALBUM_URL}/${this.user.user}/${item.album_id}`, {
          method: 'DELETE',
          headers: {
            authorization: `Bearer ${localStorage.token}`,
          },
        }).then((res) => res.json())
          .then((result) => {
            if (result.message) {
              // this.errorMessage = 'You have to enter unique album ID';
              this.errorMessage = result.message;
              // console.log(result.message);
              setTimeout(() => {
                this.errorMessage = '';
              }, 2000);
            } else {
              this.errorMessage = `Album ${item.album_id} is deleted. 😬`;
              // console.log(result.message);
              setTimeout(() => {
                this.errorMessage = '';
              }, 2000);
              this.close();
            }
          });
      }
    },
    closeSong() {
      this.songDialog = false;
      this.$nextTick(() => {
        this.editedSong = { ...this.defaultSong };
        this.editedSongIndex = -1;
        this.currentLike = 0;
      });
    },
    saveSong() {
      if (this.editedSongIndex === -1) {
        // add new song
        // console.log(this.editedItem);
        const songBody = {
          song_id: this.editedSong.song_id,
          title: this.editedSong.title,
          contributers: this.editedSong.contributers,
        };
        fetch(`${SONG_URL}/${this.user.user}/${this.editedItem.album_id}`, {
          method: 'POST',
          body: JSON.stringify(songBody),
          headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${localStorage.token}`,
          },
        }).then((res) => res.json())
          .then((result) => {
            if (result.message) {
            // this.errorMessage = 'You have to enter unique album ID';
              this.errorMessage = result.message;
              // console.log(result.message);
              setTimeout(() => {
                this.errorMessage = '';
              }, 2000);
            } else {
              this.songs.push({
                ...songBody,
                number_of_likes: 0,
              });
              this.closeSong();
            }
          });
      } else {
        const songBody = {
          song_id: this.editedSong.song_id,
          title: this.editedSong.title,
          contributers: this.editedSong.contributers,
        };
        fetch(`${SONG_URL}/${this.user.user}/${this.editedSong.song_id}`, {
          method: 'PATCH',
          body: JSON.stringify(songBody),
          headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${localStorage.token}`,
          },
        }).then((res) => res.json())
          .then((result) => {
            if (result.message) {
              // this.errorMessage = 'You have to enter unique album ID';
              this.errorMessage = result.message;
              // console.log(result.message);
              setTimeout(() => {
                this.errorMessage = '';
              }, 2000);
              // delete album maybe ?
            } else {
              this.closeSong();
              const newSongs = this.songs
                .filter((song) => song.song_id !== this.editedSong.song_id);
              this.songs = newSongs;
              this.songs.push({
                ...songBody,
                number_of_likes: this.currentLike,
              });
            }
          });
      }
    },
    close() {
      this.dialog = false;
      this.getAlbums();
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem };
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex === -1) {
        const albumBody = {
          album_id: this.editedItem.album_id,
          genre: this.editedItem.genre,
          title: this.editedItem.title,
        };
        fetch(`${ALBUM_URL}/${this.user.user}`, {
          method: 'POST',
          body: JSON.stringify(albumBody),
          headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${localStorage.token}`,
          },
        }).then((res) => res.json())
          .then((result) => {
            if (result.message) {
            // this.errorMessage = 'You have to enter unique album ID';
              this.errorMessage = result.message;
              // console.log(result.message);
              setTimeout(() => {
                this.errorMessage = '';
              }, 2000);
            } else {
              this.getAlbums();
            }
          }).then(() => {
            const songBody = {
              song_id: this.editedItem.song_id,
              title: this.editedItem.song_title,
              contributers: this.editedItem.contributers,
            };
            fetch(`${SONG_URL}/${this.user.user}/${this.editedItem.album_id}`, {
              method: 'POST',
              body: JSON.stringify(songBody),
              headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${localStorage.token}`,
              },
            }).then((res) => res.json())
              .then((result) => {
                if (result.message) {
                // this.errorMessage = 'You have to enter unique album ID';
                  this.errorMessage = result.message;
                  // console.log(result.message);
                  setTimeout(() => {
                    this.errorMessage = '';
                  }, 2000);
                // delete album maybe ?
                } else {
                  this.close();
                }
              });
          });
      } else {
        // update album only
        const albumBody = {
          album_id: this.editedItem.album_id,
          title: this.editedItem.title,
          genre: this.editedItem.genre,
        };
        fetch(`${ALBUM_URL}/${this.user.user}/${this.editedItem.album_id}`, {
          method: 'PATCH',
          body: JSON.stringify(albumBody),
          headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${localStorage.token}`,
          },
        }).then((res) => res.json())
          .then((result) => {
            if (result.message) {
              // this.errorMessage = 'You have to enter unique album ID';
              this.errorMessage = result.message;
              // console.log(result.message);
              setTimeout(() => {
                this.errorMessage = '';
              }, 2000);
              // delete album maybe ?
            } else {
              this.close();
            }
          });
      }
    },
  },
};
</script>

<style>

</style>
