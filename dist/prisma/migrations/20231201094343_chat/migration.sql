/*
  Warnings:

  - Made the column `userName` on table `authModel` required. This step will fail if there are existing NULL values in that column.
  - Made the column `imageID` on table `authModel` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "authModel" ALTER COLUMN "userName" SET NOT NULL;
ALTER TABLE "authModel" ALTER COLUMN "imageID" SET NOT NULL;
