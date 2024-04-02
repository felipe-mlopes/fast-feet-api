/*
  Warnings:

  - You are about to drop the column `tracking-code` on the `orders` table. All the data in the column will be lost.
  - Added the required column `tracking_code` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "tracking-code",
ADD COLUMN     "tracking_code" TEXT NOT NULL;
