<template>
  <div>
    <players-list v-if="!isLoaded" style="transform: translate(0%, 50%)" />
    <button
      v-if="!isLoaded"
      class="button"
      @click="loadGame()"
      style="postion: absolute;   left: 50%;
            top: 50%; 
            transform: translate(-50%, 300%);"
    >
      Start
    </button>
    <game v-if="isLoaded" />
  </div>
</template>

<script>
import Game from "./Game.vue";
import PlayersList from "./PlayersList.vue";

export default {
  name: "lobby",
  components: {
    Game,
    PlayersList,
  },
  data: () => {
    return {
      isLoaded: false,
    };
  },
  methods: {
    loadGame() {
      this.isLoaded = true;
    },
  },
};
</script>

<style>
</style>
