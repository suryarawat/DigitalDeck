<template>
    <div class="game">
        <table-area />
        <hand-area />
    </div>
</template>

<script>
import HandArea from './HandArea.vue';
import TableArea from './TableArea.vue';

export default {
    name: 'Game',
    components: {
        HandArea,
        TableArea
    }
};
</script>

<style scoped>
.game {
    display: grid;
    height: 100vh;
    padding: 5vh 5vh 0;
    grid-template-rows: 2fr 1fr;
    text-align: center;
    align-items: center;
}
</style>