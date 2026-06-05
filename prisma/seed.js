import { PrismaClient } from '@prisma/client';
import { recetario } from '../recetario_viejo.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando migración automática del recetario viejo al Seed...');
  const recetasSeleccionadas = recetario.slice(0, 25);
  let insertadas = 0;
  for (const item of recetasSeleccionadas) {
    const dataEN = item.content?.en;
    const dataES = item.content?.es;
    if (!dataEN) continue;
    const recetaParaInsertar = {
      title: dataEN.title || "Receta sin título",
      description: dataEN.description || "Sin descripción disponible.",
      ingredients: Array.isArray(dataEN.ingredients) ? dataEN.ingredients.join(', ') : '',
      instructions: Array.isArray(dataEN.instructions) ? dataEN.instructions.join(' ') : '',
      lang: "en"
    };
    await prisma.receta.create({
      data: recetaParaInsertar
    });
    insertadas++;
    if (dataES && dataES.description && !dataES.description.includes("Falta traducir")) {
      await prisma.receta.create({
        data: {
          title: dataES.title,
          description: dataES.description,
          ingredients: Array.isArray(dataES.ingredients) ? dataES.ingredients.join(', ') : '',
          instructions: Array.isArray(dataES.instructions) ? dataES.instructions.join(' ') : '',
          lang: "es"
        }
      });
      insertadas++;
    }
  }
  console.log(`✅ ¡Seeding completado! Se procesaron y migraron las recetas al formato Prisma con éxito.`);
}

main()
  .catch((e) => {
    console.error('❌ Error ejecutando el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });