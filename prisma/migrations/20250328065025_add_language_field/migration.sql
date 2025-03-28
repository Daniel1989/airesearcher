-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Meeting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "topic" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "language" TEXT NOT NULL DEFAULT 'chinese',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Meeting" ("createdAt", "description", "id", "status", "title", "topic", "updatedAt") SELECT "createdAt", "description", "id", "status", "title", "topic", "updatedAt" FROM "Meeting";
DROP TABLE "Meeting";
ALTER TABLE "new_Meeting" RENAME TO "Meeting";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
