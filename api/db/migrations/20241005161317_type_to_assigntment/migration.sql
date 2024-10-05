-- CreateEnum
CREATE TYPE "AssignmentType" AS ENUM ('GRADED', 'COMPLETION');

-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "type" "AssignmentType" NOT NULL DEFAULT 'GRADED';
