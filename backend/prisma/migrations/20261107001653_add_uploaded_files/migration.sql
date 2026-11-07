-- CreateEnum
CREATE TYPE "UploadPurpose" AS ENUM ('AVATAR', 'POST', 'CHAT');

-- CreateTable
CREATE TABLE "uploaded_files" (
    "id" UUID NOT NULL,
    "owner_id" UUID NOT NULL,
    "original_name" TEXT NOT NULL,
    "storage_key" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "purpose" "UploadPurpose" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "uploaded_files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uploaded_files_storage_key_key" ON "uploaded_files"("storage_key");

-- CreateIndex
CREATE INDEX "uploaded_files_owner_id_idx" ON "uploaded_files"("owner_id");

-- AddForeignKey
ALTER TABLE "uploaded_files" ADD CONSTRAINT "uploaded_files_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
