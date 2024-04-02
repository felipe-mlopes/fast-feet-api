/*
  Warnings:

  - A unique constraint covering the columns `[client_email]` on the table `shippings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `client_email` to the `shippings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "shippings" ADD COLUMN     "client_email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "shippings_client_email_key" ON "shippings"("client_email");
