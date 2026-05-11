const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");

dotenv.config();

const app = express();

// -----------------------------------
// Serve uploaded images
// -----------------------------------
app.use("/uploads", express.static("uploads"));

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.json());


// -----------------------------------
// ROUTES
// -----------------------------------

// Auth Routes
app.use("/api/auth", require("./routes/authRoutes"));

// User Routes
app.use("/api/users", require("./routes/userRoutes"));

// Restaurant Routes
app.use(
  "/api/restaurants",
  require("./routes/restaurantRoutes")
);

// Order Routes
app.use("/api/orders", require("./routes/orderRoutes"));

// Vendor Routes
app.use("/api/vendor", require("./routes/vendorRoutes"));

// Admin Routes
app.use("/api/admin", require("./routes/adminRoutes"));

// Membership Routes
app.use(
  "/api/membership",
  require("./routes/membershipRoutes")
);

// ✅ Coupon Routes (IMPORTANT FIX)
app.use(
  "/api/coupons",
  require("./routes/couponRoutes")
);
app.use("/api/chat", require("./routes/chatbotRoutes"));

// -----------------------------------
// TEST ROUTE
// -----------------------------------
app.get("/", (req, res) => {
  res.send("QuickBite Backend is Running!");
});


// -----------------------------------
// SOCKET SERVER
// -----------------------------------
const server = http.createServer(app);

const { initWebSocket } = require("./webSocket");
initWebSocket(server);


// -----------------------------------
// START SERVER
// -----------------------------------
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(
    `✅ Server running on port ${PORT}`
  );
});