<template>
    <div class="game">
        <h1 class="h1">Room: {{this.$store.getters.getSessionId}}</h1>
        <other-players />
        <table-area />
        <hand-area />
    </div>
</template>

<script>
import HandArea from './HandArea.vue';
import TableArea from './TableArea.vue';
import OtherPlayers from './OtherPlayers.vue';

export default {
    name: 'game',
    components: {
        HandArea,
        TableArea,
        OtherPlayers
    }
};
</script>

<style scoped>
.game {
    display: grid;
    height: 100vh;
    padding: 5vh 5vh 0;
    grid-template-rows: 1fr 1fr 1fr;
    text-align: center;
}

.h1{
    position: absolute;

}
</style>