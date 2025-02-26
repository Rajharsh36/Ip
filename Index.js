const express = require("express");
const app = express();

// Trust Render's proxy to get real IP
app.set("trust proxy", true);

app.get("/", (req, res) => {
    const userIP = req.headers["x-forwarded-for"] || req.ip; // Get real IP
    console.log(`Visitor IP: ${userIP}`);
    res.send(`Your IP: ${userIP}`);
});

app.listen(3000, () => console.log("Server running on port 3000"));
