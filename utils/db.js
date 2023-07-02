// Import the mongodb module
import { MongoClient } from 'mongodb';

/**
 * A class that represents a MongoDB client.
 */
class DBClient {
  /**
   * Creates a new MongoDB client instance and connects to the database.
   */
  constructor () {
    // Get the host, port and database from the environment variables or use default values
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';

    // Create the connection URL
    const url = `mongodb://${host}:${port}`;

    // Create a new client instance
    this.client = new MongoClient(url, {
      useUnifiedTopology: true
    });

    // Connect to the database
    this.client.connect((err) => {
      if (err) {
        console.error(err.message);
      } else {
        // Get the database object
        this.db = this.client.db(database);
        this.users = this.db.collection('users');
        this.files = this.db.collection('files');
      }
    });
  }

  /**
   * Checks if the connection to MongoDB is alive.
   * @returns {boolean} True if the connection is alive, false otherwise.
   */
  isAlive () {
    return !!this.client && !!this.client.topology && this.client.topology.isConnected();
  }

  /**
   * Gets the number of documents in the collection users.
   * @async
   * @returns {Promise<number>} A promise that resolves with the number of users, or rejects with an error.
   */
  async nbUsers () {
    return this.users.countDocuments();
  }

  /**
   * Gets the number of documents in the collection files.
   * @async
   * @returns {Promise<number>} A promise that resolves with the number of files, or rejects with an error.
   */
  async nbFiles () {
    return this.files.countDocuments();
  }
}

// Create and export an instance of DBClient called dbClient
const dbClient = new DBClient();
export default dbClient;
