# ShopCart - E-commerce Application
![alt text](image-1.png)

## Overview
ShopCart is a responsive e-commerce web application that allows users to browse, filter, and purchase products. The application includes user authentication, product filtering, cart management, and checkout functionality.

## Features

### User Authentication
- User registration (signup)
- User login
- Persistent login sessions
- Protected routes for authenticated users

### Product Browsing
- Product display with images, descriptions, prices
- Category-based browsing
- Search functionality
- Advanced filtering options:
  - By color
  - By size
  - By price range
  - By rating

### Shopping Cart
- Add products to cart
- View cart contents
- Update product quantities
- Remove products from cart
- Cart persistence across sessions

### Checkout
- Razorpay payment integration
- Order summary

### Responsive Design
- Mobile-friendly interface
- Adapts to different screen sizes

## Project Structure

```
ShopCart/
├── index.html         # Main shopping page
├── index.js           # Main application logic
├── index.css          # Main styling
├── signup/
│   ├── signup.html    # User registration page
│   ├── signup.js      # Registration logic
│   ├── signup.css     # Registration styling
│   ├── login.html     # User login page
│   ├── login.js       # Login logic
│   └── login.css      # Login styling
└── razorpay/
    └── index.html     # Payment gateway integration
```

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Storage**: Local Storage for data persistence
- **API**: FakeStore API for product data
- **Payment**: Razorpay integration

## How to Use

1. **Setup**:
   - Clone the repository
   - Open `index.html` in your browser or set up a local server

2. **User Registration**:
   - Navigate to the Signup page
   - Enter your details to create an account

3. **Shopping**:
   - Browse products by category
   - Use filters to narrow down results
   - Search for specific products

4. **Cart Management**:
   - Add products to your cart
   - View your cart by clicking "My Cart"
   - Adjust quantities or remove items

5. **Checkout**:
   - Proceed to checkout
   - Complete payment through Razorpay

## Local Storage Usage

The application uses browser local storage for:
- User account data
- Current user session
- Shopping cart items
- Product cache

## Responsive Design

ShopCart is fully responsive with specific optimizations for:
- Desktop (>768px)
- Tablet (480px-768px)
- Mobile (<480px)

## Future Enhancements

- User profile management
- Order history
- Wishlist functionality
- Product reviews and ratings
- Backend integration for persistent data storage
- Enhanced payment options

## Credits

- Product data: [FakeStore API](https://fakestoreapi.com/)
- Payment integration: [Razorpay](https://razorpay.com/)
