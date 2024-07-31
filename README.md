TOPSIS Score Calculation This project provides a full stack solution for calculating TOPSIS scores. The process involves uploading a CSV file with the necessary data, processing it to generate the TOPSIS scores, and then sharing the results via email and a downloadable link. Here are the key components and the flow of the project:

Features File Upload: Allows users to upload a CSV file containing the data. Email Notification: Sends the results to the user via email. Download Link: Provides a secure link to download the results. Cloud Storage: Stores the results securely using Cloudinary. Nodemailer Integration: Facilitates email communication

Technology Stack Backend: Node.js, Express.js Frontend: HTML, CSS, JavaScript Database/Storage: Cloudinary Email Service: Nodemailer

Flow of the Project

Input Collection: User inputs CSV file, weights, email, and impacts. Optionally asks the user whether to drop the first column (typically used for unique identifiers like roll numbers or names).

Data Parsing: Parses the CSV data. Validates the dimensions of the CSV file against the provided weights and impacts.

TOPSIS Calculation: If validation is successful, applies the TOPSIS method to the data. Generates an output file with the TOPSIS scores.

File Storage: Uploads the output file to Cloudinary. Generates a secure URL for the uploaded file.

Notification and Access: Sends an email to the user with the secure URL to download the results. Displays the download link on the screen for the user.
