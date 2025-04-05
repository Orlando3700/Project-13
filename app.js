//app.js

// Load data from the backend API
async function loadData() {
  try {
	//Fetch balance data from the backend
    var balanceResponse = await fetch(`http://localhost:3000/api/balance`);
	if (!balanceResponse.ok) throw new Error('Failed to fetch balance');
    var balanceData = await balanceResponse.json();
	console.log('Balance Data:', balanceData);
    //balance = balanceData.balance;

	// Ensure balance is a number
	let balance = parseFloat(balanceData.balance);
	if (isNaN(balance)) throw new Error('Invalid balance data')


	//Fetch transaction history from the backend
    var historyResponse = await fetch(`http://localhost:3000/api/transactionHistory`);
	if (!historyResponse.ok) throw new Error('Failed to fetch transaction history');
    var historyData = await historyResponse.json();
	console.log('History Data:', historyData);
    
	let transactionHistory = historyData;

	//updateUI();
    updateUI(balance, transactionHistory);

  } catch (error) {
    console.error('Error loading data:', error);
	alert('An error occurred while fetching the data. ', + error.message);
  }
}

// Update the UI
//function updateUI()
function updateUI(balance, transactionHistory) {
  //This updates the element with the ID balance to display the 
  //current balance. balance.toFixed(2) formats the balance to 2 
  //decimal places.
  document.getElementById('balance').textContent = balance.toFixed(2);
  //Refresh the transactionHistory displayed on the page
  updateTransactionHistory(transactionHistory);
}

// Update the transaction history list
function updateTransactionHistory(transactionHistory) {
  //This retrieves the element with the ID history where transaction 
  //history is displayed.
  var historyList = document.getElementById('history');
  //Clear current list

  // Log the element to make sure it's being found'
  console.log(historyList);

  // Check if history list is null
  if (!historyList) {
  console.error('The history element was not found');
  return
}
	
  historyList.innerHTML = '';

  //This iterates over the transactionHistory array, and for each transaction
  transactionHistory.forEach(transaction => {
	//This creates a new <li> element to represent a single 
	//transaction in the list.
    var li = document.createElement('li');

    //Convert the date to a more readable format
	var date = new Date(transaction.date);
	var formattedDate = date.toLocaleString();
	
	//This sets the text content of the list item to include the 
	//transaction's date, amount, and recipient.
    li.textContent = `${formattedDate}: Sent $${transaction.amount} to ${transaction.recipient}`;
    //This adds the newly created <li> element to the historyList 
    //element, which will display the transaction on the page.
	historyList.appendChild(li);
  });
}

// Handle sending money
async function setupEventListeners() {
  var sendForm = document.getElementById('sendForm');
  sendForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    var recipient = document.getElementById('recipient').value;
    var amount = parseFloat(document.getElementById('amount').value);

	console.log('Recieved amount:', amount);
    console.log('Received recipient:', recipient);

	//if (recipient && amount && amount <= balance)
    if (recipient && amount && amount > 0) {
      try {
        // Call the backend API to process the transaction
        var response = await fetch(`http://localhost:3000/api/transaction`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ recipient, amount }),
        });

		var result = await response.json();
        if (response.ok) {
    
		  // Update the balance and transaction history after transaction
          loadData();
        } else {
          alert(result.message);
        }
      } catch (error) {
        alert('An error occurred while processing the transaction.');
        console.error(error);
      }
    } else {
      alert('Invalid input or insufficient balance.');
    }
  });
}

// Initialize app
// This adds an event listener that listens for the DOMContentLoaded 
//event, which is fired when the HTML document has been completely 
//loaded and parsed
document.addEventListener('DOMContentLoaded', () => {
  //This calls the loadData function to retrieve any saved data 
  //(such as balance and transaction history) from localStorage 
  //when the page loads.
  loadData();
  //This sets up event listeners for interactions (like form 
  //submission) once the page content has loaded.
  setupEventListeners();
});


