/*
  Warnings:

  - Added the required column `client_state` to the `shippings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "shippings" ADD COLUMN     "client_state" TEXT NOT NULL;
