const express = require("express");
const UAParser = require("ua-parser-js");

const app = express();
app.use(express.json());
app.set("trust proxy", true); // Ensures correct IP retrieval behind proxies
app.get('/',(req,res)=>{
  res.sendFile("index.html",{root:__dirname})
})
app.get('/icon',(req,res)=>{
  res.sendFile("icon.png",{root:__dirname})
})
const getClientIPs = (req) => {
    const forwarded = req.headers["x-forwarded-for"];
    const proxyIPs = forwarded ? forwarded.split(",").map(ip => ip.trim()) : [];
    const remoteIP = req.socket.remoteAddress;
    return [...proxyIPs, remoteIP]; // Return all IPs
};

app.post("/api", async (req, res) => {
    const ipAddresses = getClientIPs(req);
    const parser = new UAParser(req.headers["user-agent"]);
    const browser = parser.getBrowser().name || "Unknown";
    const os = parser.getOS().name || "Unknown";
    const device = parser.getDevice().model || "Desktop";

    let locationData = {};
    try {
        const response = await fetch(`http://ip-api.com/json/${ipAddresses[0]}`);
        locationData = await response.json();
    } catch (error) {
        console.log("Failed to fetch geolocation data:", error.message);
    }

    const { battery, internetSpeed } = req.body;

    const userData = {
        ipAddresses, // Include all IPs
        country: locationData.country || "Unknown",
        city: locationData.city || "Unknown",
        isp: locationData.isp || "Unknown",
        timezone: locationData.timezone || "Unknown",
        browser,
        os,
        device,
        batteryLevel: battery?.batteryLevel || "N/A",
        charging: battery?.charging ? "Yes" : "No",
        internetSpeed: internetSpeed || "N/A Mbps",
    };

    console.log("User Data Received:", userData);
    res.json({ message: "User data logged!", userData });
});

app.listen(3000, () => console.log("Server running on port 3000"));
