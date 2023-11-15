const pool = require("../dbconfig.js");

document.getElementById("tab-0").click();
const customerType = document.getElementById("customerTypeDropdown");
const ci_city = document.getElementById("cityDropdown");
const addCustomer = document.getElementById("addCustomer");
const clearFields = document.getElementById("clearFields");
const number_container = document.getElementById("new-number-container");
let h6;
let new_digit;
let newCustomerNumber;

async function fetchData() {
  let conn;
  try {
    conn = await pool.getConnection();
    const customerTypes = await conn.query(
      "SELECT id, type_ln1 FROM ci_customer_type"
    );
    const cities = await conn.query("select id, city_ln1 from ci_city");

    return [customerTypes, cities];
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release();
  }
}

async function main() {
  try {
    const data = await fetchData();
    titles = data[0];
    cities = data[1];

    titles.forEach((title) => {
      const option = document.createElement("option");
      option.value = title.id;
      option.textContent = title.type_ln1;
      customerType.appendChild(option);
    });

    cities.forEach((city) => {
      const option = document.createElement("option");
      option.value = city.id;
      option.textContent = city.city_ln1;
      ci_city.appendChild(option);
    });
  } catch (err) {
    console.error("Error:", err);
  }
}

main();

customerType.addEventListener("change", function () {
  let selectedValue = customerType.value;
  getCustomerNo(selectedValue);
});

async function getCustomerNo(selectedValue) {
  try {
    conn = await pool.getConnection();
    const cusTypeDetails = await conn.query(
      `select prefix, last_number from ci_customer_type where id = ${selectedValue};`
    );

    new_digit = cusTypeDetails[0].last_number + 1;
    let formattedNumber = new_digit.toString().padStart(5, "0");

    newCustomerNumber = cusTypeDetails[0].prefix + formattedNumber;

    // Check if number_container has children
    if (number_container.childElementCount === 0) {
      // If it doesn't have children, create the h6 element
      h6 = document.createElement("h6");
      h6.setAttribute("id", "new-number");
      h6.classList.add("ml-2", "text-xl", "text-center", "p-2");
      number_container.appendChild(h6);
    }

    h6.innerHTML = newCustomerNumber; // Update the content of the h6 element
  } catch (error) {
    throw error;
  } finally {
    if (conn) conn.release();
  }
}

addCustomer.addEventListener("click", function () {
  const formData = {
    customerTypeId: customerType.value,
    customerNumber: newCustomerNumber,
    title_ln1: document.getElementById("dropdown-0").value,
    title_ln2: document.getElementById("dropdown-1").value,
    title_ln3: document.getElementById("dropdown-2").value,
    initials_ln1: document.getElementById("name-0").value,
    initials_ln2: document.getElementById("name-1").value,
    initials_ln3: document.getElementById("name-2").value,
    fullName_ln1: document.getElementById("fullname-0").value,
    fullName_ln2: document.getElementById("fullname-1").value,
    fullName_ln3: document.getElementById("fullname-2").value,
    address_ln1: document.getElementById("address-0").value,
    address_ln2: document.getElementById("address-1").value,
    address_ln3: document.getElementById("address-2").value,
    nominee_name_ln1: document.getElementById("nominee-name-0").value,
    nominee_name_ln2: document.getElementById("nominee-name-1").value,
    nominee_name_ln3: document.getElementById("nominee-name-2").value,
    nic: document.getElementById("nicInput").value,
    dob: document.getElementById("dobDropdown").value,
    city_id: document.getElementById("cityDropdown").value,
    sex: document.getElementById("sexDropdown").value,
    marital_status: document.getElementById("maritalStatusDropdown").value,
    mobile_no1: document.getElementById("mobileInputOne").value,
    mobile_no2: document.getElementById("mobileInputTwo").value,
    email: document.getElementById("emailInput").value,
    telephone: document.getElementById("telephoneInput").value,
    nominee_relation: document.getElementById("nominee-relation").value,
    registraition_id: document.getElementById("regIdINput").value,
    nominee_dob: document.getElementById("nomineeDobDropdown").value,
    joined_date: document.getElementById("joinedDropdown").value,
    active_status: document.getElementById("activeDropdown").value,
    inactive_reason: document.getElementById("inactiveReasonInput").value,
    credit_limit: document.getElementById("creditLimitInput").value,
    credit_limit_app_date: document.getElementById("creditLimitAppDateInput")
      .value,
  };

  insertCustomer(formData)
    .then(() => {
      console.log("Data inserted successfully");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

async function insertCustomer(formData) {
  let conn;
  try {
    conn = await pool.getConnection();
    const {
      customerTypeId,
      customerNumber,
      title_ln1,
      title_ln2,
      title_ln3,
      initials_ln1,
      initials_ln2,
      initials_ln3,
      fullName_ln1,
      fullName_ln2,
      fullName_ln3,
      address_ln1,
      address_ln2,
      address_ln3,
      nominee_name_ln1,
      nominee_name_ln2,
      nominee_name_ln3,
      nic,
      dob,
      city_id,
      sex,
      marital_status,
      mobile_no1,
      mobile_no2,
      email,
      telephone,
      nominee_relation,
      registraition_id,
      nominee_dob,
      joined_date,
      active_status,
      inactive_reason,
      credit_limit,
      credit_limit_app_date,
    } = formData;

    const customerResult = await conn.query(
      `INSERT INTO ci_customer (customer_type_id, customer_number, title_ln1, title_ln2, title_ln3, full_name_ln1,full_name_ln2, full_name_ln3, ini_name_ln1, ini_name_ln2, ini_name_ln3, address_ln1,address_ln2, address_ln3, ci_city_id, nic,date_of_birth,gender,married_status, mobile_1,mobile_2,e_mail,home_phone,member_date,status,credit_limit,credit_limit_date,inactive_reson, c_at,m_at ) VALUES (?, ?, ?, ?,?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, NOW(), NOW())`,
      [
        customerTypeId,
        customerNumber,
        title_ln1,
        title_ln2,
        title_ln3,
        fullName_ln1,
        fullName_ln2,
        fullName_ln3,
        initials_ln1,
        initials_ln2,
        initials_ln3,
        address_ln1,
        address_ln2,
        address_ln3,
        city_id,
        nic,
        dob,
        sex,
        marital_status,
        mobile_no1,
        mobile_no2,
        email,
        telephone,
        joined_date,
        active_status,
        credit_limit,
        credit_limit_app_date,
        inactive_reason,
      ]
    );

    const ci_customer_id = customerResult.insertId;

    await conn.query(
      `INSERT INTO ci_nominee (ci_customer_id, name_ln1,name_ln2,name_ln3, date_of_birth, relationship,reg_id_num,c_at, m_at) VALUES (?,?,?,?,?,?,?, NOW(), NOW())`,
      [
        ci_customer_id,
        nominee_name_ln1,
        nominee_name_ln2,
        nominee_name_ln3,
        nominee_dob,
        nominee_relation,
        registraition_id,
      ]
    );

    await conn.query(
      `UPDATE ci_customer_type SET last_number = ${new_digit} WHERE id = ${customerType.value}`
    );
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release();
  }
}

clearFields.addEventListener("click", function () {
  document.getElementById("customerTypeDropdown").selectedIndex = 0;
  if (number_container.childElementCount > 0) {
    number_container.removeChild(h6);
  }
  document.getElementById("dropdown-0").selectedIndex = 0;
  document.getElementById("dropdown-1").selectedIndex = 0;
  document.getElementById("dropdown-2").selectedIndex = 0;
  document.getElementById("name-0").value = "";
  document.getElementById("name-1").value = "";
  document.getElementById("name-2").value = "";
  document.getElementById("fullname-0").value = "";
  document.getElementById("fullname-1").value = "";
  document.getElementById("fullname-2").value = "";
  document.getElementById("address-0").value = "";
  document.getElementById("address-1").value = "";
  document.getElementById("address-2").value = "";
  document.getElementById("nominee-name-0").value = "";
  document.getElementById("nominee-name-1").value = "";
  document.getElementById("nominee-name-2").value = "";
  document.getElementById("nicInput").value = "";
  document.getElementById("cityDropdown").selectedIndex = 0;
  document.getElementById("dobDropdown").value = "";
  document.getElementById("sexDropdown").selectedIndex = 0;
  document.getElementById("maritalStatusDropdown").selectedIndex = 0;
  document.getElementById("mobileInputOne").value = "";
  document.getElementById("mobileInputTwo").value = "";
  document.getElementById("emailInput").value = "";
  document.getElementById("telephoneInput").value = "";
  document.getElementById("nominee-relation").value = "";
  document.getElementById("regIdINput").value = "";
  document.getElementById("nomineeDobDropdown").value = "";
  document.getElementById("joinedDropdown").value = "";
  document.getElementById("activeDropdown").selectedIndex = 0;
  document.getElementById("inactiveReasonInput").value = "";
  document.getElementById("creditLimitInput").value = "";
  document.getElementById("creditLimitAppDateInput").value = "";
});

function AvoidSpace(event) {
  var k = event.key || event.which || event.keyCode;

  // Check if the pressed key is a space (ASCII code 32)
  if (k === " ") {
    // Prevent the default action (e.g., space character won't be entered)
    event.preventDefault();
    return false;
  }
}

function openPanel(event, tabId) {
  // Hide all tab panels
  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.style.display = "none";
  });

  // Remove the "active" class from all tabs
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.remove("active", "bg-blue-200");
  });

  // Show the current tab and add an "active" class to the button
  document.getElementById(tabId).style.display = "block";
  event.currentTarget.classList.add("active", "bg-blue-200");
}

async function insertData(formData) {
  let conn;
  try {
    conn = await pool.getConnection();
    const { title, initials, fullName, address, city } = formData;

    // Assuming your table has columns title, initials, full_name, address, city
    await conn.query(
      "INSERT INTO your_table (title, initials, full_name, address, city) VALUES (?, ?, ?, ?, ?)",
      [title, initials, fullName, address, city]
    );
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release();
  }
}
