/*
  Warnings:

  - A unique constraint covering the columns `[recipient_id]` on the table `notifications` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "notifications_recipient_id_key" ON "notifications"("recipient_id");
