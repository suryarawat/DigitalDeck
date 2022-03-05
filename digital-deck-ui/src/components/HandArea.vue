<template>
  <div class="hand-area">
    <player-hand />
    <card-deck />
  </div>
</template>

<script>
import CardDeck from "./CardDeck.vue";
import PlayerHand from "./PlayerHand.vue";

export default {
  name: "hand-area",
  components: {
    CardDeck,
    PlayerHand,
  },
};
</script>

<style scoped>
.hand-area {
  display: grid;
  grid-template-columns:9fr 1fr;
  height: 100%;
}
</style>
