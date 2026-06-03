-- CreateTable
CREATE TABLE "Receta" (
    "idReceta" SERIAL NOT NULL,
    "urlImagen" TEXT NOT NULL,
    "cookingTime" INTEGER NOT NULL,
    "servings" INTEGER NOT NULL,
    "isGlutenFree" BOOLEAN NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Receta_pkey" PRIMARY KEY ("idReceta")
);

-- CreateTable
CREATE TABLE "Traduccion" (
    "lang" TEXT NOT NULL,
    "idReceta" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ingredients" TEXT[],
    "instruction" TEXT[],

    CONSTRAINT "Traduccion_pkey" PRIMARY KEY ("idReceta","lang")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "idUsuario" SERIAL NOT NULL,
    "nombreUsuario" TEXT NOT NULL,
    "pass" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("idUsuario")
);

-- CreateTable
CREATE TABLE "Favorites" (
    "idReceta" INTEGER NOT NULL,
    "idUsuario" INTEGER NOT NULL,

    CONSTRAINT "Favorites_pkey" PRIMARY KEY ("idReceta","idUsuario")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_nombreUsuario_key" ON "Usuario"("nombreUsuario");

-- AddForeignKey
ALTER TABLE "Traduccion" ADD CONSTRAINT "Traduccion_idReceta_fkey" FOREIGN KEY ("idReceta") REFERENCES "Receta"("idReceta") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorites" ADD CONSTRAINT "Favorites_idReceta_fkey" FOREIGN KEY ("idReceta") REFERENCES "Receta"("idReceta") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorites" ADD CONSTRAINT "Favorites_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("idUsuario") ON DELETE CASCADE ON UPDATE CASCADE;
