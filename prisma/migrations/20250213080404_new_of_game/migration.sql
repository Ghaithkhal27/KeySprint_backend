/*
  Warnings:

  - You are about to drop the column `losses` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `totalMatches` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `wins` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "losses",
DROP COLUMN "totalMatches",
DROP COLUMN "wins";
