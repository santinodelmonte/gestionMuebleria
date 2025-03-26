// NOMBRE DE LA CLASE: MUEBLE
const mueble = {
    // FUNCIÓN/MÉTODO INICIO, LA USAMOS PARA OBTENER LOS DATOS DE LA MEMORIA AL MOMENTO DE ABRIR LA PÁGINA, LA LLAMAMOS DESDE EL BODY CON EL ONLOAD.
    inicio: function () {
        // OBTENEMOS EL ARRAY DE MUEBLES DESDE EL LOCAL STORAGE
        this.muebles = memoria.leer('muebles');
        this.categorias = memoria.leer('categorias');

        // OBTENEMOS EL PROXIMO ID DESDE EL LOCAL STORAGE
        let codigo = memoria.leer('proximoIdMueble');
        if (codigo < 1) {
            // SI NO TRAE NADA GRABAMOS EL 1 COMO 1ER VALOR
            memoria.escribir('proximoIdMueble', 1);
        }
        // LEEMOS DESDE EL LOCAL STORAGE EL PROXIMO ID
        this.proximoId = memoria.leer('proximoIdMueble');

        // LLAMAMAMOS A LA FUNCIÓN INICIALIZAR
        this.inicializar();
        // LLAMAMOS AL LISTAR YA QUE SI TENEMOS DATOS EN EL ARRAY NECESITAMOS MOSTRARLOS
        this.listar();
        this.listarCategorias();
    },

    // MÉTODO CREADOR DEL OBJETO MUEBLE
    crear: function (codigo, nombre, categoria, descripcion, precio, stock, vendidos) {
        return {
            codigo: codigo,
            nombre: nombre,
            categoria: categoria,
            descripcion: descripcion,
            precio: precio,
            stock: stock,
            vendidos: vendidos
        };
    },

    // MÉTODO PARA AGREGAR UN OBJETO AL ARRAY
    agregar: function () {

        // RECIBO LOS ATRIBUTOS DESDE LAS CAJAS DE TEXTO DEL HTML
        let codigo = parseInt(document.getElementById('codigo').value);
        let nombre = document.getElementById('nombre').value;
        let codigo_categoria = document.getElementById('categoria').value;
        let descripcion = document.getElementById('descripcion').value;
        let precio = parseInt(document.getElementById('precio').value);
        let stock = parseInt(document.getElementById('stock').value);
        let vendidos = 0;
        // Validar los datos
        if (isNaN(codigo)) {
            alert("Codigo incorrecto");
            document.getElementById('codigo').focus();
            return;
        }

        if (!this.validarCodigo(codigo)) {
            alert("No se puede añadir un mueble con este codigo");
            document.getElementById('codigo').focus();
            return;
        }

        if (nombre == '') {
            alert("Debe ingresar el nombre");
            document.getElementById('nombre').focus();
            return;
        }

        if (isNaN(precio) || (precio < 0)) {
            alert("Debe ingresar un precio valido");
            document.getElementById('codigo').focus();
            return;
        }

        if (isNaN(stock) || (stock < 0)) {
            stock = 0;
        }

        if (codigo_categoria == "") {
            alert("Debe ingresar una categoría");
            document.getElementById('categoria').focus();
            return;
        }


        //CREO UNACATEGORIA QUE LA TRAIGO DE LA FUNCION DE BUSCAR 
        let unaCategoria = this.buscarCategoria(codigo_categoria);

        // LLAMO AL MÉTODO PARA CREAR UN OBJETO Y LE PASO LOS ATRIBUTOS COMO PARAMETROS
        const unMueble = this.crear(codigo, nombre, unaCategoria, descripcion, precio, stock, vendidos);

        // AGREGO EL OBJETO CREADO AL ARRAY
        this.muebles.push(unMueble);

        // LUEGO DE AGREGAR UN NUEVO OBJETO AL ARRAY SOBREESCRIBO EL MISMO EN EL LOCALSTORAGE
        memoria.escribir('muebles', this.muebles);

        // LLAMO AL MÉTODO LISTAR PARA ACTUALIZAR LA LISTA DE MUEBLES
        this.listar();

        // LLAMO A OTRO MÉTODO/FUNCIÓN PARA LIMPIAR LAS CAJAS DE TEXTO 
        this.incrementoId();
        this.inicializar();
    },

    // MÉTODO PARA MODIFICAR UN OBJETO AL ARRAY
    modificar: function () {
        // RECIBO EL ID/CODIGO/NUMERO DE LA CAJA DE TEXTO
        let codigo = document.getElementById('codigo').value;
        nombre = document.getElementById('nombre').value;
        precio = document.getElementById('precio').value;
        stock = document.getElementById('stock').value;

        // VALIDO QUE NO VENGA VACIO
        if (!codigo) {
            alert("ID Incorrecto");
            return;
        }

        if (nombre == '') {
            alert("Debe ingresar el nombre");
            document.getElementById('nombre').focus();
            return;
        }

        if (isNaN(precio) || (precio < 0)) {
            alert("Debe ingresar un precio válido");
            document.getElementById('codigo').focus();
            return;
        }

        if (isNaN(stock) || (stock < 0)) {
            alert("Debe ingresar un stock válido");
            document.getElementById('stock').focus();
            return;
        }

        // RECORRO EL ARRAY Y PREGUNTO CUAL TIENE EL MISMO ID, A ESE LE SOBREESCRIBO EL NOMBRE Y LOS DEMAS DATOS DEL MUEBLE, 
        // EN EL MODIFICAR NO ES RECOMENDABLE CAMBIAR EL ID.

        for (let objMueble of this.muebles) {
            if (objMueble.codigo == codigo) {
                objMueble.nombre = document.getElementById('nombre').value;

                let cod_categoria = document.getElementById('categoria').value;
                let unaCategoria = this.buscarCategoria(cod_categoria);
                objMueble.categoria = unaCategoria;

                objMueble.descripcion = document.getElementById('descripcion').value;
                objMueble.precio = document.getElementById('precio').value;
                objMueble.stock = document.getElementById('stock').value;
            }
        }

        // LLAMO AL MÉTODO LISTAR PARA ACTUALIZAR LA LISTA DE MUEBLES
        this.listar();

        // LUEGO DE MODIFICAR UN OBJETO DEL ARRAY SOBREESCRIBO EL MISMO EN EL LOCALSTORAGE
        memoria.escribir('muebles', this.muebles);

        // LLAMO A OTRO MÉTODO/FUNCIÓN PARA LIMPIAR LAS CAJAS DE TEXTO 
        this.inicializar();
    },

    // MÉTODO PARA ELIMINAR UN OBJETO AL ARRAY
    eliminar: function () {
        // RECIBO EL ID/CODIGO/NUMERO DE LA CAJA DE TEXTO
        let codigo = document.getElementById('codigo').value;

        // DECLARO LA VARIABLE POSICION EN -1
        let posicion = -1;

        // RECORRO EL ARRAY PARA PODER IDENTIFICAR LA POSICION DEL ELEMENTO A BORRAR
        for (let index = 0; index < this.muebles.length; index++) {
            if (this.muebles[index].codigo == codigo) {
                posicion = index;
            }
        }
        // SI ENCONTRÓ UNO QUE COINCIDA, LA VARIABLE POSICION VA A SER MAYOR QUE EL -1 INICIAL, ENTONCES ELIMINO EL OBJETO DE LA POSICIÓN DEL ARRAY.
        if (posicion >= 0) {
            this.muebles.splice(posicion, 1);
        } else {
            // SI LA VARIALBE POSICION SIGUE EN -1 DOY AVISO DE ERROR
            alert("CODIGO incorrecto");
        }

        // LLAMO AL MÉTODO LISTAR PARA ACTUALIZAR LA LISTA DE MUEBLES
        this.listar();

        // LUEGO DE ELIMINAR UN OBJETO DEL ARRAY SOBREESCRIBO EL MISMO EN EL LOCALSTORAGE
        memoria.escribir('muebles', this.muebles);

        // LLAMO A OTRO MÉTODO/FUNCIÓN PARA LIMPIAR LAS CAJAS DE TEXTO 
        this.inicializar();
    },

    // MÉTODO PARA LISTAR TODOS LOS OBJETOS DEL ARRAY
    listar: function () {
        // TOMO LA LISTA DE ELEMENTOS DEL SELECT
        let lista = document.getElementById('lista').options;
        // BORRO TODOS SUS ELEMENTOS
        lista.length = 0;

        // RECORRO EL ARRAY
        for (let objMueble of this.muebles) {
            // ARMO UN STRING CONCATENANDO EL ID, NOMBRE Y DEMAS DATOS, LLAMO A LA FUNCIÓN MOSTRARGÉNERO PARA RETORNAR EL NOMBRE
            let texto = 'ID: ' + objMueble.codigo + ' - Nombre: ' + objMueble.nombre + ' - Categoría: ' + objMueble.categoria.nombre + ' - Descripción: ' + objMueble.descripcion + ' - Precio: ' + objMueble.precio + ' - Stock: ' + objMueble.stock;
            // CREO UN ELEMENTO DEL TIPO OPTION CON EL TESTO CREADO Y EL ID DEL OBJETO.
            let elemento = new Option(texto, objMueble.codigo);
            // LO AGREGO A LA LISTA
            lista.add(elemento);
        }
    },

    listarCategorias: function(){
        // TOMO LA LISTA DE ELEMENTOS DEL SELECT DE CATEGORIAS
        let lista = document.getElementById('categoria').options;
        // BORRO TODOS SUS ELEMENTOS
        lista.length = 0;
        // CREO UN ELEMENTO VACIO PARA MOSTRAR POR DEFECTO Y LO AGREGO AL SELECT
        let elementoVacio = new Option("Seleccione una categoría", "");
        lista.add(elementoVacio);
        
        // RECORRO EL ARRAY DE CATEGORIAS
        for (let objCat of this.categorias) {
            // CREO UN ELEMENTO DEL TIPO OPTION CON EL TEXTO CREADO Y EL ID DEL OBJETO.
            let elemento = new Option(objCat.nombre, objCat.codigo);
            // LO AGREGO A LA LISTA
            lista.add(elemento);
        }
    },



    // MÉTODO PARA LIMPIAR CAJAS E INICIALIZAR (LA IDEA ES QUE QUEDE UNO SOLO)
    inicializar: function () {
        document.getElementById('dep').reset();
        document.getElementById('codigo').value = this.proximoId;
        document.getElementById('nombre').focus();
    },

    // FUNCIÓN/MÉTODO PARA INCREMENTEAR EL ID AUTOMÁTICAMENTE
    incrementoId: function () {
        // 1RO. LA SUMO 1 A LA VARIABLE PROXIMO ID
        this.proximoId++;
        //LUEGO LO GRABO EN EL LOCAL STORAGE PARA TENER LA ULTIMA ACTUALIZACIÓN GUARDADA
        memoria.escribir('proximoIdMueble', this.proximoId);
    },

    // MÉTODO PARA SELECCIONAR UN ELEMENTO DE LA LISTA Y MOSTRAR SUS DATOS EN LAS CAJAS DE TEXTO
    seleccionar: function () {
        // RECIBO EL ID DE LA CAJA DE TEXTO
        let codigo = document.getElementById('lista').value;
        // RECORRO EL ARRAY Y PREGUNTO CUAL TIENE EL MISMO ID
        for (let objMueble of this.muebles) {
            if (objMueble.codigo == codigo) {
                // SI UNO COINCIDE LE PASO LOS DATOS DESDE EL OBJETO A LAS CAJAS DE TEXTO PARA MOSTRARLOS
                document.getElementById('codigo').value = objMueble.codigo;
                document.getElementById('nombre').value = objMueble.nombre;
                document.getElementById('categoria').value = objMueble.categoria.codigo;
                document.getElementById('descripcion').value = objMueble.descripcion;
                document.getElementById('precio').value = objMueble.precio;
                document.getElementById('stock').value = objMueble.stock;
            }
        }

    },

    validarCodigo: function (codigo) {
        for (let objMueble of this.muebles) {
            if (objMueble.codigo == codigo) {
                return false;
            }
        }
        return true;
    },

    buscarCategoria: function (codigo) {
        for (let objCat of this.categorias) {
            if (objCat.codigo == codigo) {
                return objCat;
            }
        }
        return null;
    },

    ordenar: function(atributo){
        this.muebles = this.ordenoBurbuja(this.muebles, atributo);
        this.listar();
    },

    ordenoBurbuja: function(array, att) {
        for (let i = 0; i < array.length - 1; i++) {
          for (let j = 0; j < array.length - 1; j++) {
            if (array[j][att] > array[j + 1][att]) {
              let aux = array[j];
              array[j] = array[j + 1];
              array[j + 1] = aux;
            }
          }
        }
        return array;
    }
};