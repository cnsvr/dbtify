<template>
  <div>
    <Navigation v-bind:form="user.user" v-bind:user="user"></Navigation>
    <h1 class="text-center pt-5">Dashboard</h1>
    <div v-if="errorMessage" ref="message" class="alert alert-danger pa-3 ma-3" role="alert">
      {{ errorMessage }}
    </div>
    <template>
      <div class="pa-5">
        <v-btn rounded color="primary" :loading="loading"
          :disabled="loading" dark class="mr-3"
          @click="loader = 'loading'; getmyLikedSong(); myLikeTable= !myLikeTable;">
          My Liked Song</v-btn>
        <v-btn rounded color="primary" :loading="loading2"
          :disabled="loading2" dark class="mr-3"
          @click="loader = 'loading2'; getListeners(); listenerTable=!listenerTable;">
          Other Listeners</v-btn>
        <v-btn rounded color="primary" @click="getPopularArtists();popularArtists=!popularArtists;">
          GET POPULAR ARTISTS
        </v-btn>
      </div>
      <template>
        <div class="ma-3 pa-3" >
          <v-row align="start">
            <v-col cols="12" sm="3">
              <v-select
                    :items="artists"
                    v-model="selectedItems"
                    label="Artists"
                    return-object
                    dense
                    solo
                  ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="2">
              <v-btn rounded @click="getArtistPopularSongs(); artistPopular=!artistPopular;"
                color="primary">GET POPULAR SONGS</v-btn>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-btn rounded
                @click="getContributorsArtist();"
                color="primary">GET CONTRIBUTERS</v-btn>
            </v-col>
          </v-row>
          <v-row align="start">
            <v-col cols="12" sm="6" md="3">
              <v-text-field
                label="Search with Genre"
                solo
                clearable
                v-model="songGenre"
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="2">
              <v-btn rounded
                @click="getGenreSong();"
                color="primary">GET SONGS</v-btn>
            </v-col>
          </v-row>
        </div>
        <div class="ma-3 pa-3">
          <v-row align="start">
            <v-col cols="12" sm="6" md="3">
              <v-text-field
                label="Search with Title"
                solo
                clearable
                v-model="songTitle"
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="2">
              <v-btn rounded
                @click="getTitleSong();"
                color="primary">GET SONGS</v-btn>
            </v-col>
          </v-row>
        </div>
      </template>
      <div v-if="contributersTable" class="ma-3 pa-3">
        <v-data-table
          :items="contributers" :headers="contributersHeaders"
            no-data-text="No contributers found.">
          <template v-slot:top>
            <v-toolbar flat color="#5C6BC0">
              <v-toolbar-title>Contributers of {{selectedItems}}</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn rounded color="primary"
              @click="contributersTable=!contributersTable">Close Tab</v-btn>
            </v-toolbar>
          </template>
        </v-data-table>
      </div>
      <div v-if="titleSongsTable" class="ma-3 pa-3">
        <v-data-table
          :items="titleSongs" :headers="titleSongsHeaders"
            no-data-text="No songs found.">
          <template v-slot:top>
            <v-toolbar flat color="#5C6BC0">
              <v-toolbar-title>Songs</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn rounded color="primary"
              @click="titleSongsTable=!titleSongsTable">Close Tab</v-btn>
            </v-toolbar>
          </template>
        </v-data-table>
      </div>
      <div v-if="genreSongsTable" class="ma-3 pa-3">
        <v-data-table
          :items="genreSongs" :headers="genreSongsHeaders"
            no-data-text="No songs found.">
          <template v-slot:top>
            <v-toolbar flat color="#5C6BC0">
              <v-toolbar-title>Songs in {{songGenre.toUpperCase()}} genre</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn rounded color="primary"
              @click="genreSongsTable=!genreSongsTable">Close Tab</v-btn>
            </v-toolbar>
          </template>
        </v-data-table>
      </div>
      <div v-if="popularArtists" class="ma-3 pa-3">
        <v-data-table
          :items="popularArtistsList" :headers="popularArtistsHeaders"
            no-data-text="No artists found.">
          <template v-slot:top>
            <v-toolbar flat color="#5C6BC0">
              <v-toolbar-title>Popular Artist</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn rounded color="primary"
              @click="popularArtists=!popularArtists">Close Tab</v-btn>
            </v-toolbar>
          </template>
        </v-data-table>
      </div>
      <div v-if="artistPopular" class="ma-3 pa-3">
        <v-data-table
          :items="artistPopularSongs" :headers="artistPopularSongsHeaders"
            no-data-text="No songs found.">
          <template v-slot:top>
            <v-toolbar flat color="#5C6BC0">
              <v-toolbar-title>{{selectedItems.toUpperCase()}}'s Popular Songs</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn rounded color="primary" @click="artistPopular=!artistPopular">Close Tab</v-btn>
            </v-toolbar>
          </template>
        </v-data-table>
      </div>
      <div v-if="myLikeTable" class="ma-3 pa-3">
        <v-data-table :items="myLikedSong" :headers="myLikedSongHeaders">
          <template v-slot:top>
            <v-toolbar flat color="#5C6BC0">
              <v-toolbar-title>My Liked Songs</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn rounded color="primary" @click="myLikeTable=!myLikeTable">Close Tab</v-btn>
            </v-toolbar>
          </template>
        </v-data-table>
      </div>
      <div v-if="listenerTable" class="ma-3 pa-3">
        <v-data-table  :items="listeners" :headers="listenersHeaders"
          class="elevation-1" item-key="username"
          @item-expanded="showListenerLikedSong" :single-expand=true
          show-expand
          expand-icon="mdi-information"
          no-data-text="No users found.">
          <template v-slot:top>
            <v-toolbar flat color="#5C6BC0">
              <v-toolbar-title>Listener List</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn rounded color="primary" @click="listenerTable=!listenerTable">Close Tab</v-btn>
            </v-toolbar>
          </template>
          <template v-slot:expanded-item="{ headers,item }">
            <td :colspan="headers.length" class="ma-5 pa-5">
              <v-data-table :items="otherListenerSong"
              :headers="otherListenerSongHeader" :items-per-page="5"
              class="elevation-1"
              no-data-text="User haven't liked any songs yet.">
                <template v-slot:top>
                  <v-toolbar flat color="success">
                    <v-toolbar-title>{{item.username}}'s Liked Songs</v-toolbar-title>
                    <v-spacer></v-spacer>
                  </v-toolbar>
                </template>
              </v-data-table>
            </td>
          </template>
        </v-data-table>
      </div>
    </template>
  </div>
</template>

<script>
import Navigation from './Navigation.vue';

const API_URL = 'http://localhost:5000/';
const LIKED_SONG_URL = 'http://localhost:5000/api/v1/liked_songs';
const LISTENERS_URL = 'http://localhost:5000/api/v1/listeners';
const SONG_URL = 'http://localhost:5000/api/v1/songs';
const ARTIST_URL = 'http://localhost:5000/api/v1/artists';

export default {
  components: {
    Navigation,
  },
  data: () => ({
    loader: null,
    loading: false,
    loading2: false,
    user: {
      user: '',
      role: '',
    },
    myLikeTable: false,
    listenerTable: false,
    artistPopular: false,
    popularArtists: false,
    genreSongsTable: false,
    titleSongsTable: false,
    contributersTable: false,
    songGenre: '',
    songTitle: '',
    errorMessage: '',
    listeners: [],
    listenersHeaders: [
      {
        text: 'Username',
        align: 'start',
        sortable: false,
        value: 'username',
      },
      {
        text: 'Email', align: 'start', value: 'email', sortable: false,
      },
      {
        text: 'Details', align: 'start', value: 'data-table-expand', sortable: false,
      },
    ],
    myLikedSong: [],
    myLikedSongHeaders: [
      {
        text: 'Song ID',
        align: 'center',
        sortable: false,
        value: 'song_id',
      },
      {
        text: 'Title', align: 'center', value: 'title', sortable: false,
      },
      {
        text: 'Album ID', align: 'center', value: 'album_id', sortable: false,
      },
      {
        text: 'Artist', align: 'center', value: 'artist_name', sortable: false,
      },
      { text: 'Likes', align: 'center', value: 'number_of_likes' },
    ],
    otherListenerSong: [],
    otherListenerSongHeader: [
      {
        text: 'Song ID',
        align: 'center',
        sortable: false,
        value: 'song_id',
      },
      {
        text: 'Title', align: 'center', value: 'title', sortable: false,
      },
      {
        text: 'Album ID', align: 'center', value: 'album_id', sortable: false,
      },
      {
        text: 'Artist', align: 'center', value: 'artist_name', sortable: false,
      },
      { text: 'Likes', align: 'center', value: 'number_of_likes' },
    ],
    selectedItems: [],
    artists: [],
    artistPopularSongs: [],
    artistPopularSongsHeaders: [
      {
        text: 'Song ID',
        align: 'center',
        sortable: false,
        value: 'song_id',
      },
      {
        text: 'Title', align: 'center', value: 'title', sortable: false,
      },
      {
        text: 'Album ID', align: 'center', value: 'album_id', sortable: false,
      },
      {
        text: 'Likes', align: 'center', value: 'number_of_likes', sortable: false,
      },
    ],
    popularArtistsList: [],
    popularArtistsHeaders: [
      {
        text: 'Artist',
        align: 'start',
        sortable: false,
        value: 'artist_name',
      },
      {
        text: 'Likes', align: 'start', value: 'number_of_likes', sortable: false,
      },
    ],
    genreSongs: [],
    genreSongsHeaders: [
      {
        text: 'Song ID',
        align: 'center',
        sortable: false,
        value: 'song_id',
      },
      {
        text: 'Title', align: 'center', value: 'title', sortable: false,
      },
      {
        text: 'Album ID', align: 'center', value: 'album_id', sortable: false,
      },
      {
        text: 'Artist', align: 'center', value: 'artist_name', sortable: false,
      },
      {
        text: 'Likes', align: 'center', value: 'number_of_likes', sortable: false,
      },
    ],
    titleSongs: [],
    titleSongsHeaders: [
      {
        text: 'Song ID',
        align: 'center',
        sortable: false,
        value: 'song_id',
      },
      {
        text: 'Title', align: 'center', value: 'title', sortable: false,
      },
      {
        text: 'Album ID', align: 'center', value: 'album_id', sortable: false,
      },
      {
        text: 'Artist', align: 'center', value: 'artist_name', sortable: false,
      },
      {
        text: 'Likes', align: 'center', value: 'number_of_likes', sortable: false,
      },
    ],
    contributers: [],
    contributersHeaders: [
      {
        text: 'Song ID',
        align: 'center',
        sortable: false,
        value: 'song_id',
      },
      {
        text: 'Title', align: 'center', value: 'title', sortable: false,
      },
      {
        text: 'Contributers', align: 'center', value: 'contributers', sortable: false,
      },
    ],
  }),
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
            this.artists.push(`${result.artist_name} ${result.artist_surname}`);
          });
          // console.log(this.artists);
        }
      });
  },
  watch: {
    loader() {
      const l = this.loader;
      this[l] = !this[l];

      setTimeout(() => { (this[l] = false); }, 1000);

      this.loader = null;
    },
  },
  methods: {
    getmyLikedSong() {
      fetch(`${LIKED_SONG_URL}/${this.user.user}`, {
        method: 'GET',
        headers: {
          authorization: `Bearer ${localStorage.token}`,
        },
      }).then((res) => res.json())
        .then((result) => {
          // console.log(result.result);
          this.myLikedSong = result.result;
          // console.log(this.songItems);
        });
    },
    getListeners() {
      fetch(`${LISTENERS_URL}`, {
        method: 'GET',
        headers: {
          authorization: `Bearer ${localStorage.token}`,
        },
      }).then((res) => res.json())
        .then((result) => {
          // console.log(result.result);
          const listeners = result.result.filter((element) => element.username !== this.user.user);
          this.listeners = listeners;
        });
    },
    showListenerLikedSong(item) {
      fetch(`${LIKED_SONG_URL}/${item.item.username}`, {
        method: 'GET',
        headers: {
          authorization: `Bearer ${localStorage.token}`,
        },
      }).then((res) => res.json())
        .then((result) => {
          // console.log(result.result);
          this.otherListenerSong = result.result;
          // console.log(this.songItems);
        });
    },
    getArtistPopularSongs() {
      fetch(`${SONG_URL}/${this.selectedItems.split(' ')[0]}/popular`, {
        method: 'GET',
        headers: {
          authorization: `Bearer ${localStorage.token}`,
        },
      }).then((res) => res.json())
        .then((result) => {
          // console.log(result.result);
          this.artistPopularSongs = result.result;
        });
    },
    getPopularArtists() {
      fetch(`${ARTIST_URL}/popular`, {
        method: 'GET',
        headers: {
          authorization: `Bearer ${localStorage.token}`,
        },
      }).then((res) => res.json())
        .then((result) => {
          // console.log(result.result);
          this.popularArtistsList = result.result;
        });
    },
    getGenreSong() {
      if (this.songGenre !== '') {
        fetch(`${SONG_URL}/genres/${this.songGenre}`, {
          method: 'GET',
          headers: {
            authorization: `Bearer ${localStorage.token}`,
          },
        }).then((res) => res.json())
          .then((result) => {
          // console.log(result.result);
            this.genreSongs = result.result;
            this.genreSongsTable = !this.genreSongsTable;
          });
      } else {
        this.errorMessage = 'You have to enter a genre.!!';
        // console.log(result.message);
        setTimeout(() => {
          this.errorMessage = '';
        }, 2000);
      }
    },
    getTitleSong() {
      if (this.songTitle !== '') {
        fetch(`${SONG_URL}/search/${this.songTitle}`, {
          method: 'GET',
          headers: {
            authorization: `Bearer ${localStorage.token}`,
          },
        }).then((res) => res.json())
          .then((result) => {
            this.titleSongs = result.result;
            this.titleSongsTable = !this.titleSongsTable;
          });
      } else {
        this.errorMessage = 'You have to enter a keyword.!!';
        // console.log(result.message);
        setTimeout(() => {
          this.errorMessage = '';
        }, 2000);
      }
    },
    getContributorsArtist() {
      fetch(`${ARTIST_URL}/${this.selectedItems.split(' ')[0]}/${this.selectedItems.split(' ')[1]}`, {
        method: 'GET',
        headers: {
          authorization: `Bearer ${localStorage.token}`,
        },
      }).then((res) => res.json())
        .then((result) => {
          const co = result.result[0];
          this.contributers = co;
          this.contributersTable = !this.contributersTable;
        });
    },
  },
};
</script>

<style>
  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
