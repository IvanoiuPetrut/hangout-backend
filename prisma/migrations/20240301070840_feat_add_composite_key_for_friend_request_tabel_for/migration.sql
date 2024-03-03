/*
  Warnings:

  - The primary key for the `FriendRequests` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `FriendRequests` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FriendRequests" (
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("from", "to")
);
INSERT INTO "new_FriendRequests" ("createdAt", "from", "status", "to") SELECT "createdAt", "from", "status", "to" FROM "FriendRequests";
DROP TABLE "FriendRequests";
ALTER TABLE "new_FriendRequests" RENAME TO "FriendRequests";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
