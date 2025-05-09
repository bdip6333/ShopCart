// Get form elements
let firstname = document.getElementById('firstname');
let lastname = document.getElementById('lastname');
let email = document.getElementById('email');
let password = document.getElementById('password');
let confirpassword = document.getElementById('confirpassword');

// Get message elements
let error = document.getElementById("error");
let success = document.getElementById("success");

// Add event listener to signup button
document.getElementById("signup").addEventListener("click", (e) => {
    // Clear previous messages
    error.textContent = "";
    success.textContent = "";
    
    // Validate form fields
    if(firstname.value === "" || lastname.value === "" || email.value === "" || password.value === "" || confirpassword.value === "") {
        error.textContent = "Please enter all required fields";
        return;
    }
    
    // Validate email format
    if (!isValidEmail(email.value)) {
        error.textContent = "Please enter a valid email address";
        return;
    }
    
    // Check if passwords match
    if(password.value !== confirpassword.value) {
        error.textContent = "Please make sure password and confirm password are equal";
        return;
    }
    
    // Get users from localStorage
    let users = JSON.parse(localStorage.getItem('users') || "[]");
    
    // Check if user already exists
    let filteredUser = users.filter((user) => user.email === email.value);
    if(filteredUser.length > 0) {
        error.textContent = "User already exists";
        return;
    }
    
    // Add new user
    users.push({
        email: email.value,
        password: password.value,
        firstname: firstname.value,
        lastname: lastname.value,
        createdAt: new Date()
    });
    
    // Save to localStorage
    localStorage.setItem("users", JSON.stringify(users));
    
    // Show success message
    success.textContent = "Account created successfully! Redirecting to login...";
    success.style.color = "green";
    
    // Clear form fields
    firstname.value = "";
    lastname.value = "";
    email.value = "";
    password.value = "";
    confirpassword.value = "";
    
    // Redirect to login page after 2 seconds
    setTimeout(() => {
        window.location.href = "login.html";
    }, 2000);
});

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}