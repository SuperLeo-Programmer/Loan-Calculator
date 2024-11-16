let loans = []; // Array to store loans

// Function to calculate total loan amount
function calculateTotalLoan() {
  const total = loans.reduce((acc, loan) => acc + loan.amount, 0);
  document.getElementById('totalLoan').innerText = `€${total.toFixed(2)}`;
}

// Function to update the loan table
function updateLoanTable() {
  const loanTable = document.getElementById('loanTable');
  loanTable.innerHTML = ''; // Clear table
  loans.forEach((loan, index) => {
    const monthlyPayment = calculateMonthlyPayment(loan.amount, loan.interest, loan.time);
    const row = `
      <tr>
        <td>${index + 1}</td>
        <td>${loan.type}</td>
        <td>€${loan.amount.toFixed(2)}</td>
        <td>${loan.interest}%</td>
        <td>${loan.time}</td>
        <td>€${monthlyPayment.toFixed(2)}</td>
      </tr>
    `;
    loanTable.innerHTML += row;
  });
}

// Function to calculate monthly payment
function calculateMonthlyPayment(principal, rate, time) {
  const monthlyRate = rate / 100 / 12;
  const totalMonths = time * 12;
  return principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -totalMonths));
}

// Add Loan using SweetAlert
document.getElementById('newLoanBtn').addEventListener('click', () => {
  Swal.fire({
    title: 'New Loan',
    html: `
      <label for="loanType">Type:</label>
      <input type="text" id="loanType" class="swal2-input" placeholder="e.g., Home Loan">
      <label for="loanAmount">Amount (€):</label>
      <input type="number" id="loanAmount" class="swal2-input" placeholder="e.g., 5000">
      <label for="loanInterest">Interest (%):</label>
      <input type="number" id="loanInterest" class="swal2-input" placeholder="e.g., 5">
      <label for="loanTime">Time (Years):</label>
      <input type="number" id="loanTime" class="swal2-input" placeholder="e.g., 2">
    `,
    showCancelButton: true,
    confirmButtonText: 'Add Loan',
    preConfirm: () => {
      const type = document.getElementById('loanType').value;
      const amount = parseFloat(document.getElementById('loanAmount').value);
      const interest = parseFloat(document.getElementById('loanInterest').value);
      const time = parseInt(document.getElementById('loanTime').value);
      if (!type || isNaN(amount) || isNaN(interest) || isNaN(time)) {
        Swal.showValidationMessage('Please fill in all fields');
        return null;
      }
      return { type, amount, interest, time };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      loans.push(result.value);
      updateLoanTable();
      calculateTotalLoan();
      updateCharts();
      Swal.fire('Success', 'Loan added successfully!', 'success');
    }
  });
});

// Initialize charts
const loanPieChartCtx = document.getElementById('loanPieChart').getContext('2d');
const loanBarChartCtx = document.getElementById('loanBarChart').getContext('2d');
let pieChart, barChart;

function updateCharts() {
  const labels = loans.map((loan) => loan.type);
  const data = loans.map((loan) => loan.amount);
  const backgroundColors = ['#4caf50', '#2196f3', '#ff9800', '#e91e63'];

  // Update pie chart
  if (pieChart) pieChart.destroy();
  pieChart = new Chart(loanPieChartCtx, {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: backgroundColors,
      }],
    },
  });

  // Update bar chart
  if (barChart) barChart.destroy();
  barChart = new Chart(loanBarChartCtx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Loan Repayment Over Time (€)',
        data: loans.map((loan) => calculateMonthlyPayment(loan.amount, loan.interest, loan.time) * loan.time * 12),
        backgroundColor: '#2196f3',
      }],
    },
  });
}

// Compare Loans
document.getElementById('loanComparisonBtn').addEventListener('click', () => {
  const modal = new bootstrap.Modal(document.getElementById('loanComparisonModal'));
  modal.show();
});

document.getElementById('compareLoansBtn').addEventListener('click', () => {
  const loan1 = {
    type: document.getElementById('compareLoan1Type').value,
    amount: parseFloat(document.getElementById('compareLoan1Amount').value),
    interest: parseFloat(document.getElementById('compareLoan1Interest').value),
    time: parseInt(document.getElementById('compareLoan1Time').value),
  };

  const loan2 = {
    type: document.getElementById('compareLoan2Type').value,
    amount: parseFloat(document.getElementById('compareLoan2Amount').value),
    interest: parseFloat(document.getElementById('compareLoan2Interest').value),
    time: parseInt(document.getElementById('compareLoan2Time').value),
  };

  if (isNaN(loan1.amount) || isNaN(loan2.amount)) {
    Swal.fire('Error', 'Please fill in all fields for both loans.', 'error');
    return;
  }

  const calculateTotalCost = (loan) => {
    const monthlyPayment = calculateMonthlyPayment(loan.amount, loan.interest, loan.time);
    return monthlyPayment * loan.time * 12;
  };

  const loan1TotalCost = calculateTotalCost(loan1);
  const loan2TotalCost = calculateTotalCost(loan2);

  document.getElementById('comparisonResults').innerHTML = `
    <div class="alert alert-info">
      <strong>Loan 1:</strong> ${loan1.type} - Total Cost: €${loan1TotalCost.toFixed(2)}<br>
      <strong>Loan 2:</strong> ${loan2.type} - Total Cost: €${loan2TotalCost.toFixed(2)}
    </div>
  `;
});

document.getElementById('calculateSavingsBtn').addEventListener('click', () => {
  const amount = parseFloat(document.getElementById('savingsLoanAmount').value);
  const interest = parseFloat(document.getElementById('savingsLoanInterest').value);
  const time = parseInt(document.getElementById('savingsLoanTime').value);
  const earlyPayment = parseInt(document.getElementById('earlyPaymentYears').value);

  if (isNaN(amount) || isNaN(interest) || isNaN(time) || isNaN(earlyPayment)) {
    Swal.fire('Error', 'Please fill in all fields.', 'error');
    return;
  }

  const totalInterest = (amount * interest * time) / 100;
  const earlyInterest = (amount * interest * earlyPayment) / 100;
  const savings = totalInterest - earlyInterest;

  document.getElementById('savingsResults').innerHTML = `
    <div class="alert alert-success">
      <strong>Interest Saved:</strong> €${savings.toFixed(2)}<br>
      <strong>New Total Interest:</strong> €${earlyInterest.toFixed(2)}
    </div>
  `;
});



