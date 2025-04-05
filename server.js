//server.js

var express = require('express');
var mysql = require('mysql2');
var cors = require('cors');
var app = express();
var port = 3000;

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'OrlandoFRN',
  password: 'Fernand18',
  database: 'payment_app'
});

// Connect to database
db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// data storage (use a real database in production)
//let balance = 10000; //Initial balance
//let transactionHistory = []; // Start with an empty transaction history

// Use middleware
app.use(cors());

// Built-in Express middleware to parse JSON data
app.use(express.json());

// Built-in Express middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

//API route to get the current balance
app.get('/api/balance', (req, res) => {
	db.query('SELECT balance FROM users WHERE id = 1', (err, results) => {
    	if (err) return res.status(500).json({ error: err.message });
		var balance = parseFloat(results[0].balance);
		res.json({ balance });
    	//res.json({ balance: results[0].balance });
  });
});

// API route to get transaction history
app.get('/api/transactionHistory', (req, res) => {
	db.query('SELECT * FROM transactions ORDER BY date DESC', (err, results) => {
    	if (err) return res.status(500).json({ error: err.message });
    	res.json(results);
  });
});

// API route to create a new transaction
app.post('/api/transaction', (req, res) => {
  var { recipient, amount } = req.body;

  console.log('Recieved amount:', amount);
  console.log('Received recipient:', recipient);

  //Ensure amount is a number
  amount = parseFloat(amount);
  if (isNaN(amount)) {
	return res.status(400).json({ message: 'Invalid amount' });
}

  db.query('SELECT balance FROM users WHERE id = 1', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    let balance = results[0].balance;

	// Log the balance
	console.log('Current balance:', balance);

    if (amount > balance) {
      return res.status(400).json({ message: 'Insufficient balance.' });
    }

    // Deduct balance and store transaction
    var newBalance = balance - amount;
    db.query('UPDATE users SET balance = ? WHERE id = 1', [newBalance], err => {
      if (err) return res.status(500).json({ error: err.message });

      var transaction = {
        date: new Date().toISOString().slice(0, 19).replace('T', ' '),
        recipient,
        amount
      };
      db.query('INSERT INTO transactions SET ?', transaction, err => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json(transaction);
      });
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


