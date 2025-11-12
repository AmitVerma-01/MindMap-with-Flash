import { prisma } from "../lib/prisma";
import { checkCredits, deductCredits } from "../lib/credits";

async function testUsage() {
  const testUserId = "user_test123";
  
  console.log("Testing credit system...\n");
  
  // Test 1: Check credits for new user
  console.log("1. Checking credits for new user...");
  const check1 = await checkCredits(testUserId, 5);
  console.log("Result:", check1);
  
  // Test 2: Deduct credits
  console.log("\n2. Deducting 5 credits...");
  await deductCredits(testUserId, 5);
  
  // Test 3: Check credits again
  console.log("\n3. Checking credits after deduction...");
  const check2 = await checkCredits(testUserId, 5);
  console.log("Result:", check2);
  
  // Test 4: Try to exceed limit
  console.log("\n4. Trying to generate 50 more cards (should fail)...");
  const check3 = await checkCredits(testUserId, 50);
  console.log("Result:", check3);
  
  // Cleanup
  console.log("\n5. Cleaning up test user...");
  const user = await prisma.user.findUnique({
    where: { clerkId: testUserId },
  });
  
  if (user) {
    await prisma.user.delete({
      where: { id: user.id },
    });
    console.log("Test user deleted");
  }
  
  console.log("\n✅ Test completed!");
}

testUsage()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
