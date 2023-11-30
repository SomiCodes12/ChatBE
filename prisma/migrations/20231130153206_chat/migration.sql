/*
  Warnings:

  - Added the required column `image` to the `authModel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageID` to the `authModel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "authModel" ADD COLUMN     "image" STRING NOT NULL;
ALTER TABLE "authModel" ADD COLUMN     "imageID" STRING NOT NULL;
