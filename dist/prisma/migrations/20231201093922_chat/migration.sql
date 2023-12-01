/*
  Warnings:

  - Made the column `image` on table `authModel` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "authModel" ALTER COLUMN "image" SET NOT NULL;
