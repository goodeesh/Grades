/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Grade` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Subject` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `SubjectStudents` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new__TeacherSubjects" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_TeacherSubjects_A_fkey" FOREIGN KEY ("A") REFERENCES "Subject" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_TeacherSubjects_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new__TeacherSubjects" ("A", "B") SELECT "A", "B" FROM "_TeacherSubjects";
DROP TABLE "_TeacherSubjects";
ALTER TABLE "new__TeacherSubjects" RENAME TO "_TeacherSubjects";
CREATE UNIQUE INDEX "_TeacherSubjects_AB_unique" ON "_TeacherSubjects"("A", "B");
CREATE INDEX "_TeacherSubjects_B_index" ON "_TeacherSubjects"("B");
CREATE TABLE "new__StudentSubjects" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_StudentSubjects_A_fkey" FOREIGN KEY ("A") REFERENCES "Subject" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_StudentSubjects_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new__StudentSubjects" ("A", "B") SELECT "A", "B" FROM "_StudentSubjects";
DROP TABLE "_StudentSubjects";
ALTER TABLE "new__StudentSubjects" RENAME TO "_StudentSubjects";
CREATE UNIQUE INDEX "_StudentSubjects_AB_unique" ON "_StudentSubjects"("A", "B");
CREATE INDEX "_StudentSubjects_B_index" ON "_StudentSubjects"("B");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "role" TEXT,
    "name" TEXT NOT NULL,
    "lastName" TEXT NOT NULL
);
INSERT INTO "new_User" ("email", "id", "lastName", "name", "role") SELECT "email", "id", "lastName", "name", "role" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "new_Grade" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subjectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    CONSTRAINT "Grade_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Grade_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Grade" ("date", "grade", "id", "subjectId", "userId") SELECT "date", "grade", "id", "subjectId", "userId" FROM "Grade";
DROP TABLE "Grade";
ALTER TABLE "new_Grade" RENAME TO "Grade";
CREATE TABLE "new_Subject" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "teacherId" TEXT NOT NULL,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "subjectName" TEXT NOT NULL,
    "order" INTEGER,
    "subjectDescription" TEXT NOT NULL,
    CONSTRAINT "Subject_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Subject" ("archived", "id", "order", "subjectDescription", "subjectName", "teacherId") SELECT "archived", "id", "order", "subjectDescription", "subjectName", "teacherId" FROM "Subject";
DROP TABLE "Subject";
ALTER TABLE "new_Subject" RENAME TO "Subject";
CREATE TABLE "new_SubjectStudents" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subjectId" TEXT NOT NULL,
    "userId" TEXT,
    CONSTRAINT "SubjectStudents_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SubjectStudents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_SubjectStudents" ("id", "subjectId", "userId") SELECT "id", "subjectId", "userId" FROM "SubjectStudents";
DROP TABLE "SubjectStudents";
ALTER TABLE "new_SubjectStudents" RENAME TO "SubjectStudents";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
