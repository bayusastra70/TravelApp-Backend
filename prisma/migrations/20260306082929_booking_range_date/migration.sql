/*
  Warnings:

  - You are about to drop the column `bookingDate` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `endDate` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Booking_tenantId_bookingDate_idx";

-- DropIndex
DROP INDEX "Booking_vehicleId_bookingDate_idx";

-- DropIndex
DROP INDEX "Booking_vehicleId_bookingDate_key";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "bookingDate",
ADD COLUMN     "endDate" DATE NOT NULL,
ADD COLUMN     "startDate" DATE NOT NULL,
ADD COLUMN     "totalPrice" DECIMAL(12,2);

-- CreateIndex
CREATE INDEX "Booking_tenantId_startDate_idx" ON "Booking"("tenantId", "startDate");

-- CreateIndex
CREATE INDEX "Booking_vehicleId_startDate_idx" ON "Booking"("vehicleId", "startDate");
