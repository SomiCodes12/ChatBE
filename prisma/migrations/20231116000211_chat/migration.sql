-- CreateTable
CREATE TABLE "notifyModel" (
    "id" TEXT NOT NULL,
    "notice" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifyModel_pkey" PRIMARY KEY ("id")
);
