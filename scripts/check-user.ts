import { prisma } from "../lib/prisma";

async function checkUser() {
  const clerkId = process.argv[2];
  
  if (!clerkId) {
    console.error("Usage: tsx scripts/check-user.ts <clerkUserId>");
    process.exit(1);
  }
  
  console.log("Looking for user with Clerk ID:", clerkId);
  
  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: {
      flashcardSets: true,
    },
  });
  
  if (!user) {
    console.log("❌ User not found in database");
    console.log("\nCreating user...");
    
    const newUser = await prisma.user.create({
      data: {
        clerkId,
        email: `${clerkId}@temp.com`,
        plan: "free",
      },
    });
    
    console.log("✅ User created:", newUser);
  } else {
    console.log("✅ User found:");
    console.log(JSON.stringify(user, null, 2));
  }
}

checkUser()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
