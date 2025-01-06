const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

async function main() {
  // Seed roles
  await prisma.role.createMany({
    data: [{ role_name: "admin" }, { role_name: "affiliator" }],
  });

  console.log("Roles data created!");

  console.log("User data created!");

  const seedData = async () => {
    const hashedPasswordAdmin = await bcrypt.hash("@admin123", 10); // 10 adalah salt rounds
    const hashedPasswordAfiliator = await bcrypt.hash("@Afiliator123", 10); // 10 adalah salt rounds
    await prisma.user.createMany({
      data: [
        {
          username: "admin",
          email: "admin@admin.com",
          phone_number: "1234567890",
          password: hashedPasswordAdmin,
          role_id: 1,
        },
        {
          username: "afiliator",
          email: "afiliator@afiliator.com",
          phone_number: "1234567890",
          password: hashedPasswordAfiliator,
          role_id: 2,
        },
      ],
    });
  };

  seedData()
    .then(() => {
      console.log("User seeded successfully");
    })
    .catch((err) => {
      console.error("Error seeding user:", err);
    });
}

main()
  .catch((error) => {
    console.error("Error seeding data:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
