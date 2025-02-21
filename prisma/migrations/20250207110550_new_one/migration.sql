/*
  Warnings:

  - You are about to drop the column `WPM` on the `TypingTest` table. All the data in the column will be lost.
  - You are about to drop the column `accuracy` on the `TypingTest` table. All the data in the column will be lost.
  - You are about to drop the column `rank` on the `TypingTest` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `TypingTest` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "TypingTest" DROP CONSTRAINT "TypingTest_userId_fkey";

-- DropIndex
DROP INDEX "TypingTest_userId_key";

-- AlterTable
ALTER TABLE "TypingTest" DROP COLUMN "WPM",
DROP COLUMN "accuracy",
DROP COLUMN "rank",
DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "score" (
    "id" TEXT NOT NULL,
    "accuracy" INTEGER NOT NULL DEFAULT 0,
    "WPM" INTEGER NOT NULL DEFAULT 0,
    "rank" "RankTier" NOT NULL DEFAULT 'BRONZE',
    "userId" TEXT NOT NULL,

    CONSTRAINT "score_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "score_userId_key" ON "score"("userId");

-- AddForeignKey
ALTER TABLE "score" ADD CONSTRAINT "score_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
