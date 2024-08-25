
# Find My Place

**Find My Place** is a comprehensive platform designed to help users find the perfect PG (Paying Guest) accommodation. With a user-friendly interface, detailed listings, and advanced search filters, the platform simplifies the process of finding a suitable PG based on location, amenities, and budget. It is ideal for students and working professionals looking for a comfortable and convenient stay.

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: SQL
- **Application**: SQL Workbench

## Features

- Search and filter PG accommodations based on various criteria such as location, price, amenities, and more.
- User registration and authentication for secure access.
- Listings management for PG owners to add, update, or delete their properties.
- Reviews and ratings for properties to help users make informed decisions.

## Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

- **Node.js** installed on your machine. You can download it from [Node.js official website](https://nodejs.org/).
- **MySQL Workbench** or any other SQL client to manage the SQL database. You can download it from [MySQL official website](https://dev.mysql.com/downloads/workbench/).

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/ShivamMaheshwari04/FindMyPlace
   ```


2. **Navigate into the project directory:**

   ```bash
   cd Find-My-Place
   ```

3. **Install project dependencies:**

   ```bash
   npm install
   ```

### Database Setup

1. **Configure the Database Connection:**

   There are two ways to configure the database connection:

   - **Using `.env` File** (Recommended for security):
     
     Create a `.env` file in the root of your project directory and add your MySQL database credentials:

     ```env
     DB_HOST=localhost
     DB_USER=your-username
     DB_PASSWORD=your-password
     DB_NAME=your-database-name
     ```

     Ensure you have the `dotenv` package installed to use environment variables:

     ```bash
     npm install dotenv
     ```

     Then, in your `DBConnect.js` file, use the following code to load these environment variables:

     ```javascript
     require('dotenv').config();
     const mysql = require('mysql');

     const db = mysql.createConnection({
       host: process.env.DB_HOST,
       user: process.env.DB_USER,
       password: process.env.DB_PASSWORD,
       database: process.env.DB_NAME
     });
     ```

   - **Directly in the Code**:

     If you prefer to directly include your credentials in the code (less secure), modify the `DBConnect.js` file as follows:

     ```javascript
     const mysql = require('mysql');

     const db = mysql.createConnection({
       host: 'localhost', // Database host
       user: 'your-username', // Your MySQL username
       password: 'your-password', // Your MySQL password
       database: 'your-database-name' // Your database name
     });
     ```

2. **Create Database Tables:**

   Open MySQL Workbench (or your preferred SQL client) and run the following SQL queries to create the necessary tables:

   ```sql
   CREATE TABLE user (
     user_id INT PRIMARY KEY,
     u_name VARCHAR(255) NOT NULL,
     u_email VARCHAR(255) NOT NULL UNIQUE,
     u_city VARCHAR(50) NOT NULL,
     u_State VARCHAR(50) NOT NULL,
     u_phoneNo BIGINT NOT NULL,
     u_gender VARCHAR(15) NOT NULL,
     u_password VARCHAR(255) NOT NULL,
     u_role VARCHAR(255) NOT NULL DEFAULT 'Student',
     CHECK (u_role IN ('Student', 'Employee', 'Other'))
   );

   CREATE TABLE Owner (
     Owner_id INT PRIMARY KEY,
     o_name VARCHAR(255) NOT NULL,
     o_email VARCHAR(255) NOT NULL UNIQUE,
     o_city VARCHAR(50) NOT NULL,
     o_State VARCHAR(50) NOT NULL,
     o_contactNo BIGINT NOT NULL,
     o_gender VARCHAR(15) NOT NULL,
     o_password VARCHAR(255) NOT NULL
   );

   CREATE TABLE pg_details (
     pg_id INT PRIMARY KEY,
     owner_id INT NOT NULL,
     pg_name VARCHAR(70) NOT NULL,
     p_city VARCHAR(50) NOT NULL,
     p_address VARCHAR(155) NOT NULL,
     p_State VARCHAR(50) NOT NULL,
     p_contactNo BIGINT NOT NULL,
     pincode BIGINT NOT NULL,
     pg_type VARCHAR(255) NOT NULL,
     FOREIGN KEY (owner_id) REFERENCES Owner(Owner_id)
   );
   ```

### Running the Application

After setting up the database and configuring the connection:

1. **Start the application:**

   ```bash
   npm start
   ```

2. **Access the application:**

   Open your web browser and navigate to `http://localhost:3000` (or the port specified in your configuration).

### Screenshots and Video

Include some screenshots to give a visual overview of your application:

- **Home Page**:  
  ![Home Page - 1 ](screenshots/home-page.png)

  ![Home Page - 2 ](screenshots/2.png)



- **Contact Us**:  
  ![Search Results](screenshots/Contact.png)

- **Search Results**:  
  ![Search Results](screenshots/search-results.png)

- **Property Details**:  
  ![Property Details](screenshots/property-details.png)

To see the application in action, watch the demo video:

[![Watch the demo](https://img.youtube.com/vi/YOUR_VIDEO_ID/maxresdefault.jpg)](https://www.youtube.com/watch?v=YOUR_VIDEO_ID)


### Troubleshooting

- Ensure that your MySQL server is running and that the database credentials in `DBConnect.js` or `.env` file are correct.
- If you encounter any errors related to missing dependencies, try running `npm install` again.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any questions or suggestions, please contact [your-email@example.com](mailto:your-email@example.com).

---

Feel free to update the screenshots, video link, and contact information as needed!