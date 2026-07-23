

/* 
    VAMOS A CREAR UNA FUNCIÓN QUE HACE QUE NOS CONVIERTA
    CUALQUIER DATO(NOMBRE, MESA, SALA...)QUE INGRESEMOS
    EN POSTMAN AL CREAR O MODIFICAR DATOS EN FORMATO
    DE LA PRIMERA LETRA EN MAYÚSCULA Y EL RESTO EN 
    MINÚSCULA, PARA QUE QUEDE MAS LEGIBLE TODO
    
    ej: NOSOTROS AL CREAR UN user ESCRIBIMOS 
        jesus gonzalez calero o JESUS GONZALEZ CALERO

    Y AUTOMÁTICAMENTE LO CONVIERTE A:
        Jesus Gonzalez Calero
*/

export const mayusName = (text: string): string => {
  return text
    .toLowerCase()
    .split(' ')
    .map(
      word => word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(' ');
};