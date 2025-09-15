-- CreateTable
CREATE TABLE "public"."Structure" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "parentId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Structure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Note" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'text',
    "structureId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ClosureTable" (
    "ancestorId" INTEGER NOT NULL,
    "descendantId" INTEGER NOT NULL,
    "distance" INTEGER NOT NULL,

    CONSTRAINT "ClosureTable_pkey" PRIMARY KEY ("ancestorId","descendantId")
);

-- CreateIndex
CREATE INDEX "ClosureTable_ancestorId_idx" ON "public"."ClosureTable"("ancestorId");

-- CreateIndex
CREATE INDEX "ClosureTable_descendantId_idx" ON "public"."ClosureTable"("descendantId");

-- AddForeignKey
ALTER TABLE "public"."Structure" ADD CONSTRAINT "Structure_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Structure"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Note" ADD CONSTRAINT "Note_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "public"."Structure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
