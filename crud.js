const db = require('./database'); // Import the SQLite database connection

// Function to add a new book
function addBook(title, authorId, categoryId, ISBN, publicationYear, price, quantityAvailable) {
    const sql = `
        INSERT INTO books (title, author_id, category_id, ISBN, publication_year, price, quantity_available)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.run(sql, [title, authorId, categoryId, ISBN, publicationYear, price, quantityAvailable], function(err) {
        if (err) {
            console.error('Error adding book:', err.message);
        } else {
            console.log(`A new book has been added with ID ${this.lastID}`);
        }
    });
}

// Function to retrieve all books
function getAllBooks(callback) {
    const sql = `
        SELECT * FROM books
    `;
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error retrieving books:', err.message);
            callback([]);
        } else {
            callback(rows);
        }
    });
}

// Function to update a book
function updateBook(bookId, title, authorId, categoryId, ISBN, publicationYear, price, quantityAvailable) {
    const sql = `
        UPDATE books
        SET title = ?, author_id = ?, category_id = ?, ISBN = ?, publication_year = ?, price = ?, quantity_available = ?
        WHERE book_id = ?
    `;
    db.run(sql, [title, authorId, categoryId, ISBN, publicationYear, price, quantityAvailable, bookId], function(err) {
        if (err) {
            console.error('Error updating book:', err.message);
        } else {
            console.log(`Book with ID ${bookId} has been updated.`);
        }
    });
}

// Function to delete a book
function deleteBook(bookId) {
    const sql = `
        DELETE FROM books
        WHERE book_id = ?
    `;
    db.run(sql, [bookId], function(err) {
        if (err) {
            console.error('Error deleting book:', err.message);
        } else {
            console.log(`Book with ID ${bookId} has been deleted.`);
        }
    });
}

// Function to get book by ID
function getBookById(bookId, callback) {
    const sql = `
        SELECT * FROM books
        WHERE book_id = ?
    `;
    db.get(sql, [bookId], (err, row) => {
        if (err) {
            console.error('Error retrieving book:', err.message);
            callback(null);
        } else {
            callback(row);
        }
    });
}

// Function to add a new author
function addAuthor(authorName, callback) {
    const sql = `
        INSERT INTO authors (author_name)
        VALUES (?)
    `;
    db.run(sql, [authorName], function(err) {
        if (err) {
            console.error('Error adding author:', err.message);
            callback(false); // Pass false to callback to indicate failure
        } else {
            console.log('Author added successfully. Author ID:', this.lastID);
            callback(true); // Pass true to callback to indicate success
        }
    });
}

// Function to add a new category (genre)
function addCategory(categoryName, callback) {
    const sql = `
        INSERT INTO categories (category_name)
        VALUES (?)
    `;
    db.run(sql, [categoryName], function(err) {
        if (err) {
            console.error('Error adding category:', err.message);
            callback(false); // Pass false to callback to indicate failure
        } else {
            console.log('Category added successfully. Category ID:', this.lastID);
            callback(true); // Pass true to callback to indicate success
        }
    });
}

// Function to fetch all authors
function getAllAuthors(callback) {
    const sql = `SELECT * FROM authors`;
    db.all(sql, (err, rows) => {
        if (err) {
            console.error('Error fetching authors:', err.message);
            callback([]);
        } else {
            callback(rows);
        }
    });
}

// Function to fetch all categories
function getAllCategories(callback) {
    const sql = `SELECT * FROM categories`;
    db.all(sql, (err, rows) => {
        if (err) {
            console.error('Error fetching categories:', err.message);
            callback([]);
        } else {
            callback(rows);
        }
    });
}

// Function to get author details by ID
function getAuthorById(authorId, callback) {
    const sql = `
        SELECT * FROM authors
        WHERE author_id = ?
    `;
    db.get(sql, [authorId], (err, row) => {
        if (err) {
            console.error('Error retrieving author:', err.message);
            callback(null);
        } else {
            callback(row);
        }
    });
}

// Function to get category details by ID
function getCategoryById(categoryId, callback) {
    const sql = `
        SELECT * FROM categories
        WHERE category_id = ?
    `;
    db.get(sql, [categoryId], (err, row) => {
        if (err) {
            console.error('Error retrieving category:', err.message);
            callback(null);
        } else {
            callback(row);
        }
    });
}

// Export CRUD functions for use in other files
module.exports = {
    addBook,
    getAllBooks,
    updateBook,
    deleteBook,
    getBookById,
    addAuthor,
    addCategory,
    getAllAuthors,
    getAllCategories,
    getAuthorById,
    getCategoryById
};
