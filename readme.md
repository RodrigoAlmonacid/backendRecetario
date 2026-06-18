# 🍳 Backend Recetario - PWA Grupo +549

Este es el repositorio del backend desarrollado para la aplicación de Recetario (PWA), construido con **Node.js**, **Express**, **Prisma ORM** y una base de datos **PostgreSQL** alojada en **Neon**. La API da soporte completo al frontend desarrollado en React, eliminando la persistencia en `localStorage` y permitiendo la gestión real de recetas con soporte multiidioma.

---

## 👥 Integrantes del Grupo
* **Rodrigo Ulises Almonacid Medina** (FAI-4968)
* **Herman Nicolas Sandoval** (FAI-5639)
* **Bruschi Z. Irina Sol** (FAI-4446)

---

## 🔗 Links del Proyecto
* **Repositorio Frontend:** [https://github.com/HNS5639/pwa_549](https://github.com/HNS5639/pwa_549)
* **Tablero Kanban (Seguimiento):** [https://linear.app/backendpwa/team/BAC/all](https://linear.app/backendpwa/team/BAC/all)
* **Deploy del Backend (Producción):** [https://backendrecetario.onrender.com/api/health](https://backendrecetario.onrender.com/api/health)
* **Deploy del Frontend:** [https://pwa-549.vercel.app](https://pwa-549.vercel.app)

---

## 🛠️ Tecnologías Utilizadas
* **Runtime:** Node.js v18+
* **Framework:** Express.js
* **ORM:** Prisma Client
* **Base de Datos:** PostgreSQL (Neon)

---

## ⚙️ Variables de Entorno

Para que la API funcione correctamente, se debe crear un archivo `.env` en la raíz del proyecto basándose en el siguiente esquema (ver el archivo `.env.example` incluido en el repositorio):

---

## 🚀 Cómo correr el proyecto en tu compu

Si querés descargar el backend y probarlo de forma local, seguí estos pasos:

### 1. Clonar el repositorio e instalar paquetes
Primero, bajate el código y descargá las dependencias de Node:
git clone https://github.com/RodrigoAlmonacid/backendRecetario.git
cd backendRecetario
npm install

### 2. Configurar las variables de entorno
Crea un archivo llamado .env en la raíz del proyecto y poné los datos de tu puerto y la conexión de la base de datos de Neon (te podés guiar con el formato que dejamos de muestra en el archivo .env.example).

### 3. Dejar lista la Base de Datos con Prisma
Para crear la estructura de las tablas en PostgreSQL e inicializar el cliente de Prisma, ejecutá estos dos comandos en la terminal:
npx prisma migrate dev --name init
npx prisma generate

### 4. Cargar los datos de prueba (Seed)
Para que la base de datos no te quede completamente vacía y puedas probar el scroll infinito y las recetas multiidioma, ejecutá el script que creamos para cargar los 20-30 registros de prueba:
npx prisma db seed

### 5. Levantar el servidor
Listo! Ya podés prender el backend en modo desarrollo corriendo:
npm run dev
La API va a quedar escuchando y lista para recibir peticiones en http://localhost:3000.


```env
PORT=3000
DATABASE_URL="postgresql://usuario:contraseña@host:puerto/base_de_datos?sslmode=require"
FRONTEND_URL="http://localhost:5173"
