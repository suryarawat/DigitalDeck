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
      <button @click="submitForm" style="cursor: pointer;">Start</button>
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
    <button v-if="isLoaded" class="exit-button" @click="closeSession">X</button>
  </div>
</template>

<script>
import Game from "./Game.vue";
import useVuelidate from "@vuelidate/core";
import { between, requiredUnless } from "@vuelidate/validators";
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
      deckSelected: '',
      cardsPerPlayer: '',
      cardsOnTable: '',
    };
  },
  components: {
    Game,
  },
  created() {
    let currId = $cookies.get("SessionId");
    if (currId != null && currId != -1) {
      this.$store
        .dispatch("retrieveSession", {
          sessionId: currId,
        })
        .finally(() => {
          this.isLoaded = true;
        });
    } else {
      $cookies.set("SessionId", -1, "1h");
    }
  },
  validations() {
    return {
      deckSelected: {
        requiredIfFunction: requiredUnless(() => {return this.deckSelected == null;}),
        between: between(1, 10),
      },
      cardsPerPlayer: {
        requiredIfFunction: requiredUnless(() => {return this.deckSelected > 10 || this.deckSelected < 0;}),
        between: between(1, 52 * this.deckSelected),
      },
      cardsOnTable: {
        requiredIfFunction: requiredUnless(() => {return this.cardsPerPlayer != null && (this.cardsPerPlayer > 52*this.deckSelected || this.cardsPerPlayer < 0);}),
        between: between(0, 52 * this.deckSelected - this.cardsPerPlayer),
      },
    };
  },
  methods: {
    async submitForm() {
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

    closeSession() {
      $cookies.set("SessionId", -1, "1h");
      this.isLoaded = false;
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

.exit-button {
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: transparent;
  background-repeat: no-repeat;
  border: none;
  cursor: pointer;
  overflow: hidden;
  outline: none;
  color: blanchedalmond;
  font-size: 30px;
}
</style>
