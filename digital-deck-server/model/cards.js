const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create the Card Schema
const CardSchema = new Schema({     // mongodb will create an auto generated id, so we don't need to create one here
    number: Number,
    texture: String // a path to texture itself
},
{ versionKey: false });

module.exports = Card = mongoose.model('Card', CardSchema);