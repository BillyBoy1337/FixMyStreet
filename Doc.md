# FixMyStreet - Comprehensive Documentation

## Table of Contents
1. Introduction
2. System Architecture
3. Technology Stack
4. Features & Functionalities
5. Azure Services Integration
6. Deployment & Automation
7. Authentication & Security
8. Error Handling & Logging
9. Challenges Faced
10. Future Enhancements

---

## 1. Introduction
**FixMyStreet** is a robust complaint management system designed to handle pothole-related issues efficiently. The application allows users to report and track complaints while providing an intuitive dashboard for both users and administrators. The system is built using **React for frontend**, **Golang for backend**, and **Azure services for database and storage**.

The application is deployed on an **Azure VM** and leverages **Docker for containerization**, ensuring seamless deployment and scalability.

---

## 2. System Architecture
The system follows a **microservices architecture**, dividing functionality into independent services. The key components include:
- **Frontend (React + Vite)**: Provides a responsive UI for users.
- **Backend (Golang)**: Manages API logic, authentication, and database interactions.
- **Azure Cosmos DB**: Stores complaint data.
- **Azure Blob Storage**: Stores images and supporting documents.
- **Docker**: Ensures consistent deployment across environments.

**Workflow:**
1. Users submit complaints through the frontend.
2. The backend authenticates requests and processes complaint data.
3. Data is stored in Cosmos DB, and images are uploaded to Blob Storage.
4. Admins can review, update, and manage complaints.
5. Users can track complaint statuses via the dashboard.

---

## 3. Technology Stack
The following technologies power FixMyStreet:

### **Frontend**
- React + Vite (For performance optimization)
- Material Tailwind CSS (For a modern UI)

### **Backend**
- Golang (Concurrency and performance efficiency)
- Logrus (For structured logging)
- Viper (For configuration management)

### **Database & Storage**
- Azure Cosmos DB (NoSQL, scalable data storage)
- Azure Blob Storage (Efficient file storage)

### **Authentication & Security**
- JWT (Secure user authentication)
- Role-based access control (Admin & User roles)

### **Deployment**
- Docker (Containerized microservices)
- Azure Virtual Machine (Cloud hosting)

---

## 4. Features & Functionalities

### **User Features**
✔ **Complaint Submission**: Users can report potholes with images and descriptions.
✔ **Complaint Tracking**: Users can track the status of their complaints.
✔ **Dashboard Analytics**: Users can view complaint trends by village and category.
✔ **Edit & Delete Complaints**: Users have control over their own complaints.

### **Admin Features**
✔ **Manage Complaints**: Admins can view and update complaints.
✔ **User Management**: Admins monitor and manage user activities.
✔ **Statistical Insights**: Visual representation of complaint data.

---

## 5. Azure Services Integration

### **Cosmos DB & Container Creation**
- Cosmos DB is a NoSQL database, optimized for scalability.
- Containers are created dynamically if they don’t exist, preventing manual setup errors.
- **Why?** This ensures that the system remains automated and resilient to failures.

### **Blob Storage for File Uploads**
- Complaint-related images and documents are stored securely.
- **Why use Blob Storage?**
  - Scalable and cost-effective
  - Secure access control
  - Fast retrieval and CDN support

---

## 6. Deployment & Automation

### **Deployment Steps**
1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/FixMyStreet.git
   cd FixMyStreet
   ```
2. **Provide execution permission to `deploy.sh`**:
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

### **Automation Scripts**
- `deploy.sh` handles environment-based configurations and builds Docker images.
- `login.sh` extracts JWT tokens for automated authentication.
- `submit_complaints.sh` submits dummy complaints for testing.

- _`login.sh`_ and _`submit_complaints.sh`_ are in the `scripts` folder.


---

## 7. Authentication & Security

### **JWT Authentication**
- Users authenticate using JSON Web Tokens (JWT).
- Admins have special credentials for privileged access.

### **Role-Based Access Control (RBAC)**
| Role  | Actions |
|--------|------------------------------------------------------------------|
| **Admin** | Can view all complaints, update statuses, manage users, and edit complaints. |
| **User** | Can create, edit, and delete their own complaints. Can view complaint insights. |

### **Admin Credentials**
- **Email**: `Ak@dev.com`
- **Password**: `Ak@123`

---

## 8. Error Handling & Logging

### **Logrus for Logging**
- Ensures structured logs for debugging and monitoring.

### **Viper for Configuration Management**
- Manages environment-specific configurations dynamically.

### **Error Handling**
- Well-structured error messages for user-friendly feedback.
- API returns meaningful HTTP status codes.

---

## 9. Challenges Faced

1. **Scaling the System**
   - Challenge: Handling multiple user requests efficiently.
   - Solution: Used Golang’s concurrency model to optimize request handling.

2. **Securing File Uploads**
   - Challenge: Preventing malicious file uploads.
   - Solution: Used Azure Blob Storage with strict MIME type validation.

3. **Managing Deployment Configurations**
   - Challenge: Seamless switching between local and production environments.
   - Solution: Used Viper to load configurations dynamically based on environment variables.

---

## 10. Future Enhancements

🔹 **Push Notifications**: Notify users when complaint status changes.
🔹 **AI-Based Image Analysis**: Predict pothole severity from images.
🔹 **Automated Moderation**: AI-powered content filtering.

---

## Conclusion
FixMyStreet is an end-to-end solution for pothole complaint management, offering scalability, security, and automation. The project efficiently integrates modern technologies to provide a seamless user experience, ensuring complaints are efficiently managed and addressed.

---

## Application UI & Demo
(Screenshots of the dashboard, complaint submission, and admin panel go here.)

