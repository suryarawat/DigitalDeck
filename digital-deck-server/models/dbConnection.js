const { MongoClient } = require('mongodb');


async function getDB(){
    const uri = "mongodb+srv://app:u5rzwmYi8GTVvf-@dd.mkxa1.mongodb.net/DD?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    await client.connect();
    const sessionData = client.db('DD').collection('sessions');
    return sessionData;
}

module.exports = {getDB};

