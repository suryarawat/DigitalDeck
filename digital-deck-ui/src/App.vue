<template>
    <Game v-if="isLoaded" />
</template>

<script>
import Game from './components/Game.vue';
import EventService from './scripts/EventService.js'

export default {
  name: 'app',
  data: () => {
      return {
          isLoaded: false
      };
  },
  components: {
      Game
  },
  created() {
      // Will probably want to move this code inside Game.vue when the main menu is implemented
      this.$store.dispatch('initSession').finally(() => {
          this.isLoaded = true;    // to prevent the app from rendering before the data is fetched
      });
  },
  methods: {
    async serverGetReq() {
      // Use the eventService to call the apiCall() method
      EventService.apiCall();
    }
  }
}
</script>

<style>
@import './assets/base.css';
</style>
