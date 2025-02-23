// 🚨 SQL Injection Vulnerability (Should trigger a warning)
let userId = "123";
let query = "SELECT * FROM users WHERE id = " + userId;
console.log(query);

// 🚨 XSS Vulnerability (Should trigger a warning)
let userInput = "<script>alert('XSS');</script>";
document.getElementById("output").innerHTML = userInput;

// ✅ Secure SQL Query (No warning should appear)
let secureQuery = db.query("SELECT * FROM users WHERE id = ?", [userId]);

// ✅ Secure XSS Prevention (No warning should appear)
document.getElementById("output").textContent = userInput;
