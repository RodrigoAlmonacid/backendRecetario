/*
  Warnings:

  - You are about to drop the column `nombreUsuario` on the `usuario` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rol` to the `usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "usuario_nombreUsuario_key";

-- AlterTable
ALTER TABLE "usuario" DROP COLUMN "nombreUsuario",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "rol" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");
