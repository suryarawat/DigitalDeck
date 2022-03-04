<template>
  <div>
    <div v-if="!isLoaded" class="main-menu">
      <h1>Digital Deck</h1>
      <br />
      <span>Decks</span><br />
      <input v-model.number="deckSelected" type="number" /><br />
      <span>Cards on hand</span><br />
      <input v-model.number="cardsPerPlayer" type="number" /><br />
      <span>Cards on table</span><br />
      <input v-model.number="cardsOnTable" type="number" /><br /><br />
      <button @click="submitForm">Start</button>
      <p v-for="error of v$.$errors" :key="error.$uid">
        <strong>{{ error.$message }}</strong>
        <span v-if="error.$property === 'cardsPerPlayer'"
          ><strong> for cards on hand</strong></span
        >
        <span v-else-if="error.$property === 'cardsOnTable'"
          ><strong> for cards on table</strong></span
        >
        <span v-else><strong> for number of decks</strong></span>
      </p>
    </div>
    <game v-if="isLoaded" />
  </div>
</template>

<script>
import Game from "./Game.vue";
import useVuelidate from "@vuelidate/core";
import { between } from "@vuelidate/validators";
import { VueCookies } from "vue-cookies";

export default {
  name: "main-menu",
  setup() {
    return {
      v$: useVuelidate(),
    };
  },
  data: () => {
    return {
      isLoaded: false,
      deckSelected: 1,
      cardsPerPlayer: 0,
      cardsOnTable: 0,
      possibleDecks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    };
  },
  components: {
    Game,
  },
  created() {
    let currId = $cookies.get("SessionId");
    if (currId != null && currId != -1) {
      console.log("restore session");
      //this.isLoaded = true;
    } else {
      $cookies.set("SessionId", -1, "1h");
    }
  },
  validations() {
    return {
      deckSelected: {
        between: between(1, 10),
      },
      cardsPerPlayer: {
        between: between(1, 52 * this.deckSelected),
      },
      cardsOnTable: {
        between: between(0, 52 * this.deckSelected - this.cardsPerPlayer),
      },
    };
  },
  methods: {
    async submitForm() {
      console.log(this.cardsOnTable);
      console.log(this.cardsPerPlayer);
      console.log(this.deckSelected);
      const isFormCorrect = await this.v$.$validate();
      if (!isFormCorrect) {
        return;
      } else {
        this.$store
          .dispatch("initSession", {
            decks: this.deckSelected,
            cardsPerPlayer: this.cardsPerPlayer,
            cardsOnTable: this.cardsOnTable,
          })
          .finally(() => {
            this.isLoaded = true;
          });
      }
    },
  },
};
</script>

<style scoped>
.main-menu {
  height: 100%;
  padding: 10% 5% 0;
  text-align: center;
  align-items: center;
}
</style>
