// app.js

const express = require("express");

// db instance connection
require("./config/db");

const app = express();

const port = process.env.PORT || 3301;

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
