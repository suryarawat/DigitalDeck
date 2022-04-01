require('dotenv').config({path:'./../digital-deck-server/ENV.env'});
const { MongoClient } = require('mongodb');
const {SecretManagerServiceClient} = require('@google-cloud/secret-manager');

var password = '';
if (process.env.NODE_ENV != 'production'){
    password = process.env.PASSWORD;
}
else{
    // Instantiates a client
    const client = new SecretManagerServiceClient();

    async function accessSecretVersion() {
        const [version] = await client.accessSecretVersion({
            name: "MongoDBPassword",
        });
        // Extract the password as a string.
        password = version.payload.data.toString();
    }
    accessSecretVersion();
}
const uri = "mongodb+srv://app:" + password + "@dd.mkxa1.mongodb.net/DD?retryWrites=true&w=majority";
const client = new MongoClient(uri);
client.connect();
const database = client.db('DD');
const sessionData = database.collection('sessions');
module.exports = sessionData;

