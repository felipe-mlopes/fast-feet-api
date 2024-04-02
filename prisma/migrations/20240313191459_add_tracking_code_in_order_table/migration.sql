/*
  Warnings:

  - Added the required column `tracking-code` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "tracking-code" TEXT NOT NULL;
