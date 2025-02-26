const express = require("express");
const useragent = require("user-agent-parser");

const app = express();
app.use(express.json());
app.set("trust proxy", true); // To get real IP behind proxies
app.get('/',(req,res)=>{
  res.sendFile("index.html",{root:__dirname})
})
app.get('/icon',(req,res)=>{
  res.sendFile("icon.png",{root:__dirname})
})
app.post("/api", async (req, res) => {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];
    const parsedUA = useragent(userAgent);

    // Fetch geolocation data using fetch instead of Axios
    let locationData = {};
    try {
        const response = await fetch(`http://ip-api.com/json/${ip}`);
        locationData = await response.json();
    } catch (error) {
        console.log("Failed to fetch geolocation data");
    }

    // Extract frontend data
    const { battery, internetSpeed } = req.body;

    const userData = {
        ip,
        country: locationData.country || "Unknown",
        city: locationData.city || "Unknown",
        isp: locationData.isp || "Unknown",
        timezone: locationData.timezone || "Unknown",
        browser: parsedUA.browser.name,
        os: parsedUA.os.name,
        device: parsedUA.device.type || "Desktop",
        batteryLevel: battery?.batteryLevel || "N/A",
        charging: battery?.charging ? "Yes" : "No",
        internetSpeed: internetSpeed || "N/A Mbps",
    };

    console.log("User Data Received:", userData);
    res.json({ message: "User data logged!", userData });
});

app.listen(3000, () => console.log("Server running on port 3000"));
