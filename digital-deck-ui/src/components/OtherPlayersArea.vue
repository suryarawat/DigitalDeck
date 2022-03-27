<template>
  <div class="other-players-area">
    <div v-for="player in otherPlayers">
      <div class="player-info">
        <span class="names">{{player.playerName}}</span>
        <br/>
        <span class="cards">{{player.cards}} X </span><img :src="cardImage()"/>
      </div>
    </div>
  </div>
</template>

<script>
import CardDeckImageEnum from "./CardDeckImageEnum.js";

export default {
  name: "other-players-area",
  data:  () => {
    return {otherPlayers: [
      {'playerName': 'Player 1', 'cards': 5},
      {'playerName': 'Player 2', 'cards': 8},
      {'playerName': 'Player 3', 'cards': 2},
      {'playerName': 'Player 4', 'cards': 6},
      {'playerName': 'Player 5', 'cards': 3},
      {'playerName': 'Plawerwwerwewrewerwerwerrwerwerwerwererwrewrewrwyer 1', 'cards': 5},
      {'playerName': 'Player 2', 'cards': 8},
      {'playerName': 'Player 3', 'cards': 2},
      {'playerName': 'Player 4', 'cards': 6},
      {'playerName': 'Player 1', 'cards': 5},
      {'playerName': 'Player 2', 'cards': 8},
      {'playerName': 'Player 3', 'cards': 2},
      {'playerName': 'Player 4', 'cards': 6},
      {'playerName': 'Player 5', 'cards': 3}
    ]}
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
  position: fixed;
  font-size: 20px;
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
    padding-right: 50px;
 }
</style>
