<template>
  <div>
    <button
      v-if="!isLoaded"
      class="button"
      @click="loadGame()"
      style="
        postion: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, 300%);
      "
    >
      Start
    </button>
    <!-- <players-list v-if="!isLoaded" style="transform: translate(0%, 50%)" /> -->
    <div v-if="!isLoaded" class="container" >
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
import PlayersList from "./PlayersList.vue";

export default {
  name: "lobby",
  components: {
    Game,
    PlayersList,
  },
  data: () => {
    return {
      isLoaded: false,
    };
  },
  methods: {
    loadGame() {
      this.isLoaded = true;
    },
  },
};
</script>

<style scoped>
.container {
  margin-top: 20%;
  overflow: none;
  display: grid;
  grid-template-columns: auto auto auto;
  justify-content: space-around;
}

.players {
  border-radius: 30px;
  width: 100%;
  height: 100%;
  margin-top: 130%;
  background-image: url("../assets/blank-profile-picture.png");
  background-size: contain;
  background-repeat: no-repeat;

  padding: 10px;
}

.names{
  transform: translate(140%, 100%);
  font-size: larger;
  font-weight: bold;
  color: grey;
}
</style>
