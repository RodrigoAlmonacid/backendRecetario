import { PrismaClient } from '@prisma/client';
import { recetario } from '../recetario_viejo.js';
import  bcrypt  from 'bcrypt'

const prisma = new PrismaClient();

async function main() {
  console.log('Inicializando migración de recetas...');
  const usuariosPrueba = [
    { email: "sol@prueba.com", pass: await bcrypt.hash("Sol123", 10), rol: "administrador" }, //hasheo con bcrypt tp seguridad
    { email: "nico@prueba.com", pass: await bcrypt.hash("Nico123", 10), rol: "administrador" },
    { email: "rodrigo@prueba.com", pass: await bcrypt.hash("Rodrigo123", 10), rol: "administrador"  },
    { email: "profeagus@prueba.com", pass: await bcrypt.hash("Agus123", 10), rol: "administrador" },
    { email: "profelucas@prueba.com", pass: await bcrypt.hash("Lucas123", 10), rol: "administrador" },
  ];

  for (const usuario of usuariosPrueba) {
    await prisma.usuario.upsert({
      where: { email: usuario.email },
      update: {},
      create: usuario,
    });
  }
  console.log('Usuarios de prueba creados con éxito...');

  let insertadas = 0;
  for (const receta of recetario) {
    const dataEN = receta.content?.en || null;
    const dataES = receta.content?.es || null;

    if (!dataEN && !dataES) continue;

    const traducciones = [];
    if (dataEN) {
      traducciones.push({
        lang: "en",
        title: dataEN.title || "Recipe without title.",
        description: dataEN.description || "No description available.",
        ingredients: Array.isArray(dataEN.ingredients) ? dataEN.ingredients : [],
        instruction: Array.isArray(dataEN.instructions) ? dataEN.instructions : []
      });
    }
    else {
      console.log('No se encontró versión en inglés de la receta');
    }

    if (dataES) {
      traducciones.push({
        lang: "es",
        title: dataES.title || "Receta sin título",
        description: dataES.description || "Sin descripción disponible.",
        ingredients: Array.isArray(dataES.ingredients) ? dataES.ingredients : [],
        instruction: Array.isArray(dataES.instructions) ? dataES.instructions : []
      });
    }
    else {
      console.log('No se encontró versión en español de la receta');

    }

    await prisma.receta.create({
      data: {
        urlImagen: receta.image || "https://nftcalendar.io/storage/uploads/2022/02/21/image-not-found_0221202211372462137974b6c1a.png",
        cookingTime: Number(receta.cookingTime) || 0,
        servings: Number(receta.servings) || 0,
        isGlutenFree: receta.dietary?.isGlutenFree ?? false,
        type: receta.dietary?.type || "otros",

        traducciones: {
          create: traducciones
        }
      }
    });
    insertadas++;
  }

    console.log('Seed ejecutado...');
    console.log(`Total de recetas creadas: ${insertadas}`);
}

main()
  .catch((e) => {
    console.error('❌ Error ejecutando el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });