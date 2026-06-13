//Metodos reutilizables para validad put y post.

const isNonEmptyString = (value) => {
  return typeof value === "string" && value.trim() !== "";
};

export const validateRecetaBody = (body) => {
  const errors = [];
  const { cookingTime, servings, isGlutenFree, type, traducciones } = body;

  if (cookingTime !== undefined && typeof cookingTime !== 'number') {
    errors.push("El campo 'cookingTime' debe ser un número.");
  }
  if (servings !== undefined && typeof servings !== 'number') {
    errors.push("El campo 'servings' debe ser un número.");
  }
  if (isGlutenFree !== undefined && typeof isGlutenFree !== 'boolean') {
    errors.push("El campo 'isGlutenFree' debe ser un booleano (true/false).");
  }

  if (!traducciones || !Array.isArray(traducciones) || traducciones.length === 0) {
    errors.push("El campo 'traducciones' es obligatorio y debe ser un arreglo con al menos un idioma.");
  } else {
    traducciones.forEach((trad, index) => {
      if (!trad.lang || !['en', 'es'].includes(trad.lang)) {
        errors.push(`En la traducción [${index}]: 'lang' es obligatorio y debe ser 'en' o 'es'.`);
      }

      if (trad.ingredients !== undefined && !Array.isArray(trad.ingredients)) {
        errors.push(`En la traducción [${trad.lang}]: 'ingredients' debe ser un arreglo de strings.`);
      }
      if (trad.instruction !== undefined && !Array.isArray(trad.instruction)) {
        errors.push(`En la traducción [${trad.lang}]: 'instruction' debe ser un arreglo de strings.`);
      }
      
    });
  }

  return errors;
};

export const isBodyEmpty = (body) => {
  return (
    !body ||
    typeof body !== "object" ||
    Object.keys(body).length === 0
  );
};