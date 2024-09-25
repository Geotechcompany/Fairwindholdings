# Cita Trading Groupt Frontend

This is the frontend codebase for Cita Trading Groupt, a sophisticated platform for cryptocurrency trading and market analysis.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Technologies Used](#technologies-used)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## Overview

Cita Trading Groupt is a web application that provides users with a comprehensive platform to explore, analyze, and trade various cryptocurrencies. The frontend is built using a combination of HTML, CSS, and JavaScript, with a focus on responsive design and user experience. It's now integrated with a Node.js backend for enhanced functionality.

Visit the live site: [https://terra-coin-markets.vercel.app/](https://terra-coin-markets.vercel.app/)

## Features

- Responsive design for various screen sizes
- Interactive UI elements
- Cryptocurrency market information
- User authentication (Login/Signup)
- FAQ section
- Contact form
- Multi-language support
- Real-time cryptocurrency price updates
- Integration with backend API for user authentication and data management

## Project Structure

The main structure of the frontend is as follows:

- `Frontend/`
  - `Public/`: Contains static assets and the main HTML file
    - `index.html`: Main entry point of the application
    - `css/`: Contains stylesheets
    - `js/`: Contains JavaScript files
    - `images/`: Contains image assets
  - `server/`: Node.js backend server
    - `app.js`: Main server file
    - `routes/`: API route definitions
    - `config/`: Configuration files
    - `package.json`: Backend dependencies and scripts

## Getting Started

To run this project locally:

1. Clone the repository
2. Navigate to the `Frontend/server` directory
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the `server` directory and add necessary environment variables
5. Start the server:
   ```
   npm start
   ```
6. Open `http://localhost:4000` in your browser

## Technologies Used

- Frontend:
  - HTML5
  - CSS3
  - JavaScript
  - jQuery
  - GSAP (GreenSock Animation Platform)
  - Swiper
  - Font Awesome
  - Particles.js

- Backend:
  - Node.js
  - Express.js
  - MongoDB (assumed, based on the presence of Mongoose in dependencies)
  - JSON Web Tokens (JWT) for authentication
  - Bcrypt for password hashing
  - Stripe for payment processing

## Development

For development:

1. Use `nodemon` for automatic server restarts:
   ```
   npm run dev
   ```
2. The frontend is served statically from the `Public` directory. Make changes to HTML, CSS, and JavaScript files in this directory.
3. Backend changes should be made in the `server` directory.
4. Ensure all API endpoints are properly documented and tested.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the [MIT License](LICENSE).