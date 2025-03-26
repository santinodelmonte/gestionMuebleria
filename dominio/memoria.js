// CLASE MEMORIA PARA GUARDAR LOS DATOS EN EL LOCAL STORAGE
const memoria = {

    // FUNCIÓN LEER: LEE DATOS QUE ESTAN GUARDADOS EN LA MEMORIA, RECIBE LA CLAVE PARA PODER BUSCAR
    leer: function(clave) {
        // CON EL GETITEM OBTENEMOS EL DATO GUARDADO
        const datos = localStorage.getItem(clave);
        
        if (datos) {
            // SI LO ENCONTRÓ LO CONVIERTO DE STRING A LO QUE ERA CON EL JSON PARSE
            return JSON.parse(datos);
        } else {
            // SINO, GRABO UN ARRAY VACÍO PARA ESA CLAVE MEDIANTE LA FUNCIÓN ESCRIBIR
            this.escribir(clave, []);
            // Y LO RETORNO
            return [];
        }
    },

    // FUNCIÓN ESCRIBIR: GRABA EN LA MEMORIA (LOCAL STORAGE) UN DATO, NECESITAMOS PASARLE LA CLAVE (NOMBRE DE LA VARIABLE) Y EL CONTENIDO, PUEDE SER ARRAY, STRING, NUMERO, ETC.
    // 1RO USAMOS JSON STRINGIFY PARA CONVERTIRLO A STRING Y LUEGO LO GUARDAMOS CON SETITEM.
    escribir: function(clave, lista) {
        localStorage.setItem(clave, JSON.stringify(lista));
    },
    
};