<template>
  <div class="other-players-area">
    <div class="player-info" v-for="player in playersList">
        <span class="names">{{player.name}}</span>
        <br/>
        <span class="cards">{{player.numOfCards}} X </span><img :src="cardImage()"/>
    </div>
  </div>
</template>

<script>
import CardDeckImageEnum from "./CardDeckImageEnum.js";

export default {
  name: "other-players-area",
  computed:{
    // filters this player
    playersList : function(){
      return this.$store.getters.getPlayersInfo.filter(player => player.name != this.$store.getters.getName)
    }
  },
  methods: {
    cardImage() {
      return CardDeckImageEnum.BACK.ONE;
    },

    playersList(){
      return otherPlayers;
    }
  },
  components: {
  },
};
</script>

<style scoped>
.other-players-area {
  top: 3%;
  left: 2%;
  width: 100%;
  height: 150px;
  font-size: 20px;
  overflow: auto;
  overflow-y: hidden;
  overflow-x: auto;
}

img{
  height: 100px;
  width: 60px;
}

.cards{
  top: -55px;
}

.names{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display:inline-block;
  width : 100px;
  left: 15px;
 }

 .player-info{
    float: left;
    padding-right: 30px;
 }
</style>
