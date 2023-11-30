/*
  Warnings:

  - Changed the type of `notice` on the `notifyModel` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "notifyModel" DROP COLUMN "notice",
ADD COLUMN     "notice" JSONB NOT NULL;
