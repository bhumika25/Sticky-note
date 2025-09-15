-- AlterTable
ALTER TABLE "public"."Note" ADD COLUMN     "attachments" JSONB,
ADD COLUMN     "tags" JSONB;
