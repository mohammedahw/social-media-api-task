/*
  Warnings:

  - The primary key for the `Post` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `post_id` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `has_updated_username` on the `User` table. All the data in the column will be lost.
  - Added the required column `postId` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_post_id_fkey";

-- DropForeignKey
ALTER TABLE "_PostToUser" DROP CONSTRAINT "_PostToUser_A_fkey";

-- AlterTable
ALTER TABLE "Post" DROP CONSTRAINT "Post_pkey",
DROP COLUMN "created_at",
DROP COLUMN "post_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "postId" TEXT NOT NULL,
ADD CONSTRAINT "Post_pkey" PRIMARY KEY ("postId");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "has_updated_username",
ADD COLUMN     "hasUpdatedUsername" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_postId_fkey" FOREIGN KEY ("postId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostToUser" ADD CONSTRAINT "_PostToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("postId") ON DELETE CASCADE ON UPDATE CASCADE;
