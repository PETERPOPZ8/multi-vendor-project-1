# Multi Vendor E-Commerce Project

## One-command run

From the project root, run:

```powershell
.
un-project.ps1
```

This starts:
- backend server on `http://localhost:5000`
- frontend static server on `http://localhost:3000`

## Setup

1. Open PowerShell in the project root:

```powershell
cd "C:\Users\ELCOT\Desktop\Multi vendor project"
```

2. Install backend dependencies:

```powershell
cd backend
npm install
```

3. Create environment file:

```powershell
copy .env.sample .env
```

4. Edit `backend/.env` and fill in:
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `RZP_KEY_ID`
- `RZP_KEY_SECRET`

## Run the full project

From the project root:

```powershell
.
un-project.ps1
```

Then open the frontend in your browser:

- `http://localhost:3000`

## Notes

- The backend API is available at `http://localhost:5000/api`
- If your frontend and backend run on different hosts/ports, update `frontend/js/*.js` and set `API_BASE = 'http://localhost:5000/api'`
- `backend/.env` should never be committed to source control
