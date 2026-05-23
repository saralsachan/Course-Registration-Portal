## Tech Stack
 
| Layer | Technology |
|---|---|
| Backend | Django 6, Django REST Framework |
| Auth | JSON Web Tokens (`djangorestframework-simplejwt`) |
| Database | SQLite |
| Frontend | React 18 (Vite), React Router, Axios |
| Styling | Tailwind CSS |
| CORS | `django-cors-headers` |

## Setup Instructions
 
### Prerequisites
 
- Python 3.10+
- Node.js 18+ and npm
- Git
### 1. Clone the repository
 
```bash
git clone <repository-url>
cd course-portal
```
 
### 2. Backend setup
 
```bash
cd backend
 
# Create and activate a virtual environment
python -m venv venv
 
# On Windows
venv\Scripts\activate
# On Mac / Linux
source venv/bin/activate
 
# Install dependencies
pip install -r requirements.txt
 
# Apply migrations
python manage.py makemigrations
python manage.py migrate
 
# Create an admin user (you'll be prompted for credentials)
python manage.py createsuperuser
 
# Run the development server
python manage.py runserver
```

The backend runs at **http://localhost:8000**.

### 3. Frontend setup
 
Open a **second terminal** (keep the backend running in the first):
 
```bash
cd frontend
 
# Install dependencies
npm install
 
# Run the development server
npm run dev
```
 
The frontend runs at **http://localhost:5173**.

### 3. Frontend setup
 
Open a **second terminal** (keep the backend running in the first):
 
```bash
cd frontend
 
# Install dependencies
npm install
 
# Run the development server
npm run dev
```
 
The frontend runs at **http://localhost:5173**.




