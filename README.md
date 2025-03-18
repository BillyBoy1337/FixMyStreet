# FixMyStreet - Pothole Complaint Management System

## Overview
FixMyStreet is a modern pothole complaint management system built using **React (Frontend)** and **Golang (Backend)**. It allows users to report potholes, track complaint statuses, and gain insights through a detailed dashboard.

The application is deployed on an **Azure VM** at **[http://20.39.248.149](http://20.39.248.149)** and leverages **Azure Cosmos DB** for data storage, **Azure Blob Storage** for file uploads, and **Docker** for containerization.

---
## Features
### 🌟 **User Features**
- **Dashboard**: View all complaints and statistics categorized by status and location.
- **Complaint Management**: Easily create, edit, and delete complaints.
- **Authentication**: Secure login using JWT.
- **File Uploads**: Users can upload images and documents to support their complaints.

### 🛠 **Admin Features**
- **Manage Complaints**: Update complaint statuses and monitor user submissions.
- **User Management**: View all users and their complaints.
- **Insights Dashboard**: Track complaint trends and generate reports.

### 🚀 **Tech Stack**
- **Frontend**: React, Vite, Material Tailwind CSS
- **Backend**: Golang
- **Database**: Azure Cosmos DB
- **Storage**: Azure Blob Storage
- **Containerization**: Docker
- **Configuration Management**: Viper
- **Logging**: Logrus
- **Authentication**: JWT

---
## Azure Function Usage
### **Endpoints**
- **`/Test`** – Checks if the application is running.
- **`/GetStats`** – Retrieves aggregated complaint statistics.

### **Cosmos DB & Container Creation**
- The script automatically checks for the existence of the Cosmos DB and container.
- If not found, it creates them to ensure smooth deployment.
- **Why?** This automation ensures the database is always available and configured correctly for new deployments.

### **Azure Blob Storage for File Uploads**
- Used to store complaint-related images and documents securely.
- Scalable, cost-efficient storage with access control for uploaded files.

---
## Deployment & Setup
### 🏗 **How to Run the Application**
1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/FixMyStreet.git
   cd FixMyStreet
   ```
2. **Grant execution permissions** to `deploy.sh`:
   ```bash
   chmod +x deploy.sh
   ```
3. **Run the deploy script**:
   - For **production**:
     ```bash
     ./deploy.sh 1
     ```
   - For **local development**:
     ```bash
     ./deploy.sh
     ```
4. **(Optional) Generate dummy complaints**:
   - **Provide permission** to `login.sh`:
     ```bash
     chmod +x login.sh
     ```
   - Run `login.sh` to extract a token (update email/password if needed).
   - Copy the token and paste it into `submit_complaints.sh`.
   - **Provide permission** to `submit_complaints.sh`:
     ```bash
     chmod +x submit_complaints.sh
     ```
   - Run the script to create dummy complaints:
     ```bash
     ./submit_complaints.sh
     ```

---
## User Roles & Permissions
| Role  | Actions |
|--------|------------------------------------------------------------------|
| **Admin** | View all complaints, update statuses, manage users, and edit complaints. |
| **User** | Create, edit, and delete their own complaints. View insights and stats. |

### **Admin Credentials**
- **Email**: `Ak@dev.com`
- **Password**: `Ak@123`

---
## Error Handling & Logging
- **Logrus** for structured logging to track application errors.
- **Viper** for configuration management to handle environment settings.

---
Here’s a revised version of your request:

## UI & Demo  
To explore the user interface, navigate to the `UI_DEMO` directory and open `Demo.md`.  
This file contains screenshots showcasing various UI components, including:  
- The **dashboard**, displaying complaint statistics and insights.  
- The **complaint submission process**, detailing step-by-step entry fields.  
- The **admin panel**, where administrators can review and manage complaints.  


---
## Future Enhancements
- **Push Notifications**: Alert users about complaint updates.
- **AI-Based Analysis**: Predict pothole severity from images.
- **Automated Moderation**: AI-driven content moderation for complaint submissions.

---
## Conclusion
FixMyStreet is an advanced, user-friendly pothole complaint management solution designed for scalability and efficiency. With **Azure services**, **Docker**, and **modern web technologies**, it ensures seamless complaint tracking and resolution.

---