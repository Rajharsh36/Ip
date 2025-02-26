const express = require("express");
const app = express();

app.get("/", (req, res) => {
    console.log(`Visitor IP: ${req.ip}`); // Logs the user's IP address
    res.send("Hello, World!");
});

app.listen(3000, () => console.log("Server running on port 3000"));
