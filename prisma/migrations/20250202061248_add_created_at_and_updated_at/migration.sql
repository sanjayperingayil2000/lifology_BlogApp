/*
  Warnings:

  - Added the required column `updatedAt` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post"
ADD COLUMN "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
ADD COLUMN "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL;
