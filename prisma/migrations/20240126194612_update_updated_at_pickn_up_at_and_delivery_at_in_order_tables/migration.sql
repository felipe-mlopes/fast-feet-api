-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "updated_at" DROP NOT NULL,
ALTER COLUMN "pickn_up_at" DROP NOT NULL,
ALTER COLUMN "delivery_at" DROP NOT NULL;
