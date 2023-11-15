const pool = require("..dgconfig.js");

document.getElementById("tab-0").click();
const customerTitle = document.getElementById("customerTitleDropdown");
const ci_city = document.getElementById("cityDropdown");
const addCustomer = document.getElementById("addCustomer");
const clearFields = document.getElementById("clearFields");
let city_id;

customerTitle.addEventListener("change", function () {
  let selectedValue = customerTitle.value;
  getCustomerNo(selectedValue);
});

ci_city.addEventListener("change", function () {
  let selectedCity = ci_city.value;
  city_id = getCityId(selectedCity);
});

clearFields.addEventListener("click", function () {
  document.getElementById("new-number").value = "";
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
  document.getElementById("nicInput").value = "";
  document.getElementById("cityDropdown").selectedIndex = 0;
  document.getElementById("dobDropdown").value = "";
  document.getElementById("cityDropdown").selectedIndex = 0;
  document.getElementById("mobileInputOne").value = "";
  document.getElementById("mobileInputTwo").value = "";
  document.getElementById("emailInput").value = "";
  document.getElementById("telephoneInput").value = "";
  document.getElementById("nominee-name").value = "";
  document.getElementById("nominee-relation").value = "";
  document.getElementById("joinedDropdown").value = "";
  document.getElementById("activeDropdown").selectedIndex = 0;
  document.getElementById("inactiveReasonInput").selectedIndex = 0;
  document.getElementById("creditLimitInput").value = "";
  document.getElementById("creditLimitAppDateInput").value = "";
});

async function getCityId(selectedCity) {
  try {
    conn = await pool.getConnection();
    const city_id = await conn.query(
      `select id from ci_city where city_ln1 = ${selectedCity})`
    );
    return city_id.id;
  } catch (error) {
    throw error;
  } finally {
    if (conn) conn.release();
  }
}

addCustomer.addEventListener("click", function () {
  const formData = {
    customerNumber: document.getElementById("new-number").value,
    title_en: document.getElementById("dropdown-0").value,
    title_ln1: document.getElementById("dropdown-1").value,
    title_ln2: document.getElementById("dropdown-2").value,
    initials_en: document.getElementById("name-0").value,
    initials_ln1: document.getElementById("name-1").value,
    initials_ln2: document.getElementById("name-2").value,
    fullName_en: document.getElementById("fullname-0").value,
    fullName_ln1: document.getElementById("fullname-1").value,
    fullName_ln2: document.getElementById("fullname-2").value,
    address_en: document.getElementById("address-0").value,
    address_ln1: document.getElementById("address-1").value,
    address_ln2: document.getElementById("address-2").value,
    nic: document.getElementById("nicInput").value,
    city: city_id,
    dob: document.getElementById("dobDropdown").value,
    sex: document.getElementById("sexDropdown").value,
    mobile_no1: document.getElementById("mobileInputOne").value,
    mobile_no2: document.getElementById("mobileInputTwo").value,
    email: document.getElementById("emailInput").value,
    telephone: document.getElementById("telephoneInput").value,
    nominee_name: document.getElementById("nominee-name").value,
    nominee_relation: document.getElementById("nominee-relation").value,
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
  let conn, cus_id, nominee_id;
  try {
    conn = await pool.getConnection();
    const {
      customerNumber,
      title_en,
      fullName_en,
      address_en,
      city,
      nic,
      dob,
      sex,
      mobile_no1,
      mobile_no2,
      email,
      telephone,
      joined_date,
      active_status,
      credit_limit,
      credit_limit_app_date,
      nominee_name,
      nominee_relation,
    } = formData;

    cus_id = await conn.query("SELECT MAX(id) as id from ci_customer");
    nominee_id = await conn.query("SELECT MAX(id) as id from ci_nominee");
    let new_cus_id = cus_id[0].id + 1;
    let new_nominee_id = nominee_id[1].id + 1;

    await conn.query(
      `INSERT INTO ci_customer (id,customer_number, title_en, full_name_en, address_en,ci_city_id, nic,date_of_birth,gender,mobile_1,mobile_2,e_mail,home_phone,member_date,status,credit_limit,credit_limit_date) VALUES (${new_cus_id}, ?, ?, ?, ?,?, ?, ?, ?, ?, ?,?,?,?,?,?,?)`,
      [
        customerNumber,
        title_en,
        fullName_en,
        address_en,
        city,
        nic,
        dob,
        sex,
        mobile_no1,
        mobile_no2,
        email,
        telephone,
        joined_date,
        active_status,
        credit_limit,
        credit_limit_app_date,
      ]
    );

    await conn.query(
      `INSERT INTO ci_nominee (id, name_ln1, relationship) VALUES (${new_nominee_id},?,?)`,
      [nominee_name, nominee_relation]
    );
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release();
  }
}

function AvoidSpace(event) {
  var k = event.key || event.which || event.keyCode;

  // Check if the pressed key is a space (ASCII code 32)
  if (k === " ") {
    // Prevent the default action (e.g., space character won't be entered)
    event.preventDefault();
    return false;
  }
}

let h6;

async function getCustomerNo(selectedValue) {
  try {
    conn = await pool.getConnection();
    const customerNumbers = await conn.query(
      `select customer_number from ci_customer where customer_type_id = (select id from ci_customer_type where type_ln1 = '${selectedValue}')`
    );

    const inputString =
      customerNumbers[customerNumbers.length - 1].customer_number;

    const new_no = incrementLastFourDigits(inputString);

    // Check if h6 element already exists
    if (!h6) {
      // If it doesn't exist, create the element
      h6 = document.createElement("h6");
      h6.setAttribute("id", "new-number");
      h6.classList.add("ml-2", "text-xl", "text-center", "p-2");
      document.getElementById("new-number").appendChild(h6);
    }

    h6.innerHTML = new_no; // Update the content of the h6 element
  } catch (error) {
    throw error;
  } finally {
    if (conn) conn.release();
  }
}

function incrementLastFourDigits(inputString) {
  const regex = /(^.*?)(\d{4})$/;
  const matches = inputString.match(regex);

  if (matches) {
    const nonDigitPart = matches[1];
    const lastFourDigits = parseInt(matches[2], 10);
    const incrementedValue = lastFourDigits + 1;
    const incrementedString =
      nonDigitPart + String(incrementedValue).padStart(4, "0");
    return incrementedString;
  }

  return inputString;
}

function openPanel(event, tabId) {
  // Hide all tab panels
  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.style.display = "none";
  });

  // Remove the "active" class from all tabs
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.remove("active");
  });

  // Show the current tab and add an "active" class to the button
  document.getElementById(tabId).style.display = "block";
  event.currentTarget.classList.add("active");
}

async function fetchData() {
  let conn;
  try {
    conn = await pool.getConnection();
    const customerTitles = await conn.query(
      "SELECT type_ln1 FROM ci_customer_type"
    );
    const cities = await conn.query("select city_ln1 from ci_city");

    return [customerTitles, cities];
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release();
  }
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

async function main() {
  try {
    const data = await fetchData();
    titles = data[0];
    cities = data[1];

    titles.forEach((title) => {
      const option = document.createElement("option");
      option.value = title.type_ln1;
      option.textContent = title.type_ln1;
      customerTitle.appendChild(option);
    });

    cities.forEach((city) => {
      const option = document.createElement("option");
      option.value = city.city_ln1;
      option.textContent = city.city_ln1;
      ci_city.appendChild(option);
    });

    // document.getElementById("new-number").createElement("h5").innerHTML = new_no;
  } catch (err) {
    console.error("Error:", err);
  }
}

main();
