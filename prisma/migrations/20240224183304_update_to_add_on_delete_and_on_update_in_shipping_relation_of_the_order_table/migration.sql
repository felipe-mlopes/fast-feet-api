-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_client_id_fkey";

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "shippings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
