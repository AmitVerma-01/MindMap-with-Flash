/*
  Warnings:

  - You are about to drop the `UsageRecord` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UsageRecord" DROP CONSTRAINT "UsageRecord_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "creditsUsed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "currentPeriodStart" TIMESTAMP(3),
ADD COLUMN     "monthlyCredits" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "plan" DROP NOT NULL,
ALTER COLUMN "plan" DROP DEFAULT;

-- DropTable
DROP TABLE "UsageRecord";
