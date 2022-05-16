/*
  Warnings:

  - The primary key for the `Post` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `post_id` column on the `Post` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `userId` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `A` on the `_PostToUser` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_post_id_fkey";

-- DropForeignKey
ALTER TABLE "_PostToUser" DROP CONSTRAINT "_PostToUser_A_fkey";

-- AlterTable
ALTER TABLE "Post" DROP CONSTRAINT "Post_pkey",
ADD COLUMN     "userId" TEXT NOT NULL,
DROP COLUMN "post_id",
ADD COLUMN     "post_id" SERIAL NOT NULL,
ADD CONSTRAINT "Post_pkey" PRIMARY KEY ("post_id");

-- AlterTable
ALTER TABLE "_PostToUser" DROP COLUMN "A",
ADD COLUMN     "A" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "_PostToUser_AB_unique" ON "_PostToUser"("A", "B");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostToUser" ADD CONSTRAINT "_PostToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("post_id") ON DELETE CASCADE ON UPDATE CASCADE;
