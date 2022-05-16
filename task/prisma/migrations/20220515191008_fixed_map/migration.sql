/*
  Warnings:

  - The primary key for the `Post` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `postId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `hasUpdatedUsername` on the `User` table. All the data in the column will be lost.
  - Added the required column `post_id` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_postId_fkey";

-- DropForeignKey
ALTER TABLE "_PostToUser" DROP CONSTRAINT "_PostToUser_A_fkey";

-- AlterTable
ALTER TABLE "Post" DROP CONSTRAINT "Post_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "postId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "post_id" TEXT NOT NULL,
ADD CONSTRAINT "Post_pkey" PRIMARY KEY ("post_id");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "hasUpdatedUsername",
ADD COLUMN     "has_updated_username" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostToUser" ADD CONSTRAINT "_PostToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("post_id") ON DELETE CASCADE ON UPDATE CASCADE;
