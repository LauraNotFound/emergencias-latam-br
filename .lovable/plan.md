# Refactor de Pronto sin cuentas ni backend

## Objetivo
Convertir Pronto en una guía completamente local, bilingüe en español y portugués, con ocho categorías, listas persistentes y sugerencias enviadas por un formulario web estándar.

## Cambios
- Eliminar los controles, ventanas y lógica de inicio de sesión, registro, perfil y sugerencias almacenadas.
- Desconectar las llamadas y dependencias de autenticación y base de datos del código activo.
- Simplificar la barra superior a marca, tema e idioma ES/PT.
- Ampliar la cuadrícula a exactamente ocho categorías, cada una con icono, búsqueda cercana y al menos tres frases realistas en español y portugués.
- Mantener audio en portugués y adaptar Google Translate al idioma ES/PT activo.
- Guardar por categoría el progreso de las listas en el dispositivo.
- Mantener la celebración al completar una categoría.
- Mostrar “Limpiar todo” únicamente cuando todos los pasos estén completos; al usarlo, borrar el progreso de esa categoría.
- Añadir “Sugerir frase” al final de cada lista y abrir una ventana con un formulario POST a `PLACEHOLDER_WEBHOOK_URL`, categoría de solo lectura, frase en español y traducción al portugués.

## Verificación
- Confirmar que solo existen los tres elementos solicitados en la barra superior.
- Comprobar las ocho categorías y sus búsquedas.
- Validar persistencia tras recargar, celebración y reinicio completo.
- Revisar formulario, audio, traducción, ES/PT, modo claro/oscuro y diseño móvil/escritorio.
- Confirmar que no queden imports o llamadas activas de autenticación/base de datos y que la aplicación compile sin errores.

## Detalles técnicos
- El progreso se serializará en `localStorage` bajo una clave versionada y solo después de hidratar el navegador.
- El formulario usa envío HTML nativo, sin interceptar ni guardar datos en la aplicación.
- Los archivos de integración generados por la plataforma pueden permanecer sin referencias; se retirarán las dependencias y módulos propios que ya no sean necesarios.
