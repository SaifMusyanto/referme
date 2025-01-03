const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Seed roles
    await prisma.role.createMany({
      data: [
        { role_name: 'admin' },
        { role_name: 'affiliator' },
      ],
    });
  
    console.log('Roles data created!');

  // Seed users
  await prisma.user.createMany({
    data: [
      { username: 'saif', email: 'saif@example.com', phone_number: '1234567890', password: 'password123', role_id: 2},
      { username: 'musyanto', email: 'musyanto@example.com', phone_number: '0987654321', password: 'password123', role_id: 1},
    ],
  });

  console.log('User data created!');

}

main()
  .catch((error) => {
    console.error('Error seeding data:', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
