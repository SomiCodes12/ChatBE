-- AlterTable
ALTER TABLE "authModel" ADD COLUMN     "followers" JSONB;
ALTER TABLE "authModel" ADD COLUMN     "following" JSONB;
ALTER TABLE "authModel" ADD COLUMN     "friends" JSONB;
ALTER TABLE "authModel" ADD COLUMN     "requests" JSONB;
