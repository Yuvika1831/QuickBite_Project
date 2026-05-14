const { Server } = require("socket.io");
const prisma = require("./prisma/client");
const orderController = require("./controllers/orderController");

let io;

const initWebSocket = (server) => {
  if (io) return io;

  io = new Server(server, {
    cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // ---------------- REGISTER ----------------
    socket.on("register", ({ userId, role }) => {
      if (!userId || !role) return;

      socket.userData = { userId, role };

      if (role.toUpperCase() === "VENDOR") {
        socket.join(`vendor_${userId}`);
      } else if (role.toUpperCase() === "USER") {
        socket.join(`user_${userId}`);
      }

      console.log(`User ${userId} registered as ${role}`);
    });

    // ---------------- PLACE ORDER ----------------
    socket.on("place-order", async (order) => {
      try {
        const restaurant = await prisma.restaurant.findUnique({
          where: { id: order.restaurantId },
        });

        if (!restaurant) return;

        io.to(`vendor_${restaurant.ownerId}`).emit("order-received", {
          ...order,
          status: "Pending",
        });

      } catch (err) {
        console.error("❌ place-order error:", err);
      }
    });

    // ---------------- UPDATE STATUS ----------------
    socket.on("update-order-status", async (data) => {
      try {
        const { orderId, status } = data;

        const fakeReq = {
          params: { id: orderId },
          body: { status },
        };

        const fakeRes = {
          json: (response) => {
            if (!response || !response.order) {
              console.log("❌ Invalid response from controller:", response);
              return;
            }

            const order = response.order;

            console.log("🔥 SOCKET ORDER:", order);

            // ---------------- USER ----------------
            if (order.userId) {
              io.to(`user_${order.userId}`).emit(
                "order-status-updated",
                order
              );
            }

            // ---------------- VENDOR ----------------
            if (order.restaurant?.ownerId) {
              io.to(`vendor_${order.restaurant.ownerId}`).emit(
                "order-status-changed",
                order
              );
            }
          },

          status: () => fakeRes,
        };

        await orderController.updateStatus(fakeReq, fakeRes);

      } catch (err) {
        console.error("❌ socket status error:", err);
      }
    });

    // ---------------- DISCONNECT ----------------
    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  console.log("✅ WebSocket initialized");
  return io;
};

module.exports = { initWebSocket };
