import { MongoClient, ServerApiVersion } from 'mongodb';
import { env } from './environment';
const MONGO_URI = env.MONGODB_URI;
const DATABASE_NAME = env.DATABASE_NAME;

let trelloDatabaseInstance = null;

const mongoClientInstance = new MongoClient(MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});
const CONNECT_DB = async () => {
  await mongoClientInstance.connect();
  trelloDatabaseInstance = mongoClientInstance.db(DATABASE_NAME);
};
const GET_DB = () => {
  if (!trelloDatabaseInstance) throw new Error('Must connect to DB first');
  return trelloDatabaseInstance;
};
const CLOSE_DB = async () => {
  await mongoClientInstance.close();
};

export { CONNECT_DB, GET_DB, CLOSE_DB };
