/*
  Warnings:

  - You are about to drop the column `mode` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `timeAttackId` on the `UserStats` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "UserStats_timeAttackId_key";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "mode";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isVerified";

-- AlterTable
ALTER TABLE "UserStats" DROP COLUMN "timeAttackId";

-- DropEnum
DROP TYPE "GameMode";
