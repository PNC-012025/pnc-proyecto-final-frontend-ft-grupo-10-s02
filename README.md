# 💸 EasyBank Frontend

EasyBank es una aplicación de banca en línea y gestión financiera personal. Este repositorio contiene el frontend desarrollado en **React + TypeScript** y estilizado con **Tailwind CSS**. La interfaz permite a los usuarios gestionar su cuenta bancaria, realizar transacciones, controlar sus gastos, y visualizar información financiera de forma clara e intuitiva.

---

## 🧩 Tecnologías y librerías principales

- **React 18** con **TypeScript**
- **Vite** como bundler
- **Tailwind CSS** para estilos
- **Zustand** para manejo de estado global
- **React Hook Form** + **Zod** para validación de formularios
- **React Router DOM** para navegación
- **Axios** para peticiones HTTP
- **Chart.js**, **React ChartJS 2** y **React Circular Progressbar** para gráficas
- **React Big Calendar** para visualización de eventos
- **React Data Table Component** para tablas interactivas
- **Framer Motion**, **GSAP**, **React Awesome Reveal** para animaciones
- **Three.js** y **Postprocessing** para efectos 3D

---

## 🧭 Estructura de la aplicación

### 🏠 Dashboard

- Visualiza el **balance actual**
- Gráficas representativas de ingresos y egresos
- Activación de cuenta
- Envío de transferencias a otros usuarios
- Conversión entre monedas

### 💼 Wallet

- Registro de **reservas de gasto** en categorías como:
  - Salud
  - Ocio
  - Suscripciones
  - Hogar
- Visualización de gastos por **gráfica de porcentaje**
- Completar o eliminar reservas:
  - Si se completa, se descuenta del balance y se refleja en el historial

### 📆 Transacciones

- Historial detallado de transacciones
- Calendario interactivo:
  - Visualización de ingresos y egresos
  - Opción para editar color, eliminar, o ver detalles de eventos

---

## 🔐 Panel de Administración

### 👤 Usuarios

- Visualización de todos los usuarios
- Detalles de perfil, estado (activo/inactivo), rol (admin/cliente)
- Asignación de rol de admin
- Creación y eliminación de usuarios

### 🔁 Transacciones

- Lista de todas las transacciones entre usuarios
- Gastos completados por usuario

### 🏦 Cuentas

- Visualización de clientes activos
- Botón de **"abonar"** para depositar saldo a usuarios específicos

### 🧾 Facturas

- Sección para ver las reservas completadas de cada usuario

---

## 🔎 Funcionalidades adicionales

- **Input de búsqueda** en cada panel para filtrar por nombre de usuario
- Interfaz responsiva y animaciones fluidas
- Soporte para múltiples monedas

---

## 🚀 Scripts disponibles

```bash
npm run dev       # Levanta el servidor de desarrollo
npm run build     # Compila el proyecto para producción
npm run preview   # Previsualiza el build
npm run lint      # Linter del código

```

## ✨ Créditos

Desarrollado con ❤️ por el equipo **Amgems**.
