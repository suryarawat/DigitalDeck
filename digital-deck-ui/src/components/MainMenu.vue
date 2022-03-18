<template>
  <div>
    <div v-if="!isLoaded" class="main-menu">
      <h1 class="heading">Digital Deck</h1>
      <button class="button" v-on:click="toggleForm1()">Create</button>
      <button class="button" v-on:click="toggleForm2()">Join</button>
      <br />
      <div v-if="form1" class="input-form">
        <form>
          <div class="number-box">
            <input
              v-model.number="deckSelected"
              type="number"
              min="1"
              oninput="validity.valid||(value='');"
              required=""
            />
            <label>Number of Decks</label>
          </div>

          <div class="number-box">
            <input
              v-model.number="cardsPerPlayer"
              type="number"
              min="1"
              oninput="validity.valid||(value='');"
              required=""
            />
            <label>Cards on hand</label>
          </div>

          <div class="number-box">
            <input
              v-model.number="cardsOnTable"
              type="number"
              min="1"
              oninput="validity.valid||(value='');"
              required=""
            />
            <label>Cards on table</label>
          </div>

          <button class="button" @click="submitForm">Start</button>
        </form>
      </div>

      <div v-if="form2" class="input-form">
        <div class="number-box">
          <input type="number" required="" />
          <label>Enter ID</label>
        </div>
        <button class="button">Join</button>
      </div>

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
      deckSelected: "",
      cardsPerPlayer: "",
      cardsOnTable: "",
      form1: false,
      form2: false,
      roomJoined: 0,
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
        requiredIfFunction: requiredUnless(() => {
          return this.deckSelected == null;
        }),
        between: between(1, 10),
      },
      cardsPerPlayer: {
        requiredIfFunction: requiredUnless(() => {
          return this.deckSelected > 10 || this.deckSelected < 0;
        }),
        between: between(1, 52 * this.deckSelected),
      },
      cardsOnTable: {
        requiredIfFunction: requiredUnless(() => {
          return (
            this.cardsPerPlayer != null &&
            (this.cardsPerPlayer > 52 * this.deckSelected ||
              this.cardsPerPlayer < 0)
          );
        }),
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
      this.$socket.emit('joinRoom', this.$store.getters.getSessionId);
    },

    closeSession() {
      $cookies.set("SessionId", -1, "1h");
      this.isLoaded = false;
    },

    toggleForm1() {
      this.form1 = !this.form1;
      this.form2 = false;
    },

    toggleForm2() {
      this.form2 = !this.form2;
      this.form1 = false;
    },
  },
};
</script>

<style>
@import "../assets/mainMenuStyles.css";
</style>
