-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "discount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerificationToken" TEXT,
ADD COLUMN     "emailVerificationTokenExpires" TIMESTAMP(3),
ALTER COLUMN "emailVerified" SET DEFAULT false;
