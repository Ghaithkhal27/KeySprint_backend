/*
  Warnings:

  - You are about to drop the `TypingTestScore` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TypingTestText` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TypingTestScore" DROP CONSTRAINT "TypingTestScore_typingTestTextId_fkey";

-- DropForeignKey
ALTER TABLE "TypingTestScore" DROP CONSTRAINT "TypingTestScore_userId_fkey";

-- DropTable
DROP TABLE "TypingTestScore";

-- DropTable
DROP TABLE "TypingTestText";

-- CreateTable
CREATE TABLE "TypingTest" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "timeLimit" INTEGER NOT NULL,
    "accuracy" INTEGER NOT NULL DEFAULT 0,
    "WPM" INTEGER NOT NULL DEFAULT 0,
    "rank" "RankTier" NOT NULL DEFAULT 'BRONZE',
    "userId" TEXT NOT NULL,

    CONSTRAINT "TypingTest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TypingTest_userId_key" ON "TypingTest"("userId");

-- AddForeignKey
ALTER TABLE "TypingTest" ADD CONSTRAINT "TypingTest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
