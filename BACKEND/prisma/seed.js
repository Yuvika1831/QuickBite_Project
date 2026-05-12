const { PrismaClient, Role } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Create default admin only if NOT exists
  const adminEmail = "admin@example.com";

  const existing = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existing) {
    await prisma.user.create({
      data: {
        name: "Admin",
        email: adminEmail,
        password: "12345",
        role: Role.ADMIN,
      },
    });

    console.log("✅ Admin user created");
  } else {
    console.log("ℹ️ Admin already exists — skipping seed");
  }
}

main()
  .catch((e) => {
    console.error("❌ Seed Error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
