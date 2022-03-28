import { createStore } from 'vuex';
import axios from 'axios';
import UnitTests from './../scripts/UnitTests.js';

const URL = 'http://localhost:5000';

export default createStore({
    state: {
        sessionId: -1,
        playerId: -1,
        playerCards: null,
        tableCards: null,
        numCardsInDeck: -1,
        name: "",
        playersInfo: [], //other players name and number of cards
        currentIndex:0,
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
            state.numCardsInDeck = deck.length;
        },

        flipCard(state, card) {
            var index = state.tableCards.indexOf(card);
            state.tableCards[index] = -1 * state.tableCards[index];
        },

        setName(state, name){  
            state.name = name;
        },

        setPlayersInfo(state, players){
            state.playersInfo=[];
            for(var i = 0; i < players.length; i++)
            {
                var obj = { name: players[i].name, numOfCards: players[i].cards.length, isJoined : players[i].joined};
                state.playersInfo.push(obj);
            }

        },

        setCurrentIndex(state, currentIndex){  
            state.currentIndex = currentIndex;
        },
    },
    actions: {
        initSession({ commit, state }, sessionData) {
            return axios.post(URL + '/session/new', {
                decks: sessionData.decks,
                players: 4, //total slots 
                name: sessionData.name,
                cardsPerPlayer: sessionData.cardsPerPlayer,
                cardsOnTable: sessionData.cardsOnTable
            }).then((res) => {
                commit('setSessionId', res.data.sessionId);
                commit('setPlayerId', res.data.players[0].playerId);
                commit('setPlayerCards', res.data.players[0].cards);
                commit('setTableCards', res.data.table);
                commit('setCardsInDeck', res.data.deck);
                commit('setName', res.data.players[0].name);
                commit('setPlayersInfo', res.data.players);
                $cookies.set('SessionId', res.data.sessionId, '1h');
                UnitTests.testInitSession(state);
            }).catch((err) => console.log(err));
        },

        retrieveSession({ commit, state }, id) {
            return axios.get(URL + '/session/current', {
                params: { sessionId: id.sessionId}
            }).then((res) => {
                commit('setSessionId', res.data.sessionId);
                commit('setPlayerId', res.data.players[this.state.currentIndex].playerId);
                commit('setPlayerCards', res.data.players[this.state.currentIndex].cards);
                commit('setTableCards', res.data.table);
                commit('setCardsInDeck', res.data.deck);
                commit('setName', res.data.players[this.state.currentIndex].name);
                commit('setPlayersInfo', res.data.players);
                $cookies.set('SessionId', res.data.sessionId, '1h');
                UnitTests.testInitSession(state);
            }).catch((err) => console.log(err));
        },

        drawCards({ commit, state }) {
            let oldPlayerCards = state.playerCards;
            let oldCardsInDeck = state.numCardsInDeck;

            axios.post(URL + '/player/drawcard', {
                sessionId: state.sessionId,
                playerId: state.playerId,
                numOfCards: 1
            }).then((res) => {
                commit('setPlayerCards', res.data.cards);
                commit('setCardsInDeck', res.data.deck);

                UnitTests.testDrawCards(state, oldPlayerCards, oldCardsInDeck);
            }).catch((err) => console.log(err));
        },

        playCards({ commit, state }, payload) {
            axios.post(URL + '/player/playcard', {
                sessionId: state.sessionId,
                playerId: state.playerId,
                cardIndex: payload.index,
                card: payload.card,
            }).then((res) => {
                commit('setPlayerCards', res.data.players[0].cards);
                commit('setTableCards', res.data.table);
            }).catch((err) => console.log(err));

        },

        joinlobby({ commit, state }, sessionData) {
            axios.post(URL + '/session/joinlobby', {
                sessionId: sessionData.sessionId,
                name: sessionData.name,
            }).then((res) => {
                commit('setSessionId', res.data.session.sessionId);
                commit('setPlayerId', res.data.id);
                commit('setCurrentIndex', res.data.index);
                commit('setPlayerCards', res.data.session.players[res.data.index].cards);
                commit('setTableCards', res.data.session.table);
                commit('setCardsInDeck', res.data.session.deck);
                commit('setName', res.data.session.players[res.data.index].name);
                commit('setPlayersInfo', res.data.session.players);
                $cookies.set('SessionId', res.data.session.sessionId, '1h');

                
            }).catch((err) => console.log(err));

        }
    },
    getters: {
        getPlayerCards(state) {
            return state.playerCards;   // this will automatically track the changes of playerCards so you don't have to watch for it
        },

        getNumCardsInDeck(state) {
            return state.numCardsInDeck;
        },

        getTableCards(state) {
            return state.tableCards;
        },

        getSessionId(state){
            return state.sessionId;
        },

        getName(state){
            return state.name;
        },

        getPlayerId(state) {
            return state.playerId;
        },

        getPlayersInfo(state){
            return state.playersInfo;
        },

        
    }
});
