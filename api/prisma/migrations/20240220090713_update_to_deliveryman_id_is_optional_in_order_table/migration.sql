-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_deliveryman_id_fkey";

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "deliveryman_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_deliveryman_id_fkey" FOREIGN KEY ("deliveryman_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
