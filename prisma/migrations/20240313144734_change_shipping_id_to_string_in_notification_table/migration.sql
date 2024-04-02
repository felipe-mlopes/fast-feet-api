/*
  Warnings:

  - Made the column `shipping_id` on table `notifications` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_shipping_id_fkey";

-- AlterTable
ALTER TABLE "notifications" ALTER COLUMN "shipping_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_shipping_id_fkey" FOREIGN KEY ("shipping_id") REFERENCES "shippings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
