## Setting Up and Running Poma-MVP Locally

### Prerequisites
* Node.js and npm (or yarn) installed on your system.

### Steps:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/poma-mvp.git
   ```
2. **Navigate to the Project Directory:**
   ```bash
   cd poma-mvp
   ```
3. **Open Two Terminals:**
   * Open two new terminal windows or tabs within the same directory.

### Starting the Frontend:

* **Navigate to the Frontend Directory:**
  ```bash
  cd frontend
  ```
* **Update Environment Variables (if necessary):**
  Modify the `BACKEND_URL` in `frontend/src/config.tsx` to match your local backend URL. For local development, it's usually [http://localhost:3000](http://localhost:3000).
* **Install Dependencies:**
  ```bash
  npm install
  ```
* **Start the Development Server:**
  ```bash
  npm run dev
  ```
  The frontend will be accessible at [http://localhost:5173](http://localhost:5173).

### Starting the Backend:

* **Navigate to the Backend Directory:**
  ```bash
  cd backend
  ```
* **Create a `.env` File:**
  Copy the contents from `backend/.env.sample` to a new file named `.env` and replace the placeholder values with your actual credentials and configuration.
* **Install Dependencies:**
  ```bash
  npm install
  ```
* **Start the Development Server:**
  ```bash
  npm run dev
  ```
  The backend will be running at [http://localhost:3000](http://localhost:3000).

**Note:** Ensure both the frontend and backend servers are running before accessing the application.
