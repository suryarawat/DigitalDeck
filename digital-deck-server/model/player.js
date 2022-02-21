const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create the Player Schema
const PlayerSchema = new Schema({     // mongodb will create an auto generated id, so we don't need to create one here
    name: String,
    cards: [ {type:Schema.Types.ObjectId, ref: 'Card'}] , 
    
},
{ versionKey: false });

module.exports = Player = mongoose.model('Player', PlayerSchema);