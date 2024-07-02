-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ChatRoom" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT 'No description',
    "ownerId" TEXT,
    CONSTRAINT "ChatRoom_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ChatRoom" ("id", "name", "ownerId") SELECT "id", "name", "ownerId" FROM "ChatRoom";
DROP TABLE "ChatRoom";
ALTER TABLE "new_ChatRoom" RENAME TO "ChatRoom";
CREATE UNIQUE INDEX "ChatRoom_name_key" ON "ChatRoom"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
