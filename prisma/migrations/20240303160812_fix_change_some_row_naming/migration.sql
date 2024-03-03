/*
  Warnings:

  - You are about to drop the column `user1` on the `Friends` table. All the data in the column will be lost.
  - You are about to drop the column `user2` on the `Friends` table. All the data in the column will be lost.
  - Added the required column `user1Id` to the `Friends` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user2Id` to the `Friends` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Friends" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user1Id" TEXT NOT NULL,
    "user2Id" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Friends" ("createdAt", "id") SELECT "createdAt", "id" FROM "Friends";
DROP TABLE "Friends";
ALTER TABLE "new_Friends" RENAME TO "Friends";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
