//transaction.js

// Load and display transaction history
async function loadTransactionHistory() {
	try {
		var response = await fetch('http://localhost:3000/api/transactionHistory');
		var transactionHistory = await response.json();

  		// Update the UI with the transaction history
  		updateTransactionHistory(transactionHistory);
		} catch (error) {
		console.error('Error loading transaction history:', error);
	}
}

// Update the transaction history UI
function updateTransactionHistory(transactionHistory) {
  // Get the history list element
  var historyList = document.getElementById('history');
  
  // Clear current list
  historyList.innerHTML = '';

  // Iterate over each transaction and display it
  transactionHistory.forEach(transaction => {
    var li = document.createElement('li');

	//Convert the date to a more readable format
	var date = new Date(transaction.date);
	var formattedDate = date.toLocaleString();
	
    li.textContent = `${formattedDate}: Sent $${transaction.amount} to ${transaction.recipient}`;
    historyList.appendChild(li);
  });
}

//Initialize page
document.addEventListener('DOMContentLoaded', loadTransactionHistory);


