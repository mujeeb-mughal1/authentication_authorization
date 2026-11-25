require('dotenv/config')
const db = require('./pool');

const SQL = `
    CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        username VARCHAR(255) NOT NULL UNIQUE ,
        password VARCHAR(255) NOT NULL,
        is_member BOOLEAN NOT NULL DEFAULT FALSE ,
        is_admin BOOLEAN NOT NULL DEFAULT FALSE
    );

    CREATE TABLE IF NOT EXISTS messages(
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        title VARCHAR(255) NOT NULL,
        text TEXT NOT NULL, 
        created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
    );

`
async function main() {
    const connectionString = process.env.DB_URL;

    if(!connectionString){
        console.error("Missing database URL argument.");
        process.exit(1);
    }
    console.log("seeding...")
    await db.query(SQL);
    await db.end()
    console.log('done');
    
}

main()