const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

async function main() {
  // Seed roles
  console.log("Seeding Roles...");
  await prisma.role.createMany({
    data: [{ role_name: "admin" }, { role_name: "affiliator" }],
  });

  console.log("Roles data created!");

  console.log("Seeding Users...");
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
  console.log("User data created!");

  // Get the afiliator user
  const afiliatorUser = await prisma.user.findFirst({
    where: { role_id: 2 },
  });
  
  if (!afiliatorUser) {
    console.error("No afiliator user found!");
    return;
  }
  
  
  console.log("Seeding Badges...");
  await prisma.badge.createMany({
    data: [
      { badge_name: "Gold Merchant" },
      { badge_name: "Silver Merchant" },
      { badge_name: "Bronze Merchant" },
    ],
  });
  
  console.log("Badges data created!");
  
  const defaultBadge = await prisma.badge.findFirst({
    where: { badge_id: 1 },
  });
  // Get a random badge
  const badge = await prisma.badge.findFirst();

  console.log("Seeding Merchant...");
  await prisma.merchant.create({
    data: {
      user_id: afiliatorUser.user_id,
      merchant_name: "Fashion Store",
      badge_id: defaultBadge.badge_id,
      deskripsi_merchant: "fashion stylish, harga ekonomis",
      profil_image: "https://png.pngtree.com/template/20200609/ourlarge/pngtree-modern-suits-logo-vector-with-elegant-circle-clean-line-image_380765.jpg",
      banner_image: "https://1.bp.blogspot.com/-e4hIYGgeAX0/XEJmaq2BA6I/AAAAAAAARqQ/CABsKIWczYocHwYGymnYqqyfPUM3mIv9wCLcBGAs/s1600/Dannis%2BCollection.png",
      current_product_total: 10,
      max_product: 50,
    },
  });
  console.log("Merchants data created!");
}

main()
  .catch((error) => {
    console.error("Error seeding data:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
