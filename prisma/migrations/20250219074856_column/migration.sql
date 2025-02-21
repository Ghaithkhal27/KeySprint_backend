/*
  Warnings:

  - You are about to drop the column `losses` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `totalMatches` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `wins` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `bio` on the `User` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "GameStatus" ADD VALUE 'ABANDONED';

-- DropIndex
DROP INDEX "User_createdAt_idx";

-- DropIndex
DROP INDEX "User_email_idx";

-- DropIndex
DROP INDEX "User_username_idx";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "losses",
DROP COLUMN "totalMatches",
DROP COLUMN "wins",
ADD COLUMN     "winnerId" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "bio",
ADD COLUMN     "totalLosses" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalMatches" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalWins" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "User_username_email_idx" ON "User"("username", "email");
