# Multiplayer Web Application

This is a multiplayer web application where players can submit Unicode characters to a 10x10 grid, with real-time state management and socket connections. The application consists of two parts:

- **Client**: Frontend built with React and Tailwind CSS.
- **Server**: Backend powered by Node.js and Express, with MongoDB as the database.

## Prerequisites

1. **Node.js**: Install Node.js (version >= 18) from [Node.js downloads](https://nodejs.org/en/download/).
2. **MongoDB**: You need a MongoDB instance. You can either run it locally or use a cloud service like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
3. **Git**: Make sure Git is installed.

## Running the Project Locally

### Clone the Repository

```bash
git clone https://github.com/builtbysuraj/multiplayer-web.git
cd multiplayer-web
```

### 1. Running the Client

The client folder contains the React frontend.

#### Steps:

1. Navigate to the client folder.

   ```bash
   cd client
   ```

2. Install dependencies.

   ```bash
   npm install
   ```

3. Start the React development server.

   ```bash
   npm run dev
   ```

The client should now be running at `http://localhost:5173`.

### 2. Running the Server

The server folder contains the Express backend.

#### Steps:

1. Navigate to the server folder.

   ```bash
   cd server
   ```

2. Create an `.env` file in the server folder based on the `.env.sample` file (details below).

3. Install dependencies.

   ```bash
   npm install
   ```

4. Start the server.

   ```bash
   npm run dev
   ```

The server should now be running at `http://localhost:3000`.

### Environment Variables

#### `.env.sample` (for Server)

```
MONGODB_URL= # You need to add your MongoDB connection string here
```

- `MONGODB_URL`: Add your MongoDB connection string (from MongoDB Atlas or local instance).

### Congratulation 🎉🎉
