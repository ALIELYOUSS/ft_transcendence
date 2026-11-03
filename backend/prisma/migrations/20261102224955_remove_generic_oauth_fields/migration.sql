/*
  Warnings:

  - You are about to drop the column `provider` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `provider_id` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_provider_id_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "provider",
DROP COLUMN "provider_id";
