const IN_PROD = true;

export default {
    testInitSession(state) {
        if (!IN_PROD) {
            let testResult = 'Testing InitSession:\n\tSessionID Test. Expecting sessionID to be >= 0: ';
            let passCount = 0;
            let failCount = 0;

            if (state.sessionId >= 0) {
                passCount++;
                testResult += `\n\t\tPASS. `;
            }
            else {
                failCount++;
                testResult += `\n\t\tFAIL. `
            }
            testResult += `sessionId = ${state.sessionId}\n`;

            testResult += `\tPlayerId Test. Expecting playerId to be >= 0: `;
            if (state.playerId >= 0) {
                passCount++;
                testResult += `\n\t\tPASS. `;
            }
            else {
                failCount++;
                testResult += `\n\t\tFAIL. `
            }
            testResult += `playerId = ${state.playerId}\n`;

            testResult += `\tPlayerCards Test. Expecting playerCards to not be null: `;
            if (state.playerCards) {
                passCount++;
                testResult += `\n\t\tPASS. `;
            }
            else {
                failCount++;
                testResult += `\n\t\tFAIL. `
            }
            testResult += `playerCards = ${state.playerCards}\n`;

            testResult += `\tCardsOnTable Test. Expecting tableCards to not be null: `;
            if (state.tableCards) {
                passCount++;
                testResult += `\n\t\tPASS. `;
            }
            else {
                failCount++;
                testResult += `\n\t\tFAIL. `
            }
            testResult += `tableCards = ${state.tableCards}\n`;

            testResult += `\tCardsInDeck Test. Expecting numCardsInDeck to be >= 0: `;
            if (state.playerId >= 0) {
                passCount++;
                testResult += `\n\t\tPASS. `;
            }
            else {
                failCount++;
                testResult += `\n\t\tFAIL. `
            }
            testResult += `numCardsInDeck = ${state.playerId}\n`;
            testResult += `InitSession Tests Completed. Passed: ${passCount}, Failed: ${failCount}.\n\n`;

            console.log(testResult);
        }
    },

    testDrawCards(state, oldPlayerCards, oldCardsInDeck) {
        if (!IN_PROD) {
            let testResult = 'Testing DrawCards:\n\tPlayerCards Test. Expecting new player cards to have 1 new card compared to before: ';
            let passCount = 0;
            let failCount = 0;

            if (state.playerCards.filter(c => !oldPlayerCards.includes(c)).length === 1) {
                passCount++;
                testResult += `\n\t\tPASS. `;
            }
            else {
                failCount++;
                testResult += `\n\t\tFAIL. `
            }
            testResult += `playerCards difference = ${state.playerCards.filter(c => !oldPlayerCards.includes(c))}\n`;

            testResult += `\tCardsInDeck Test. Expecting numCardsInDeck to be 1 less than before: `;
            if (oldCardsInDeck - state.numCardsInDeck === 1) {
                passCount++;
                testResult += `\n\t\tPASS. `;
            }
            else {
                failCount++;
                testResult += `\n\t\tFAIL. `
            }
            testResult += `numCardsInDeck difference = ${oldCardsInDeck - state.numCardsInDeck}\n`;
            testResult += `DrawCards Tests Completed. Passed: ${passCount}, Failed: ${failCount}.\n\n`;

            console.log(testResult);
        }
    }
};
