-- CreateTable
CREATE TABLE "_viewed" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_viewed_AB_unique" ON "_viewed"("A", "B");

-- CreateIndex
CREATE INDEX "_viewed_B_index" ON "_viewed"("B");

-- AddForeignKey
ALTER TABLE "_viewed" ADD CONSTRAINT "_viewed_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("post_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_viewed" ADD CONSTRAINT "_viewed_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
