<template>
    <div class="hand-area">
        <div>Some free space. Maybe add an exit button or something.</div>
        <player-hand />
        <card-deck />
    </div>
</template>

<script>
import CardDeck from './CardDeck.vue';
import PlayerHand from './PlayerHand.vue';

export default {
    name: 'hand-area',
    components: {
        CardDeck,
        PlayerHand
    }
};
</script>

<style scoped>
.hand-area {
    display: grid;
    grid-template-columns: 1fr 5fr 1fr;
    height: 100%;
}
</style>