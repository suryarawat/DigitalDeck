<template>
  <div
    class="hand-area"
    :class="{ 'blackjack' : this.$store.getters.getGamemode === 1 }">
    <status v-if="this.$store.getters.getGamemode === 1" />
    <player-hand />
    <card-deck />
  </div>
</template>

<script>
import CardDeck from "./CardDeck.vue";
import PlayerHand from "./PlayerHand.vue";
import Status from './Status.vue';

export default {
  name: "hand-area",
  components: {
    CardDeck,
    PlayerHand,
    Status
  }
};
</script>

<style scoped>
.hand-area {
  display: grid;
  grid-template-columns: 9fr 1fr;
  height: 100%;
}

.blackjack {
  grid-template-columns: 1fr 8fr 1fr;
}
</style>
