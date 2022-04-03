const { MongoClient } = require('mongodb');


async function getDB(){
    const uri = "mongodb+srv://app:u5rzwmYi8GTVvf-@dd.mkxa1.mongodb.net/DD?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    const connection = await client.connect();
    const database = client.db('DD');
    const sessionData = database.collection('sessions');
    return sessionData;
}

module.exports = {getDB};

