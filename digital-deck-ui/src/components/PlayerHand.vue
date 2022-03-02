<template>
    <div>
        <div>Display player's cards here</div>
        <div>Current hand (For testing): {{ $store.getters.getPlayerCards }}</div>
    </div>
</template>

<script>
export default {
    name: 'player-hand'
};
</script>