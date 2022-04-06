import { createStore } from 'vuex';
import axios from 'axios';
import UnitTests from './../scripts/UnitTests.js';
import { api_url } from "./../App.vue";

export default createStore({
    state: {
        sessionId: -1,
        playerId: -1,
        playerCards: null,
        tableCards: null,
        numCardsInDeck: 0,
        name: "",
        playersInfo: null, //other players name and number of cards
        gameStarted : false,
        gamemode: -1,
        isCurrentTurn: false,
        gameState: 0,
        winners: null
    },
    mutations: {
        setSessionId(state, sessionId) {
            state.sessionId = sessionId;
        },

        setPlayerId(state, playerId) {
            state.playerId = playerId;
        },

        setPlayerCards(state, playerCards) {
            state.playerCards = playerCards;
        },

        setTableCards(state, table) {
            state.tableCards = table.cards;
        },

        setCardsInDeck(state, deck) {
            state.numCardsInDeck = deck;
        },

        flipCard(state, card) {
            var index = state.tableCards.indexOf(card);
            state.tableCards[index] = -1 * state.tableCards[index];
        },

        setName(state, name) {
            state.name = name;
        },

        setPlayerInfo(state, player) {
            for (var i = 0; i < state.playersInfo.length; i++) {
                if (state.playersInfo[i].name === player.name) {
                    state.playersInfo[i].numCards = player.numCards;
                }
            }
        },

        setPlayersInfo(state, players) {
            state.playersInfo = [];
            for (var i = 0; i < players.length; i++) {
                var obj = { name: players[i].name, numCards: players[i].cards.length };
                state.playersInfo.push(obj);
            }
        },

        setGameInfo (state, info) {
            state.gameStarted = info;
        },

        setGamemode(state, gamemode) {
            state.gamemode = gamemode;
        },

        setGameState(state, gameState) {
            state.gameState = gameState;
        },

        setCurrentTurn(state, isCurrentTurn) {
            state.isCurrentTurn = isCurrentTurn;
        },

        setWinners(state, winners) {
            state.winners = winners;
        }
    },
    actions: {
        initSession({ commit, state }, sessionData) {
            return axios.post(api_url + '/session/new', {
                decks: sessionData.decks,
                players: 1, 
                name: sessionData.name,
                cardsPerPlayer: sessionData.cardsPerPlayer,
                cardsOnTable: sessionData.cardsOnTable,
                gamemode: sessionData.gamemode
            }).then((res) => {
                commit('setSessionId', res.data.sessionId);
                commit('setPlayerId', res.data.players[0].playerId);
                commit('setName', res.data.players[0].name);
                commit('setPlayersInfo', res.data.players);
                commit('setGamemode', sessionData.gamemode);
                commit('setGameState', 0);
                commit('setCurrentTurn', false);
                $cookies.set('SessionId', res.data.sessionId, '1h');
                UnitTests.testInitSession(state);
            }).catch((err) => console.log(err));
        },

        initBlackjack({ commit, state }) {
            return axios.post(api_url + '/blackjack/init', {
                sessionId: state.sessionId
            }).then((res) => {
                commit('setGameState', 0);
                commit('setCurrentTurn', false);
                commit('setCardsInDeck', res.data.deck.length);
                commit('setTableCards', res.data.table);
                commit("setCurrentTurn", true);
            });
        },

        joinSession({ commit, state }, sessionData) {
            return axios.post(api_url + '/session/join', {
                name: sessionData.name,
                sessionId: sessionData.sessionId,
            }).then((res) => {
                if (res.status==200) {
                    commit('setSessionId', res.data.sessionId);
                    commit('setPlayerId', res.data.players[res.data.players.length - 1].playerId);
                    commit('setName', res.data.players[res.data.players.length - 1].name);
                    commit('setPlayersInfo', res.data.players);
                    commit('setGameState', 0);
                    commit('setCurrentTurn', false);
                    $cookies.set('SessionId', res.data.sessionId, '1h');
                    UnitTests.testInitSession(state);
                }
                else {
                    commit('setGameInfo', true);
                }
                
            }).catch((err) => console.log(err));
        },

        retrieveSession({ commit, state }, id) {
            return axios.get(api_url + '/session/current', {
                params: { sessionId: id.sessionId }
            }).then((res) => {
                commit('setSessionId', res.data.sessionId);
                commit('setPlayerId', state.playerId);
                commit('setPlayerCards', res.data.players[state.playerId].cards);
                commit('setTableCards', res.data.table);
                commit('setCardsInDeck', res.data.deck.length);
                commit('setName', res.data.players[state.playerId].name);
                commit('setPlayersInfo', res.data.players);
                commit('setGamemode', res.data.gamemode);
                $cookies.set('SessionId', res.data.sessionId, '1h');
                //UnitTests.testInitSession(state);
            }).catch((err) => console.log(err));
        },

        drawCards({ commit, state }) {
            let oldPlayerCards = state.playerCards;
            let oldCardsInDeck = state.numCardsInDeck;

            return axios.post(api_url + '/player/drawcard', {
                sessionId: state.sessionId,
                playerId: state.playerId,
                numCards: 1
            }).then((res) => {
                commit('setPlayerCards', res.data.cards);
                commit('setCardsInDeck', res.data.deck.length);
               // UnitTests.testDrawCards(state, oldPlayerCards, oldCardsInDeck);
            }).catch((err) => console.log(err));
        },

        playCards({ commit, state }, payload) {
            return axios.post(api_url + '/player/playcard', {
                sessionId: state.sessionId,
                playerId: state.playerId,
                cardIndex: payload.index,
                card: payload.card,
            }).then((res) => {
                commit('setPlayerCards', res.data.players[state.playerId].cards);
                commit('setTableCards', res.data.table);
            }).catch((err) => console.log(err));
        },

        distributeCards({ commit, state }, payload) {
            return axios.post(api_url + '/session/distributecards', {
                sessionId: state.sessionId,
                doClear: payload.doClear
            }).then((res) => {
                commit('setPlayerCards', res.data.players[state.playerId].cards);
                commit('setTableCards', res.data.table);
                commit('setCardsInDeck', res.data.deck.length);
                commit('setName', res.data.players[state.playerId].name);
                commit('setPlayersInfo', res.data.players);
            }).catch((err) => console.log(err));

        },

        updatePlayerInfo({ commit, state }, sessionData) {
            commit('setSessionId', sessionData.sessionId);
            commit('setPlayersInfo', sessionData.players);
            $cookies.set('SessionId', sessionData.sessionId, '1h');
        },

        dealersTurn({ commit, state }){
            return axios.post(api_url + '/blackjack/dealer', {
                sessionId: state.sessionId
            }).then((res) => {
                commit('setWinners', res.data.winners);
                commit('setTableCards', res.data.table);
            }).catch((err) => console.log(err));
        },

        surrender({ state }) {
            return axios.post(api_url + '/blackjack/surrender', {
                sessionId: state.sessionId,
                playerId: state.playerId
            });
        }
    },
    getters: {
        getPlayerId(state) {
          return state.playerId;
        },

        getPlayerCards(state) {
            return state.playerCards;   // this will automatically track the changes of playerCards so you don't have to watch for it
        },

        getNumCardsInDeck(state) {
            return state.numCardsInDeck;
        },

        getTableCards(state) {
            return state.tableCards;
        },

        getSessionId(state) {
            return state.sessionId;
        },

        getName(state) {
            return state.name;
        },

        getPlayerId(state) {
            return state.playerId;
        },

        getPlayersInfo(state) {
            return state.playersInfo;
        },

        getGameInfo(state) {
            return state.gameStarted;
        },

        getGamemode(state) {
            return state.gamemode;
        },

        isCurrentTurn(state) {
            return state.isCurrentTurn;
        },

        getGameState(state) {
            return state.gameState;
        },

        getWinners(state) {
            return state.winners;
        }
    }
});
