<template>
  <div>
    <h1 v-if="!isLoaded" class="h1">
      Room: {{ this.$store.getters.getSessionId }}
    </h1>

    <button
      v-if="!isLoaded && this.$store.getters.getPlayerId === 0"
      class="button"
      @click="loadGame()"
      style="
        left: 50%;
        top: 50%;
        transform: translate(-50%, 300%);
      "
    >
      Start
    </button>
    <div v-if="!isLoaded" class="container">
      <div
        v-for="player in this.$store.getters.getPlayersInfo"
        :key="player"
        class="cards"
      >
        <div class="players">
          <div class="names">
            {{ player.name }}
          </div>
        </div>
      </div>
    </div>

    <game v-if="isLoaded" />
  </div>
</template>

<script>
import Game from "./Game.vue";
import { VueCookies } from "vue-cookies";

export default {
  name: "lobby",
  components: {
    Game
  },
  props: {
    gamemode: Number,
    deckSelected: Number,
    name: String,
  },
  data: () => {
    return {
      isLoaded: false,
    };
  },
  created() {
    if ($cookies.get("isGameStarted") == 1) {
      this.isLoaded = true;
    }
    this.$socket.emit("joinRoom", this.$store.getters.getSessionId);

    this.$socket.on("PlayerJoined", (session) => {
      this.$store.dispatch("updatePlayerInfo", {
        sessionId: this.$store.getters.getSessionId,
        players: session.players
      });
    });

    this.$socket.on("launchGame", () => {
      this.$store.dispatch("retrieveSession", {
        sessionId: this.$store.getters.getSessionId
      }).then(() => {
        this.isLoaded = true;
      });
    });
  },
  methods: {
    loadGame() {
      $cookies.set("isGameStarted", 1, -1);
      this.$store
        .dispatch("distributeCards", {
          sessionId: this.$store.getters.getSessionId,
        })
        .then(() => {
          this.$socket.emit("gameStarted", this.$store.getters.getSessionId);
          if (this.gamemode == 1) {
            this.$store.dispatch("initBlackjack").then(() => {
              this.isLoaded = true;
            });
          } else {
            this.isLoaded = true;
          }
        });
    },
  },
};
</script>

<style scoped>
.container {
  margin-top: 15%;
  overflow: none;
  display: grid;
  grid-template-columns: auto auto auto;
  justify-content: space-around;
}

.players {
  border-radius: 30px;
  width: 150px;
  height: 150px;
  margin-top: 20%;
  background-image: url("../assets/blank-profile-picture.png");
  background-size: contain;
  background-repeat: no-repeat;
  padding: 10px;
}

.names {
  transform: translate(150%, 100%);
  padding-top: 10px;
  font-size: larger;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: bold;
}
</style>
