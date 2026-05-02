const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    include: { memberships: true, tasks: true }
  });
  console.log('--- USERS ---');
  console.log(JSON.stringify(users, null, 2));

  const projects = await prisma.project.findMany({
    include: { members: true, tasks: true }
  });
  console.log('\n--- PROJECTS ---');
  console.log(JSON.stringify(projects, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
