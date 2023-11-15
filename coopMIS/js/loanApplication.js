// Get references to the select and input elements
const select = document.getElementById("states");
const otherInput = document.getElementById("otherInput");
const pool = require("../../dbconfig.js");

// Add an event listener to the select element to toggle the input field
select.addEventListener("change", () => {
  if (select.value === "MI") {
    otherInput.classList.remove("hidden");
  } else {
    otherInput.classList.add("hidden");
  }
});

// Your data fetching and processing logic
const fetchData = () => {
  // Simulated data for demonstration
  const dataFromDatabase = [
    {
      LoanNo: 1,
      Code: "ABC",
      Capital: "$1000",
      AccountNo: "12345",
      Balance: "$500",
    },
    {
      LoanNo: 2,
      Code: "DEF",
      Capital: "$2000",
      AccountNo: "67890",
      Balance: "$800",
    },
    
    // Add more data objects as needed
  ];

  return dataFromDatabase;
};

// Function to generate and update table rows
const updateTable = (data) => {
  const tableBody = document.querySelector("tbody");

  // Loop through the data and generate table rows
  data.forEach((row) => {
    const tableRow = document.createElement("tr");
    tableRow.innerHTML = `
        <td class="border border-gray-300">${row.LoanNo}</td>
        <td class="border border-gray-300">${row.Code}</td>
        <td class="border border-gray-300">${row.Capital}</td>
        <td class="border border-gray-300">${row.AccountNo}</td>
        <td class="border border-gray-300">${row.Balance}</td>
      `;

    tableBody.appendChild(tableRow);
  });
};

// Wait for the HTML document to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const data = fetchData(); // Fetch your data

  // Update the table with the fetched data
  updateTable(data);
});

// Define the handleKeyPress function
function handleKeyPress(event) {
  if (event.key === "Enter") {
    fetchCustomerData();
  }
}

// Define the fetchCustomerData function to fetch data from the database
async function fetchCustomerData() {
  const cus_Nic_No = document.getElementById("cus_Nic_No").value;

  if (cus_Nic_No) {
    try {
      const connection = await pool.getConnection();

      const query = `SELECT full_name_en, customer_number, nic FROM ci_customer WHERE nic = ? OR customer_number = ?`;
      const result = await connection.query(query, [cus_Nic_No, cus_Nic_No]);

      if (result.length > 0) {
        const customerData = result[0];
        document.getElementById("customer_Name").textContent =
          customerData.full_name_en;
        document.getElementById("customer_Nic").textContent = customerData.nic;
        document.getElementById("customer_No").textContent =
          customerData.customer_number;
      } else {
        alert("Customer not found.");
      }

      connection.release();
    } catch (error) {
      console.error("Database error:", error);
    }
  }
}

// Add an event listener to the input field to listen for key presses
document.getElementById("cus_Nic_No").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleKeyPress(event);
  }
});
