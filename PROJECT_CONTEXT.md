# Contexto del Proyecto: Sitio Web para Wat Pah Bodhirama

**Objetivo Principal:**
Crear un sitio web para Wat Pah Bodhirama, un monasterio budista en Bali, Indonesia. El sitio servirá para compartir enseñanzas, noticias, eventos e información para visitantes.

**Estilo y Diseño:**
El diseño debe ser sobrio, minimalista, sereno y respetuoso, inspirado en el sitio web de Wat Pah Nanachat (https://www.watpahnanachat.org/).

**Información Clave:**
*   **Nombre del Monasterio:** Wat Pah Bodhirama
*   **Ubicación:** Bali, Indonesia
*   **Monje Principal:** Ajahn Visalo

**Biografía de Ajahn Visalo:**
Ajahn Visalo, un monje indonesio de Wat Pah Nanachat. Nacido en 1977 en Java Central, conoció y practicó la meditación de varias tradiciones desde los 20 años. A los 29 años, encontró el budismo a través del libro de Dhamma de Ajahn Chah y se ordenó como Samanera en 2006. Recibió la ordenación completa de Luang Por Liem, el Abad de Wat Nong Pah Pong, Tailandia, en 2008.

**Estructura de Contenido:**
*   Biografía / Sobre Ajahn Visalo
*   Enseñanzas (Dhamma talks, textos)
*   Noticias y Eventos
*   Galería Multimedia (Fotos y Videos)
*   Contacto y Visitas

**Preferencias Técnicas:**
*   Mantener la estructura actual de HTML/CSS/JS puros si es posible, adaptándola al nuevo contenido.
*   Utilizar archivos JSON para gestionar datos dinámicos (ej. enseñanzas, eventos).
*   La galería multimedia es ahora dinámica, cargando su contenido desde `Json/gallery.json` y mostrando los elementos en páginas de 6 para optimizar el rendimiento.
*   Se ha rediseñado la página de Contacto con un diseño de dos columnas que incluye un mapa interactivo.

**Internacionalización (i18n):**
*   **Estrategia:** Se implementó una internacionalización del lado del cliente usando JavaScript para permitir la traducción dinámica del contenido sin recargar la página.
*   **Idiomas:** Inglés (en) como default, e Indonesio (id).
*   **Estructura:** Los textos se almacenan en `locales/en.json` y `locales/id.json`.
*   **Implementación:** Un script `Javascript/i18n.js` maneja la lógica. Los elementos HTML usan atributos `data-i18n` para las claves de traducción. El contenido dinámico (como `Json/events.json`) también fue adaptado para incluir objetos de texto por idioma.
*   **UI:** La UI del selector de idioma es un menú desplegable estilizado en la barra de navegación que muestra la bandera y abreviatura del idioma actual, mejorando la integración visual.