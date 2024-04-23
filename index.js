const express = require('express');
const bodyParser = require('body-parser');
const crud = require('./crud');
const db = require('./database');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

const { createOrder, getOrder /* updateOrder, deleteOrder */ } = require('./orders');

app.post('/orders', async (req, res) => {
    try {
        const orderId = await createOrder(req.body);
        res.status(201).json({ orderId });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/orders/:orderId', async (req, res) => {
    try {
        const order = await getOrder(req.params.orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        console.error('Error getting order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to render the index page (list of books)
app.get('/homepage', (req, res) => {
    // Fetch all books
    crud.getAllBooks((books) => {
        if (books.length === 0) {
            // If there are no books, render the index page with an empty list
            res.render('homepage', { books: [] });
            return; // Return to avoid further processing
        }

        let count = 0;

        function fetchAuthorDetails(book) {
            crud.getAuthorById(book.author_id, (author) => {
                book.author_name = author ? author.author_name : '';
                fetchCategoryDetails(book);
            });
        }

        function fetchCategoryDetails(book) {
            crud.getCategoryById(book.category_id, (category) => {
                book.category_name = category ? category.category_name : '';
                count++;

                if (count === books.length) {
                    res.render('homepage', { books });
                }
            });
        }

        books.forEach((book) => {
            fetchAuthorDetails(book);
        });
    });
});

// Routes for login and signup pages
app.get('/', (req, res) => {
    res.render('login');
});

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Implement logic to authenticate user from the database
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
        if (err) {
            console.error('Error during login:', err);
            res.status(500).send('Internal server error');
            return;
        }
        
        if (!user) {
            // User not found, redirect back to login page with an error message
            res.render('login', { error: 'Invalid username or password' });
            return;
        }

        if (user.password !== password) {
            // Passwords don't match, redirect back to login page with an error message
            res.render('login', { error: 'Invalid username or password' });
            return;
        }

        // Authentication successful, redirect to a dashboard page or any other page
        res.redirect('/homepage'); // Change '/dashboard' to the appropriate URL
    });
});


app.get('/signup', (req, res) => {
    res.render('signup');
});

// Signup endpoint
app.post('/signup', (req, res) => {
    const { username, password, email } = req.body;
    // Check if the username or email already exists in the database
    db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], (err, existingUser) => {
        if (err) {
            console.error('Error during signup:', err);
            res.status(500).send('Internal server error');
            return;
        }
        
        if (existingUser) {
            // User with the same username or email already exists, redirect back to signup page with an error message
            res.render('signup', { error: 'Username or email already exists' });
            return;
        }

        // Insert the new user into the database
        db.run('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, password, email], (err) => {
            if (err) {
                console.error('Error during signup:', err);
                res.status(500).send('Internal server error');
                return;
            }

            // Signup successful, redirect to the login page with a success message
            res.render('login', { success: 'Signup successful! You can now login' });
        });
    });
});


// Route to render the index page (list of books)
app.get('/admin', (req, res) => {
    // Fetch all books
    crud.getAllBooks((books) => {
        if (books.length === 0) {
            // If there are no books, render the index page with an empty list
            res.render('index', { books: [] });
            return; // Return to avoid further processing
        }

        let count = 0;

        function fetchAuthorDetails(book) {
            crud.getAuthorById(book.author_id, (author) => {
                book.author_name = author ? author.author_name : '';
                fetchCategoryDetails(book);
            });
        }

        function fetchCategoryDetails(book) {
            crud.getCategoryById(book.category_id, (category) => {
                book.category_name = category ? category.category_name : '';
                count++;

                if (count === books.length) {
                    res.render('index', { books });
                }
            });
        }

        books.forEach((book) => {
            fetchAuthorDetails(book);
        });
    });
});

// Route to render the add book page
app.get('/books/add', (req, res) => {
    crud.getAllAuthors((authors) => {
        crud.getAllCategories((categories) => {
            res.render('add_book', { authors, categories });
        });
    });
});

// Route to handle form submission for adding a new book
app.post('/books/add', (req, res) => {
    const { title, authorId, categoryId, ISBN, publicationYear, price, quantityAvailable } = req.body;
    crud.addBook(title, authorId, categoryId, ISBN, publicationYear, price, quantityAvailable);
    res.redirect('/homepage');
});

// Route to render the form to edit a book
app.get('/books/edit/:id', (req, res) => {
    const { id } = req.params;
    // Fetch the book details
    crud.getBookById(id, (book) => {
        // Fetch the list of authors
        crud.getAllAuthors((authors) => {
            // Fetch the list of categories
            crud.getAllCategories((categories) => {
                // Render the edit_book template with book, authors, and categories data
                res.render('edit_book', { book, authors, categories });
            });
        });
    });
});
// Route to handle form submission for editing a book
app.post('/books/edit/:id', (req, res) => {
    const { id } = req.params;
    const { title, authorId, categoryId, ISBN, publicationYear, price, quantityAvailable } = req.body;
    crud.updateBook(id, title, authorId, categoryId, ISBN, publicationYear, price, quantityAvailable);
    res.redirect('/homepage');
});

// Route to delete a book
app.post('/books/delete/:id', (req, res) => {
    const { id } = req.params;
    crud.deleteBook(id);
    res.redirect('/homepage');
});

// Route to render the index page
app.get('/books', (req, res) => {
    crud.getAllBooks((books) => {
        // Fetch authors and categories for each book
        async.map(books, (book, callback) => {
            crud.getAuthorById(book.author_id, (author) => {
                book.author_name = author ? author.author_name : '';
                crud.getCategoryById(book.category_id, (category) => {
                    book.category_name = category ? category.category_name : '';
                    callback(null, book);
                });
            });
        }, (err, booksWithDetails) => {
            if (err) {
                console.error('Error fetching book details:', err);
                res.status(500).send('Internal Server Error');
            } else {
                res.render('index', { books: booksWithDetails });
            }
        });
    });
});

// Route to render the add author page
app.get('/authors/add', (req, res) => {
    res.render('add_author');
});

// Route to handle adding a new author
app.post('/authors/add', (req, res) => {
    const { authorName } = req.body;
    crud.addAuthor(authorName, (result) => {
        if (result) {
            res.redirect('/'); // Redirect to the home page after adding the author
        } else {
            res.send('Failed to add author.'); // Handle error if author addition fails
        }
    });
});

// Route to render the add category page
app.get('/categories/add', (req, res) => {
    res.render('add_category');
});

// Route to handle adding a new category
app.post('/categories/add', (req, res) => {
    const { categoryName } = req.body;
    crud.addCategory(categoryName, (result) => {
        if (result) {
            res.redirect('/homepage'); // Redirect to the home page after adding the category
        } else {
            res.send('Failed to add category.'); // Handle error if category addition fails
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
