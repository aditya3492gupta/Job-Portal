const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passportConfig = require("./lib/passportConfig");
const cors = require("cors");
const fs = require("fs");
const multer = require("multer");

// MongoDB
mongoose
  .connect("mongodb+srv://aditya3492gupta:foNFVVwJviK1hRY1@cluster0.yhox74u.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((res) => console.log("Connected to DB"))
  .catch((err) => console.log(err));

// Initializing directories
if (!fs.existsSync("./public")) {
  fs.mkdirSync("./public");
}
if (!fs.existsSync("./public/resume")) {
  fs.mkdirSync("./public/resume");
}
if (!fs.existsSync("./public/profile")) {
  fs.mkdirSync("./public/profile");
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public'); // Set the destination path for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Set the filename for uploaded files
  },
});

// Create a Multer instance with the specified storage configuration
const upload = multer({ storage });

const app = express();
const port = 4444;

app.use(bodyParser.json()); // Support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // Support URL-encoded bodies

// Setting up middlewares
app.use(cors());
app.use(express.json());
app.use(passportConfig.initialize());

// Routing
app.use("/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/apiRoutes"));

// Example of using Multer middleware for file uploads
app.post("/upload", upload.single("file"), (req, res) => {
  // Handle the file upload here
  res.status(200).json({ message: "File uploaded successfully" });
});

app.use("/host", require("./routes/downloadRoutes"));

app.listen(port, () => {
  console.log(`Server started on port ${port}!`);
});
