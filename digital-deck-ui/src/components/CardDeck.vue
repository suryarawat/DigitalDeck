<template>
    <div v-if="$store.getters.getNumCardsInDeck > 0"
         class="card-deck"
         :style="'background-image: url(\'' + deckImage + '\')'"
         @click="drawCard" />
</template>

<script>
import CardDeckImageEnum from './CardDeckImageEnum.js';

export default {
    name: 'card-deck',
    data: () => {
        return {
            CardDeckImageEnum
        };
    },
    computed: {
        deckImage() {
            let numCards = this.$store.getters.getNumCardsInDeck;

            if (numCards >= 26) return CardDeckImageEnum.FULL;
            else if (numCards > 5) return CardDeckImageEnum.HALF;
            else if (numCards === 5) return CardDeckImageEnum.FIVE;
            else if (numCards === 4) return CardDeckImageEnum.FOUR;
            else if (numCards === 3) return CardDeckImageEnum.THREE;
            else if (numCards === 2) return CardDeckImageEnum.TWO;
            else return CardDeckImageEnum.ONE;
        }
    },
    methods: {
        drawCard() {
            if (this.$store.getters.getNumCardsInDeck > 0) {
                this.$store.dispatch('drawCards');
            }
        }
    }
};
</script>

<style scoped>
.card-deck {
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    cursor: pointer;
}
</style>