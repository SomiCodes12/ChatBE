/*
  Warnings:

  - You are about to drop the column `image` on the `authModel` table. All the data in the column will be lost.
  - You are about to drop the column `imageID` on the `authModel` table. All the data in the column will be lost.
  - Added the required column `userAvatar` to the `authModel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userAvatarID` to the `authModel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "authModel" DROP COLUMN "image";
ALTER TABLE "authModel" DROP COLUMN "imageID";
ALTER TABLE "authModel" ADD COLUMN     "userAvatar" STRING NOT NULL;
ALTER TABLE "authModel" ADD COLUMN     "userAvatarID" STRING NOT NULL;
