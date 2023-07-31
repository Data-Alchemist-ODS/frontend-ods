const fetchTriggerTransaction = document.querySelector('.transaction');

async function getAllTransactions() {
  try {
      const response = await fetch('http://127.0.0.1:8000/v1/api/transaction');
      const transactions = await response.json();
      return transactions;
  } catch (error) {
      console.error('Error fetching transactions:', error);
      return null;
  }
};

async function deleteOneTransaction(transactionId){
  try {
    const response = await fetch('http://127.0.0.1:8000/v1/api/transaction/'+transactionId, {
      method : 'DELETE'
    });
    const data = await response.json();
    const transactionRow = document.querySelector(`[data-transaction-id="${transactionId}"]`).closest('tr');

    if (transactionRow) {
      transactionRow.remove();
      document.querySelectorAll(`.index-data`).forEach((element, index) => {
        element.innerHTML = index + 1;
      })
    }

    return data;
  } catch (error) {
      console.error('Error delete transactions:');
      return null;
  }
}

fetchTriggerTransaction.addEventListener('click', () => {
  getAllTransactions()
  .then(transactions =>{
    const transactionTableBody = document.getElementById('transaction-data');

    let element = ``;

    transactions.records.forEach((transaction, index) => {
      element += `
        <tr>
          <td class = "index-data">${index + 1}</td>
          <td>${transaction.transactionID}</td>
          <td>${transaction.partition_type}</td>
          <td>${transaction.sharding_key}</td>
          <td>${transaction.database}</td>
          <td>${transaction.data.fileName}</td>
          <td><img src="img/trash.png" class="trash-logo" data-transaction-id="${transaction.transactionID}"></td>
        </tr>
      `;
    });
    transactionTableBody.innerHTML = element;


    const trashLogos = document.querySelectorAll('.trash-logo');

    trashLogos.forEach((logo) => {
      logo.addEventListener('click', function () {
        const transactionID = this.getAttribute('data-transaction-id');
        deleteOneTransaction(transactionID);
      });
    });
  })
  .catch(err => {
    console.log("Error getting transaction",err);
  })
});



// Call the async function to fetch and display transactions