-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "senderName" TEXT NOT NULL DEFAULT 'Anonymous',
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT,
    "chatRoomId" TEXT,
    "senderPhoto" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Message_chatRoomId_fkey" FOREIGN KEY ("chatRoomId") REFERENCES "ChatRoom" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Message" ("chatRoomId", "content", "createdAt", "id", "receiverId", "senderId", "senderPhoto") SELECT "chatRoomId", "content", "createdAt", "id", "receiverId", "senderId", "senderPhoto" FROM "Message";
DROP TABLE "Message";
ALTER TABLE "new_Message" RENAME TO "Message";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
