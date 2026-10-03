# GharDekho MongoDB & Express Backend

Full-featured RESTful API backend built with **Node.js**, **Express**, and **Mongoose** connected to **MongoDB**.

---

## 🗄️ Database Architecture & Collections

The backend organizes data into 5 core MongoDB collections:

| Collection | Model File | Description |
| :--- | :--- | :--- |
| **`users`** | `src/models/User.js` | User profiles with bcrypt password hashing, roles (`BUYER`, `OWNER`, `DEALER`, `ADMIN`), saved properties (favorites), and dealer subscription status. |
| **`properties`** | `src/models/Property.js` | Real estate listings (Buy/Rent), pricing, specs, amenities, coordinates, image galleries, and moderation status (`PUBLISHED`, `PENDING_APPROVAL`, `REJECTED`, `DRAFT`). Includes text indexes for search. |
| **`inquiries`** | `src/models/Inquiry.js` | Buyer lead inquiries sent to property owners or dealers, with status tracking (`NEW`, `CONTACTED`, `CLOSED`). |
| **`transactions`** | `src/models/Transaction.js` | Payment transaction records for dealer subscriptions. |
| **`plans`** | `src/models/Plan.js` | Dealer subscription plans (Quarterly, Half-Year, Annual). |

---

## ⚙️ Configuration (`.env`)

Backend environment variables are configured in `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ghardekho
JWT_SECRET=ghardekho_jwt_secret_dev_key_2026_xyz987
CLIENT_URL=http://localhost:5173
```

---

## 🚀 How to Run

### 1. Make sure MongoDB is Running

#### If using Local MongoDB:
- Ensure the MongoDB Windows service is started, or start `mongod` in a terminal:
  ```powershell
  # If MongoDB is installed as a Windows service:
  net start MongoDB

  # Or manually run mongod:
  mongod --dbpath "C:\data\db"
  ```

#### If using MongoDB Atlas (Cloud):
- Set your Atlas connection URI in `server/.env`:
  ```env
  MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/ghardekho?retryWrites=true&w=majority
  ```

### 2. Start the Backend Server
From the root project folder:
```powershell
npm run server
# or with live file reload:
npm run server:dev
```
The server will automatically connect to MongoDB, seed sample data on first run if the database is empty, and start listening on `http://localhost:5000`.

### 3. Seed or Reset Data Anytime
To wipe and reseed clean sample data (properties, users, subscription plans, inquiries):
```powershell
npm run seed
```

### 4. Start the Frontend
In another terminal:
```powershell
npm run dev
```
The frontend connects through the Vite proxy (`/api` -> `http://localhost:5000/api/v1`).

---

## 🔑 Seeded Demo Accounts (Password: `password123`)

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Buyer** | `buyer@ghardekho.com` | `password123` | Browses properties, sends inquiries, saves favorites |
| **Owner** | `owner@ghardekho.com` | `password123` | Direct owner listings (phone always public) |
| **Dealer (Subscribed)** | `dealer.sub@ghardekho.com` | `password123` | Active subscription (phone unmasked) |
| **Dealer (Unsubscribed)**| `dealer.unsub@ghardekho.com` | `password123` | Inactive subscription (phone masked by backend) |
| **Admin** | `admin@ghardekho.com` | `password123` | Full admin moderation access |
