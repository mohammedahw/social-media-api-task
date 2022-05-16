/*
  Warnings:

  - You are about to drop the column `post_title` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `hasUpdatedUsername` on the `User` table. All the data in the column will be lost.
  - Added the required column `postTitle` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "post_title",
ADD COLUMN     "postTitle" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "hasUpdatedUsername",
ADD COLUMN     "has_updated_username" BOOLEAN NOT NULL DEFAULT false;
