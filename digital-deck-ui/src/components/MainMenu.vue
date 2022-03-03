<template>
  <div class=".menu">
    <div v-if="!isLoaded">
      <input v-model.number="deckSelected" type="number" />
      <input v-model.number="cardsPerPlayer" type="number" />
      <input v-model.number="cardsOnTable" type="number" />
      <button @click="submitForm">Start</button>
      <p v-for="error of v$.$errors" :key="error.$uid">
        <strong>{{ error.$validator }}</strong>
        <small> on property</small>
        <strong>{{ error.$property }}</strong>
        <small> says:</small>
        <strong>{{ error.$message }}</strong>
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
  name: "menu",
  setup() {
    return {
        v$: useVuelidate(),
        //cookies$: VueCookies()
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
      let currId = $cookies.get('SessionId');
      if (currId != null && currId != -1){console.log('restore session');}
      else{$cookies.set('SessionId', -1, '1h');}  //return this
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
        this.$store.dispatch("initSession", {
            decks: this.deckSelected,
            cardsPerPlayer: this.cardsPerPlayer,
            cardsOnTable: this.cardsOnTable,
        }).finally(() => {
          this.isLoaded = true;
        });
      }
    },
  },
};
</script>

<style scoped>
.menu {
  height: 100%;
  padding: 5vh 5vh 0;
  text-align: center;
  align-items: center;
}
</style>
