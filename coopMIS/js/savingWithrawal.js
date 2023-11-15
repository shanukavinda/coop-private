const mariadb = require("mariadb");
const pool = mariadb.createPool({
  host: "192.168.1.59",
  user: "user",
  password: "123",
  database: "cmisdb",
  connectionLimit: 5,
});
//Trigger account list
function handleKeyPress(event) {
  if (event.key === "Enter") {
    fetchCustomerData();
    populateAccountList(); 
    
  }
}

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

async function fetchAccountNumbers() {
  const cusNo = document.getElementById("cus_Nic_No").value;

  if (cusNo) {
    try {
      const connection = await pool.getConnection();

      const query = `
        SELECT pl_account.ref_account_number
        FROM ci_customer
        JOIN pl_account ON ci_customer.id = pl_account.ci_customer_id
        WHERE ci_customer.customer_number = ? OR ci_customer.nic = ?;
      `;

      const result = await connection.query(query, [cusNo, cusNo]);

      const accountList = document.getElementById("account_list");
      accountList.innerHTML = ""; //Clear field options

      result.forEach((row, index) => {
        const option = document.createElement("option");
        option.value = row.ref_account_number;
        option.text = row.ref_account_number;
        accountList.appendChild(option);
        
        // this one is im put to select first option in account NO
        if (index === 0) {
          accountList.value = row.ref_account_number;
        }
      });

      connection.release();
    } catch (error) {
      console.error("Database error:", error);
    }
  }
}

document.getElementById("cus_Nic_No").addEventListener("input", fetchAccountNumbers);

// enter NIC and NO both
document.getElementById("cus_Nic_No").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleKeyPress(event);
    fetchAccountNumbers(); 
  }
});
