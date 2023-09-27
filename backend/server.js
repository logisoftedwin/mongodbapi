const mongoose = require('mongoose');
const express = require("express");
const Router = require("./routes")
const cors = require('cors');

const app = express();

//app.use(express.json());

const username = "edwin";
const password = "rf2fWVblrxIaNdK2";
const cluster = "cluster0.85grnuu";
const dbname = "testDb";

const mongoURL = `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`;

mongoose.connect(
  mongoURL
);

const db = mongoose.connection;

// Handle connection events
db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({
  limit: '50mb',
  extended: true,
  parameterLimit: 1000000 
}));

app.use(Router);

const corsOptions = { 
  origin:'http://localhost:3000',
  AccessControlAllowOrigin: '*',  
  // origin: '*',  
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE' 
}

app.use(cors(corsOptions));

app.listen(5000, () => {
  console.log("Server is running at port 5000");
});
