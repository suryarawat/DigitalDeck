<template>
  <div
    v-if="$store.getters.getNumCardsInDeck > 0"
    class="card-deck"
    :class="{ 'disabled': isDisabled }"
    :style="'background-image: url(\'' + deckImage + '\');'"
    @click="drawCard"
  />
</template>

<script>
import CardDeckImageEnum from "./CardDeckImageEnum.js";

export default {
  name: "card-deck",
  data: () => {
    return {
      CardDeckImageEnum,
    };
  },
  mounted() {
    this.$socket.on("cardDrawn", ({ deck }) => {
        this.$store.commit('setCardsInDeck', deck);
    });
  },
  computed: {
    deckImage() {
      let numCards = this.$store.getters.getNumCardsInDeck;

      if (numCards >= 26) return CardDeckImageEnum.BACK.FULL;
      else if (numCards > 5) return CardDeckImageEnum.BACK.HALF;
      else if (numCards === 5) return CardDeckImageEnum.BACK.FIVE;
      else if (numCards === 4) return CardDeckImageEnum.BACK.FOUR;
      else if (numCards === 3) return CardDeckImageEnum.BACK.THREE;
      else if (numCards === 2) return CardDeckImageEnum.BACK.TWO;
      else return CardDeckImageEnum.BACK.ONE;
    },

    isDisabled() {
      return this.$store.getters.getGamemode === 1 && !this.$store.getters.isCurrentTurn;
    }
  },
  methods: {
    drawCard() {
      if (this.$store.getters.getNumCardsInDeck > 0 && !this.isDisabled) {
        this.$store.dispatch("drawCards").then(() => {
            this.$socket.emit("drawCard", {
                sessionId: this.$store.getters.getSessionId,
                numCards: this.$store.getters.getNumCardsInDeck,
                player: {   // for player card display synchronization
                    name: this.$store.getters.getName,
                    numCards: this.$store.getters.getPlayerCards.length
                }
            });
        });
      }
    },

    getPosition() {
      return (window.innerWidth * 3) / 4;
    },
  },
};
</script>

<style scoped>
.card-deck {
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  cursor: pointer;
}

.disabled {
  opacity: 50%;
  cursor: default;
}
</style>
