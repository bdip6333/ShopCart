// Get form elements
let email = document.getElementById('email');
let password = document.getElementById('password');

// Get message elements
let error = document.getElementById("error");
let success = document.getElementById("success");

// Set initial style for error message
error.style.color = "red";

// Define login function that will be called by button click
function loginUser() {
    console.log("Login function called"); // Debug log
    
    // Reset messages
    error.textContent = "";
    success.textContent = "";
    
    // Validate required fields
    if (email.value === "" || password.value === "") {
        error.textContent = "Please enter both email and password";
        return;
    }
    
    // Get users from localStorage or initialize empty array
    let users = [];
    try {
        const storedUsers = localStorage.getItem("users");
        users = storedUsers ? JSON.parse(storedUsers) : [];
    } catch (e) {
        console.error("Error parsing users from localStorage:", e);
        users = [];
    }
    
    if (users.length > 0) {
        // Find user with matching email and password
        const currentUser = users.find(user => 
            user.email === email.value && user.password === password.value
        );
        
        if (currentUser) {
            // Store current user info in localStorage
            try {
                localStorage.setItem("currentUser", JSON.stringify({
                    firstname: currentUser.firstname,
                    lastname: currentUser.lastname,
                    email: currentUser.email
                }));
                
                // Show success message
                success.textContent = "Login successful! Redirecting...";
                success.style.color = "green";
                
                // Redirect to home/shop page
                setTimeout(function() {
                    window.location.href = "/index.html"; // Assuming shop.html is your main page
                }, 1500);
            } catch (e) {
                console.error("Error saving current user:", e);
                error.textContent = "Login failed. Please try again.";
            }
        } else {
            error.textContent = "Invalid email or password";
        }
    } else {
        error.textContent = "No registered users found. Please sign up first.";
    }
}

// Alternative method - Add event listener to login button
document.addEventListener("DOMContentLoaded", function() {
    const loginButton = document.getElementById("login");
    if (loginButton) {
        loginButton.addEventListener("click", loginUser);
        console.log("Event listener added to login button"); // Debug log
    } else {
        console.error("Login button not found in DOM");
    }
});