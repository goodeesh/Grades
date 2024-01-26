-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Subject" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "teacherId" INTEGER NOT NULL,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "subjectName" TEXT NOT NULL,
    "subjectDescription" TEXT NOT NULL,
    CONSTRAINT "Subject_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Subject" ("id", "subjectDescription", "subjectName", "teacherId") SELECT "id", "subjectDescription", "subjectName", "teacherId" FROM "Subject";
DROP TABLE "Subject";
ALTER TABLE "new_Subject" RENAME TO "Subject";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
