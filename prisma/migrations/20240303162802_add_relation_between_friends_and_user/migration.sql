/*
  Warnings:

  - You are about to drop the column `user1Id` on the `Friends` table. All the data in the column will be lost.
  - You are about to drop the column `user2Id` on the `Friends` table. All the data in the column will be lost.
  - Added the required column `friendId` to the `Friends` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Friends" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "friendId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    CONSTRAINT "Friends_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Friends" ("createdAt", "id") SELECT "createdAt", "id" FROM "Friends";
DROP TABLE "Friends";
ALTER TABLE "new_Friends" RENAME TO "Friends";
CREATE UNIQUE INDEX "Friends_userId_friendId_key" ON "Friends"("userId", "friendId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
