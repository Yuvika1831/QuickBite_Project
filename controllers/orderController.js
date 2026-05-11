// controllers/orderController.js
const prisma = require("../prisma/client");
const { io } = require("../webSocket"); // Must export your initialized io

// --------------------------
// PLACE ORDER
// --------------------------
const placeOrder = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const { restaurantId, items, paymentMethod = "COD", deliveryInfo } = req.body;

    if (!restaurantId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Invalid order payload" });
    }

    // Validate menu items exist
    const menuItemIds = items.map((it) => Number(it.menuItemId));
    const validMenuItems = await prisma.menuItem.findMany({
      where: { id: { in: menuItemIds } },
      select: { id: true },
    });

    const validIds = validMenuItems.map((m) => m.id);
    const invalidIds = menuItemIds.filter((id) => !validIds.includes(id));

    if (invalidIds.length > 0) {
      return res.status(400).json({
        error: `Invalid menuItemId(s): ${invalidIds.join(", ")}`
      });
    }

    // Calculate total
    const total = items.reduce(
      (sum, it) => sum + Number(it.price || 0) * Number(it.quantity || 0),
      0
    );

    // Create order
    const order = await prisma.order.create({
      data: {
        userId,
        restaurantId: Number(restaurantId),
        status: "Preparing",
        total,
        paymentMethod,
        deliveryInfo,
      },
      include: {
        items: true,
        user: { select: { id: true, name: true } },
      },
    });

    // Create order items
    const orderItemsData = items.map((it) => ({
      orderId: order.id,
      menuItemId: Number(it.menuItemId),
      quantity: Number(it.quantity),
      price: Number(it.price || 0),
    }));

    await prisma.orderItem.createMany({ data: orderItemsData });

    // Fetch restaurant owner
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: Number(restaurantId) },
    });

    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    const ownerId = restaurant.ownerId;

    // Emit notifications
    io.sockets.sockets.forEach((socket) => {
      const user = socket.userData;
      if (!user) return;

      // Vendor notification
      if (user.role === "VENDOR" && user.userId === ownerId) {
        socket.emit("order-received", order);
      }

      // Admin notification
      if (user.role === "ADMIN") {
        socket.emit("order-count-update", order);
      }

      // Ordering user confirmation
      if (user.role === "USER" && user.userId === userId) {
        socket.emit("order-created", order);
      }
    });

    res.json({ message: "Order placed successfully", order });
  } catch (err) {
    console.error("placeOrder error", err);
    res.status(500).json({ error: err.message });
  }
};

// --------------------------
// GET ORDER
// --------------------------
const getOrder = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { menuItem: true } },
        user: { select: { id: true, name: true } },
        restaurant: true,
      },
    });

    if (!order) return res.status(404).json({ error: "Order not found" });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --------------------------
// UPDATE STATUS
// --------------------------
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["Preparing", "Out for Delivery", "Delivered", "Cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const order = await prisma.order.update({
      where: { id: Number(id) },
      data: { status },
    });

    // Notify user
    io.sockets.sockets.forEach((socket) => {
      const user = socket.userData;
      if (user?.role === "USER" && user.userId === order.userId) {
        socket.emit("order-status-updated", order);
      }
    });

    res.json({ message: "Status updated", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { placeOrder, getOrder, updateStatus };
