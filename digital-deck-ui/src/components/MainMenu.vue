<template>
  <div>
    <div v-show="!isLoaded" class="main-menu">
      <h1 class="heading">Digital Deck</h1>
      <button class="button" v-on:click="toggleCreateForm()">Create</button>
      <button class="button" v-on:click="toggleJoinForm()">Join</button>
      <br />
      <div v-if="createForm" class="input-form">
        <div class="select-box">
          <label>Gamemode</label>
          <div class="select-gamemode">
            <select v-model="gamemode">
              <option :value="0">Default</option>
              <option :value="1">Blackjack</option>
            </select>
          </div>
        </div>

        <div class="number-box">
          <input v-model="name"
          type="text"
          required=""
          />
          <label>Player Name</label>
        </div>

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

        <div v-show="gamemode != 1" class="number-box">
          <input
            v-model.number="cardsPerPlayer"
            type="number"
            min="0"
            oninput="validity.valid||(value='');"
            required=""
          />
          <label>Cards on hand</label>
        </div>

        <div v-show="gamemode != 1" class="number-box">
          <input
            v-model.number="cardsOnTable"
            type="number"
            min="0"
            oninput="validity.valid||(value='');"
            required=""
          />
          <label>Cards on table</label>
        </div>

        <button class="button" @click="submitForm">Start</button>
      </div>

      <div v-if="joinForm" class="input-form">
        <div class="number-box">
          <input v-model="roomid" oninput="validity.valid||(value='');" type="number" required="" />
          <label>Enter ID</label>
        </div>
        <div class="number-box">
            <input v-model="joinname"
            type="text"
            required=""
            />
            <label>Name</label>
          </div>
        <button class="button" @click="joinRoomForm">Join</button>
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
      <p v-if="$store.getters.getJoinErrorMsg">
        <strong>{{ $store.getters.getJoinErrorMsg }}</strong>
      </p>
    </div>
    <lobby v-if="isLoaded" :deck-selected="parseInt(deckSelected)" :name="name" />
    <button v-if="isLoaded" class="exit-button" @click="closeSession">X</button>
  </div>
</template>

<script>
import Lobby from "./Lobby.vue";
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
      cardsPerPlayer: null,
      cardsOnTable: null,
      createForm: false,
      joinForm: false,
      name: "",
      gamemode: 0,
      roomid: null,
      joinname: null
    };
  },
  components: {
    Lobby
  },
  created() {
    let currId = $cookies.get("SessionId");
    if (currId != null && currId != -1) {
        this.$store
          .dispatch("retrieveSession", {
            sessionId: currId
          }).then(() => {
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
          return this.deckSelected > 10 || this.deckSelected < 0 || this.gamemode === 1;
        }),
        between: between(1, 52 * this.deckSelected),
      },
      cardsOnTable: {
        requiredIfFunction: requiredUnless(() => {
          return (
            this.cardsPerPlayer != null &&
            (this.cardsPerPlayer > 52 * this.deckSelected ||
              this.cardsPerPlayer < 0)
          ) || this.gamemode === 1;
        }),
        between: between(0, 52 * this.deckSelected - this.cardsPerPlayer),
      }
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
            name: this.name,
            cardsPerPlayer: this.gamemode === 0 ? this.cardsPerPlayer : 2,
            cardsOnTable: this.gamemode === 0 ? this.cardsOnTable : 2,
            gamemode: this.gamemode
          })
          .then(() => {
            $cookies.set("Gamemode", this.gamemode, "1h");
            this.isLoaded = true;
          });
      }
    },

    joinRoomForm() {
      if (this.roomid != null) {
        this.$store.dispatch("joinSession", {
          sessionId: this.roomid,
          name: this.joinname,
        }).then(() => {
          if (!this.$store.getters.getJoinErrorMsg) {
            this.isLoaded = true;
          }
        });
      }
    },

    closeSession() {
      $cookies.set("SessionId", -1, "1h");
      $cookies.set("PlayerId", -1, "1h");
      $cookies.set("Gamemode", -1, "1h");
      this.$store.commit("setGameInfo", false);
      this.$store.commit("setPlayerId", -1);
      this.isLoaded = false;
    },

    toggleCreateForm() {
      this.createForm = !this.createForm;
      this.joinForm = false;
    },

    toggleJoinForm() {
      this.joinForm = !this.joinForm;
      this.createForm = false;
    }
  },
};
</script>

<style>
@import "../assets/mainMenuStyles.css";
</style>
