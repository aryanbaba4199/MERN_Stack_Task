
# MERN Stack Project

The task involves developing a web application that allows users to browse through a list of products categorized by various parameters. Users can to sort and filter products based on criteria such as categories, price range, gender, occasion, and discount. Furthermore, the application is empower users to seamlessly edit and delete their selected products.




## Github Repo :

https://github.com/aryanbaba4199/MERN_Stack_Task

### Video Explaination :
https://drive.google.com/file/d/1uI2bJvfAmD5s9_OatvYE5Dd191QSNp7b/view?usp=drive_link

### Setting up the project




## Installation

1. Clone the Repo : 

```bash
  https://github.com/aryanbaba4199/MERN_Stack_Task
```
2. Import the product_database.sql file in to your MySQL database (you can use phpMyAdmin).
3. Update the .env file with your own MySQL credentials.

```bash
 DB_NAME = "Your Database Name"
HOST = "Your host link by default it will localhost"
USER_NAME = "Enter your userName"
PASSWORD = "Enter your password"
```
4. Run 
```bash
  npm install --force
```
5. Start the project using 
```bash
  npm run dev
```
6.  Access the website at
```bash
  http://localhost:3000
```
7. Setup the database, You would need mysql and workbench for the database. You can get it from here: https://dev.mysql.com/downloads/installer. To Import data in do refer to this document: https://dev.mysql.com/doc/workbench/en/wb-admin-export-import-management.html

* Project Setup is completed 
    

    
## Features

- **Pagination** -```  There is a new pagination function where users can view 10 products per page by default. Users can also choose to view 10, 25, or 50 products per page.```

- **Sorting** -```  Users can sort the products according to price, creation date, rating, etc.```

- **Filter** -```Users can filter products by brand, category, price range, gender, occasion, and discount. These filters highlight selected options, providing a customized shopping experience. The system ensures easy and efficient browsing, allowing users to quickly find products that meet their specific criteria. ```
- **Add Product** -```Users can create new products by filling out a form with details such as name, category, price, and description, and submitting it to add the product to the list. ```

- **Edit and Update Product** -```Users can edit and update product details by selecting a product, modifying the information, and saving the changes to reflect the updates in the products ```

- **Delete Product** -```Users can delete products by selecting the product and confirming the deletion to remove it from the list. ```








## Conclusion : 
This project demonstrates the capabilities of a MERN stack application in providing a seamless and user-friendly interface for managing a product catalog. The implemented features, including pagination, sorting, filtering, and CRUD operations, ensure an efficient and customized user experience.

i appreciate your interest in this project and hope that the clear setup instructions and comprehensive feature set meet your expectations. For any further inquiries or contributions, please feel free to reach out or submit a pull request.

Thank you for your time and happy coding!



