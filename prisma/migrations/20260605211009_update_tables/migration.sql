/*
  Warnings:

  - You are about to drop the `Favorites` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Receta` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Traduccion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Usuario` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Favorites" DROP CONSTRAINT "Favorites_idReceta_fkey";

-- DropForeignKey
ALTER TABLE "Favorites" DROP CONSTRAINT "Favorites_idUsuario_fkey";

-- DropForeignKey
ALTER TABLE "Traduccion" DROP CONSTRAINT "Traduccion_idReceta_fkey";

-- DropTable
DROP TABLE "Favorites";

-- DropTable
DROP TABLE "Receta";

-- DropTable
DROP TABLE "Traduccion";

-- DropTable
DROP TABLE "Usuario";

-- CreateTable
CREATE TABLE "receta" (
    "idReceta" SERIAL NOT NULL,
    "urlImagen" TEXT NOT NULL,
    "cookingTime" INTEGER NOT NULL,
    "servings" INTEGER NOT NULL,
    "isGlutenFree" BOOLEAN NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "receta_pkey" PRIMARY KEY ("idReceta")
);

-- CreateTable
CREATE TABLE "content" (
    "lang" TEXT NOT NULL,
    "idReceta" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ingredients" TEXT[],
    "instruction" TEXT[],

    CONSTRAINT "content_pkey" PRIMARY KEY ("idReceta","lang")
);

-- CreateTable
CREATE TABLE "usuario" (
    "idUsuario" SERIAL NOT NULL,
    "nombreUsuario" TEXT NOT NULL,
    "pass" TEXT NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("idUsuario")
);

-- CreateTable
CREATE TABLE "favorites" (
    "idReceta" INTEGER NOT NULL,
    "idUsuario" INTEGER NOT NULL,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("idReceta","idUsuario")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_nombreUsuario_key" ON "usuario"("nombreUsuario");

-- AddForeignKey
ALTER TABLE "content" ADD CONSTRAINT "content_idReceta_fkey" FOREIGN KEY ("idReceta") REFERENCES "receta"("idReceta") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_idReceta_fkey" FOREIGN KEY ("idReceta") REFERENCES "receta"("idReceta") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "usuario"("idUsuario") ON DELETE CASCADE ON UPDATE CASCADE;
