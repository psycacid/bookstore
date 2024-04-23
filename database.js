const sqlite3 = require('sqlite3').verbose();

// Connect to the SQLite database
const db = new sqlite3.Database('bookstore.db', (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        createTables(); // Call function to create tables after connecting
    }
});

// Function to create tables if they don't exist
function createTables() {
    // SQL commands to create tables
    const createBooksTable = `
        CREATE TABLE IF NOT EXISTS books (
            book_id INTEGER PRIMARY KEY,
            title TEXT NOT NULL,
            author_id INTEGER,
            category_id INTEGER,
            ISBN TEXT,
            publication_year INTEGER,
            price REAL,
            quantity_available INTEGER,
            FOREIGN KEY (author_id) REFERENCES authors(author_id),
            FOREIGN KEY (category_id) REFERENCES categories(category_id)
        )
    `;

    const createAuthorsTable = `
        CREATE TABLE IF NOT EXISTS authors (
            author_id INTEGER PRIMARY KEY,
            author_name TEXT NOT NULL
        )
    `;

    const createCategoriesTable = `
        CREATE TABLE IF NOT EXISTS categories (
            category_id INTEGER PRIMARY KEY,
            category_name TEXT NOT NULL
        )
    `;

    const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
    )
`;

    // Execute SQL commands to create tables
    db.serialize(() => {
        db.run(createUsersTable);
        db.run(createAuthorsTable);
        db.run(createCategoriesTable);
        db.run(createBooksTable, (err) => {
            if (err) {
                console.error('Error creating books table:', err.message);
            } else {
                console.log('Books table created successfully.');
            }
        });
    });
}

// Export the database connection for use in other files
module.exports = db;
