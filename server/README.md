# Q.S-Gen Server

Backend server for the Question Paper Generator application.

## Setup

```bash
# Install dependencies
npm install

# Run server in development mode
npm run dev

# Run server in production mode
npm start
```

## API Endpoints

- `GET /api/questions` - Fetch all questions from the database

## Environment Variables

Create a `.env` file in the server directory with the following variables:

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=development
```
