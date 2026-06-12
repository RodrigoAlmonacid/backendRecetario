//Metodos reutilizables para validad put y post.

const isNonEmptyString = (value) => {
  return typeof value === "string" && value.trim() !== "";
};

const validateRecetaBody = (body) => {
  const errors = [];
  const { title, description, ingredients, instructions, lang } = body;
  // si title es "falsy" , es un tipo string y saca los espacios en blanco. 
  if (!title || typeof title !== 'string' || title.trim() === "") {
    errors.push("El campo 'title' es obligatorio.");
  }
  if (!description || typeof description !== 'string' || description.trim() === "") {
    errors.push("El campo 'description' es obligatorio.");
  }
  if (typeof ingredients !== 'string') {
    errors.push("El campo 'ingredients' es obligatorio y debe ser un string (puede ser vacío).");
  }
  if (typeof instructions !== 'string') {
    errors.push("El campo 'instructions' es obligatorio y debe ser un string (puede ser vacío).");
  }
  if (!lang || !['en', 'es'].includes(lang)) {
    errors.push("El campo 'lang' es obligatorio y debe ser 'en' o 'es'.");
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