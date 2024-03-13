/*
  Warnings:

  - You are about to drop the column `recipient_id` on the `notifications` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_recipient_id_fkey";

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "recipient_id",
ADD COLUMN     "shipping_id" TEXT;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_shipping_id_fkey" FOREIGN KEY ("shipping_id") REFERENCES "shippings"("id") ON DELETE SET NULL ON UPDATE CASCADE;
