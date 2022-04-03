require('dotenv').config();
const { MongoClient } = require('mongodb');
const {SecretManagerServiceClient} = require('@google-cloud/secret-manager');

var password = '';
if (process.env.NODE_ENV != 'production' || process.env.CI) {
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
if (password != "") {
    console.log('password found!');
}

async function getDB(){
    const uri = "mongodb+srv://app:u5rzwmYi8GTVvf-@dd.mkxa1.mongodb.net/DD?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    const connection = await client.connect();
    const database = client.db('DD');
    const sessionData = database.collection('sessions');
    return sessionData;
}

module.exports = {getDB};

