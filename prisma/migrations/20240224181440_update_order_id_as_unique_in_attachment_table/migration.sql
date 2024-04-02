/*
  Warnings:

  - A unique constraint covering the columns `[order_id]` on the table `attachments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "attachments_order_id_key" ON "attachments"("order_id");
