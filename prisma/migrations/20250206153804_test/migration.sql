/*
  Warnings:

  - The values [SPANISH,GERMAN,ITALIAN] on the enum `Language` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `code` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `winnerId` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the `GameModeStats` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GamePlayer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserStats` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `player1Id` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player2Id` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Language_new" AS ENUM ('ENGLISH', 'FRENCH');
ALTER TABLE "Level" ALTER COLUMN "language" DROP DEFAULT;
ALTER TABLE "Level" ALTER COLUMN "language" TYPE "Language_new" USING ("language"::text::"Language_new");
ALTER TYPE "Language" RENAME TO "Language_old";
ALTER TYPE "Language_new" RENAME TO "Language";
DROP TYPE "Language_old";
ALTER TABLE "Level" ALTER COLUMN "language" SET DEFAULT 'ENGLISH';
COMMIT;

-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_winnerId_fkey";

-- DropForeignKey
ALTER TABLE "GamePlayer" DROP CONSTRAINT "GamePlayer_gameId_fkey";

-- DropForeignKey
ALTER TABLE "GamePlayer" DROP CONSTRAINT "GamePlayer_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserStats" DROP CONSTRAINT "UserStats_rankedId_fkey";

-- DropForeignKey
ALTER TABLE "UserStats" DROP CONSTRAINT "UserStats_userId_fkey";

-- DropIndex
DROP INDEX "Game_code_idx";

-- DropIndex
DROP INDEX "Game_code_key";

-- DropIndex
DROP INDEX "Game_status_idx";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "code",
DROP COLUMN "endTime",
DROP COLUMN "startTime",
DROP COLUMN "status",
DROP COLUMN "winnerId",
ADD COLUMN     "player1Id" TEXT NOT NULL,
ADD COLUMN     "player2Id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "losses" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalMatches" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "wins" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "GameModeStats";

-- DropTable
DROP TABLE "GamePlayer";

-- DropTable
DROP TABLE "UserStats";

-- DropEnum
DROP TYPE "GameStatus";

-- CreateTable
CREATE TABLE "TypingTestText" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "timeLimit" INTEGER NOT NULL,

    CONSTRAINT "TypingTestText_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TypingTestScore" (
    "id" TEXT NOT NULL,
    "accuracy" INTEGER NOT NULL DEFAULT 0,
    "WPM" INTEGER NOT NULL DEFAULT 0,
    "rank" "RankTier" NOT NULL DEFAULT 'BRONZE',
    "typingTestTextId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "TypingTestScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TypingTestScore_typingTestTextId_key" ON "TypingTestScore"("typingTestTextId");

-- CreateIndex
CREATE UNIQUE INDEX "TypingTestScore_userId_key" ON "TypingTestScore"("userId");

-- CreateIndex
CREATE INDEX "Game_levelId_idx" ON "Game"("levelId");

-- CreateIndex
CREATE INDEX "Game_player1Id_idx" ON "Game"("player1Id");

-- CreateIndex
CREATE INDEX "Game_player2Id_idx" ON "Game"("player2Id");

-- CreateIndex
CREATE INDEX "Level_groupId_idx" ON "Level"("groupId");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_player1Id_fkey" FOREIGN KEY ("player1Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_player2Id_fkey" FOREIGN KEY ("player2Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TypingTestScore" ADD CONSTRAINT "TypingTestScore_typingTestTextId_fkey" FOREIGN KEY ("typingTestTextId") REFERENCES "TypingTestText"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TypingTestScore" ADD CONSTRAINT "TypingTestScore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
