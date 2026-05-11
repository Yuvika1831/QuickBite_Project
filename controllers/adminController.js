
const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const { broadcastUpdate } = require("../webSocket"); // WebSocket helper
const prisma = new PrismaClient();

// ----------------------
// GET all featured categories
// ----------------------
router.get("/categories", async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ----------------------
// GET all featured restaurants
// ----------------------
router.get("/restaurants", async (req, res) => {
  try {
    const restaurants = await prisma.restaurant.findMany();
    res.json(restaurants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ----------------------
// TOGGLE featured category
// ----------------------
router.post("/featured-categories", async (req, res) => {
  try {
    const { id, isFeatured } = req.body;

    const updated = await prisma.category.update({
      where: { id: Number(id) },
      data: { featured: isFeatured }, // must match Prisma schema
    });

    const featuredCategories = await prisma.category.findMany({
      where: { featured: true },
    });
    broadcastUpdate("category", featuredCategories);

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ----------------------
// TOGGLE featured restaurant
// ----------------------
router.post("/featured-restaurants", async (req, res) => {
  try {
    const { id, isFeatured } = req.body;

    const updated = await prisma.restaurant.update({
      where: { id: Number(id) },
      data: { isFeatured }, // must match Prisma schema
    });

    const featuredRestaurants = await prisma.restaurant.findMany({
      where: { isFeatured: true },
    });
    broadcastUpdate("restaurant", featuredRestaurants);

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
