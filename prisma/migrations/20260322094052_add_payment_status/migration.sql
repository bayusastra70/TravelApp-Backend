/*
  Warnings:

  - The values [PENDING,CASH] on the enum `PaymentStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentStatus_new" AS ENUM ('UNPAID', 'DP_PENDING', 'DP_PAID', 'PAID');
ALTER TABLE "public"."Booking" ALTER COLUMN "paymentStatus" DROP DEFAULT;
ALTER TABLE "Booking" ALTER COLUMN "paymentStatus" TYPE "PaymentStatus_new" USING ("paymentStatus"::text::"PaymentStatus_new");
ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "public"."PaymentStatus_old";
ALTER TABLE "Booking" ALTER COLUMN "paymentStatus" SET DEFAULT 'UNPAID';
COMMIT;

-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "paymentStatus" SET DEFAULT 'UNPAID';
