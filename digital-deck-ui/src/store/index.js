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
        winners: null,
        joinErrorMsg: null
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
            for (var playerInfo of state.playersInfo) {
                if (playerInfo.name === player.name) {
                    playerInfo.numCards = player.numCards;
                }
            }
        },

        setPlayersInfo(state, players) {
            state.playersInfo = [];
            for (var player of players) {
                var obj = { name: player.name, numCards: player.cards.length };
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
        },

        setJoinErrorMsg(state, msg) {
            state.joinErrorMsg = msg;
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
                $cookies.set('PlayerId', res.data.players[0].playerId, '1h');
                UnitTests.testInitSession(state);
            }).catch((err) => console.log(err));
        },

        initBlackjack({ commit, state }) {
            return axios.post(api_url + '/blackjack/init', {
                sessionId: state.sessionId
            }).then((res) => {
                commit('setGameState', 0);
                commit('setCardsInDeck', res.data.deck.length);
                commit('setTableCards', res.data.table);
                commit('setCurrentTurn', true);
            });
        },

        joinSession({ commit }, sessionData) {
            return axios.post(api_url + '/session/join', {
                name: sessionData.name,
                sessionId: sessionData.sessionId
            }).then((res) => {
                if (!res.data.gameStarted) {
                    if (!res.data.isNameDuplicate) {
                      commit('setSessionId', res.data.sessionId);
                      commit('setPlayerId', res.data.players[res.data.players.length - 1].playerId);
                      commit('setName', res.data.players[res.data.players.length - 1].name);
                      commit('setPlayersInfo', res.data.players);
                      commit('setGameState', 0);
                      commit('setCurrentTurn', false);
                      commit('setGameInfo', res.data.gameStarted);
                      commit('setJoinErrorMsg', null);
                      $cookies.set('SessionId', res.data.sessionId, '1h');
                      $cookies.set('PlayerId', res.data.players[res.data.players.length - 1].playerId, '1h');
                    } else {
                      commit('setJoinErrorMsg', 'The name is already used by another player. Please choose a different name');
                    }
                }
                else {
                    commit('setJoinErrorMsg', 'Unable to join. Game has already started');
                }
            }).catch((err) => console.log(err));
        },

        retrieveSession({ commit, state }, id) {
            return axios.get(api_url + '/session/current', {
                params: { sessionId: id.sessionId }
            }).then((res) => {
                commit('setSessionId', res.data.sessionId);
                commit('setPlayerId', Number($cookies.get('PlayerId')));
                commit('setPlayerCards', res.data.players[state.playerId].cards);
                commit('setTableCards', res.data.table);
                commit('setCardsInDeck', res.data.deck.length);
                commit('setName', res.data.players[state.playerId].name);
                commit('setPlayersInfo', res.data.players);
                commit('setGamemode', res.data.gamemode);
                commit('setGameInfo', res.data.gameStarted);
                commit('setCurrentTurn', res.data.currentTurn == Number($cookies.get('PlayerId')) ? true: false);
                commit('setGameState', res.data.gameState);
                $cookies.set('SessionId', res.data.sessionId, '1h');
                //UnitTests.testInitSession(state);
            }).catch((err) => console.log(err));
        },

        drawCards({ commit, state }) {
            // let oldPlayerCards = state.playerCards;
            // let oldCardsInDeck = state.numCardsInDeck;

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
                commit('setGameInfo', res.data.gameStarted);
            }).catch((err) => console.log(err));
        },

        updatePlayerInfo({ commit }, sessionData) {
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
        },

        getJoinErrorMsg(state) {
            return state.joinErrorMsg;
        }
    }
});
