require('dotenv').config();
const { MongoClient } = require('mongodb');
const {SecretManagerServiceClient} = require('@google-cloud/secret-manager');

/*
* Reads the password from either .env file or secrets in GCP
*/
async function readPassword(){
    var password = "";
    if (process.env.NODE_ENV != 'production' || process.env.CI) {
        password = process.env.PASSWORD;
    }
    else{
        // Instantiates a client
        const client = new SecretManagerServiceClient();
        const name = 'projects/628328056407/secrets/MongoDBPassword/versions/1';
        console.log(name);
        async function accessSecretVersion() {
            const [version] = await client.accessSecretVersion({
                name: name,
            });
            // Extract the password as a string.
            console.log(version.payload.data.toString());
            password = version.payload.data.toString();
        }
        accessSecretVersion();
    }
    if (password != "") {
        console.log('password found!');
    }
    return password;
}

/*
* Creates a mongo database connection
*/
async function getDB(){
    const password = await readPassword();
    const uri = "mongodb+srv://app:" + password + "@dd.mkxa1.mongodb.net/DD?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    const connection = await client.connect();
    const database = client.db('DD');
    const sessionData = database.collection('sessions');
    return sessionData;
}

module.exports = {getDB};

