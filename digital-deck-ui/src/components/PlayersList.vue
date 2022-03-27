<template>
  <div>
    <div class="container">
      <div
        v-for="player in playersList"
        :key="player"
        class="cards"
      >
      <div class="info">
       {{player.name}} <br>
       x {{player.numOfCards}} cards
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import CardDeckImageEnum from "./CardDeckImageEnum.js";

export default {
  name: "players-list",
  computed:{
    // filters this player
    playersList : function(){
      return this.$store.getters.getPlayersInfo.filter(player => player.name != this.$store.getters.getName)
    }
  },
  methods: {
    cardImage() {
      CardDeckImageEnum.BACK.DEFAULT;
    },
    getWindowWidth() {
      return window.innerWidth - 100;
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: space-around;
}

.cards{
    background-image: url(https://i.imgur.com/RO3DOEa.jpg);
    height: 14em;
    width: 10em;
    background-size: contain;
    overflow: none;
    background-repeat: no-repeat;
}

.info{
  width: 5em;
  height: 10em;
  margin :100%;
  margin-top : 50%;
  font-size: 120%;
  font-weight: bold;
}
</style>