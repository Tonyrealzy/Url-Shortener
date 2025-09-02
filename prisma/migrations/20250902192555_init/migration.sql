-- CreateTable
CREATE TABLE "public"."ShortLink" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "longUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "ShortLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShortLink_code_key" ON "public"."ShortLink"("code");
