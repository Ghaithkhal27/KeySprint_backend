/*
  Warnings:

  - You are about to drop the column `levelId` on the `Game` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[groupId]` on the table `Game` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `groupId` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_levelId_fkey";

-- DropIndex
DROP INDEX "Game_levelId_idx";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "levelId",
ADD COLUMN     "groupId" TEXT NOT NULL,
ADD COLUMN     "losses" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalMatches" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "wins" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Game_groupId_key" ON "Game"("groupId");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
