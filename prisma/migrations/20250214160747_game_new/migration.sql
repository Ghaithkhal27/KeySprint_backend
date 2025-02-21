/*
  Warnings:

  - A unique constraint covering the columns `[player1Id,player2Id,groupId]` on the table `Game` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Game_player1Id_player2Id_groupId_key" ON "Game"("player1Id", "player2Id", "groupId");
