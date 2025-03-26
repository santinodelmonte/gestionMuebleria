// NOMBRE DE LA CLASE: ESTADISTICA
const estadistica = {
    // FUNCIÓN/MÉTODO INICIO, LA USAMOS PARA OBTENER LOS DATOS DE LA MEMORIA AL MOMENTO DE ABRIR LA PÁGINA, LA LLAMAMOS DESDE EL BODY CON EL ONLOAD.
    inicio: function () {
        // OBTENEMOS EL ARRAY DE VENTAS DESDE EL LOCAL STORAGE
        this.ventas = memoria.leer('ventas');
        this.clientes = memoria.leer('clientes');
        this.categorias = memoria.leer('categorias');

        // OBTENEMOS EL ARRAY DE MUEBLES DESDE EL LOCAL STORAGE
        this.muebles = memoria.leer('muebles');

        // LLAMAMAMOS A LA FUNCIÓN INICIALIZAR
        this.listarVentas();
        this.listarMasVendido();
        this.listarClientes();
        this.listarCategorias();
    },

    // FUNCION PARA CALCULAR EL TOTAL DE LAS VENTAS
    listarVentas: function () {
        let totalVentas = 0;
        // RECORRO EL ARRAY DE VENTAS
        for (let objVenta of this.ventas) {
            // VOY SUMANDO EN LA VARIABLE TOTALVENTAS EL TOTAL DE CADA VENTA
            totalVentas += objVenta.total;
        }
        // AL FINALIZAR MUESTRO EL TOTAL EN LA CAJA DE TEXTO
        document.getElementById('totalVentas').value = "$ " + totalVentas;
    },

    // FUNCION QUE CALCULA EL MUEBLE MAS VENDIDO
    listarMasVendido: function () {
        let masVendido = 0;
        listaMasVendidos.length = 0;
        // RECORRO EL ARRAY DE MUEBLES
        for (let objMueble of this.muebles) {
            // PREGUNTO SI LA CANTIDAD DEL MAS VENDIDO ES MAYOR QUE LO QUE TENGO GUARDADO EN MASVENDIDO
            if (objMueble.vendidos > masVendido) {
                // SI ES MAYOR GUARDO LA CANTIDAD 
                masVendido = objMueble.vendidos;
            }
        }

        for (let objMueble of this.muebles) {
            // PREGUNTO SI LA CANTIDAD DEL MAS VENDIDO ES IGUAL QUE LO QUE TENGO GUARDADO EN MASVENDIDO
            if (masVendido == objMueble.vendidos) {
                // SI ES IGUAL IMPRIMO EN EL SELECT 
                let texto = 'ID: ' + objMueble.codigo + ' - Nombre: ' + objMueble.nombre + ' - Descripción: ' + objMueble.descripcion + ' - Precio: ' + objMueble.precio + ' - Stock: ' + objMueble.stock + ' - Vendidos: ' + objMueble.vendidos;
                // CREO UN ELEMENTO DEL TIPO OPTION CON EL TESTO CREADO Y EL ID DEL OBJETO.
                let elemento = new Option(texto, objMueble.codigo);
                // LO AGREGO A LA LISTA
                listaMasVendidos.add(elemento);
            }
        }

    },

    listarStock: function () {
        let stock = document.getElementById("stock").value;
        listaStock.length = 0;
        // RECORRO EL ARRAY DE MUEBLES
        for (let objMueble of this.muebles) {
            // PREGUNTO SI EL CAMPO ES CONSTOCK Y EL STOCK ES MAYOR A 0
            if ((stock == "conStock") && (objMueble.stock > 0)) {
                // SI ELEGIO LA OPCION CON STOCK TRAIGO LOS MUEBLES CON STOCK
                // ARMO UN STRING CONCATENANDO EL ID, NOMBRE Y DEMAS DATOS
                let texto = 'ID: ' + objMueble.codigo + ' - Nombre: ' + objMueble.nombre + ' - Descripción: ' + objMueble.descripcion + ' - Precio: ' + objMueble.precio + ' - Stock: ' + objMueble.stock;
                // CREO UN ELEMENTO DEL TIPO OPTION CON EL TESTO CREADO Y EL ID DEL OBJETO.
                let elemento = new Option(texto, objMueble.codigo);
                // LO AGREGO A LA LISTA
                listaStock.add(elemento);
                // PREGUNTO SI EL CAMPO ES SINSTOCK Y EL STOCK ES IGUAL A 0
            } else if ((stock == "sinStock") && (objMueble.stock == 0)) {
                let texto = 'ID: ' + objMueble.codigo + ' - Nombre: ' + objMueble.nombre + ' - Descripción: ' + objMueble.descripcion + ' - Precio: ' + objMueble.precio + ' - Stock: ' + objMueble.stock;
                // CREO UN ELEMENTO DEL TIPO OPTION CON EL TESTO CREADO Y EL ID DEL OBJETO.
                let elemento = new Option(texto, objMueble.codigo);
                // LO AGREGO A LA LISTA
                listaStock.add(elemento);
            }
        }

        if (listaStock.length == 0) {
            let elemento = new Option("No se encontraron muebles con esa cantidad de stock");
            listaStock.add(elemento);
        }
    },

    listarVentasPorFecha: function () {
        let fecha = document.getElementById('fechaVenta').value;  // DATE PICKER

        if (fecha == '') {
            alert("Debe seleccionar una Fecha!!");
            return;
        }

        let lista = document.getElementById('ventasPorFecha').options;
        lista.length = 0;

        for (let objVenta of this.ventas) {
            if (fecha == objVenta.fecha) {
                let texto = objVenta.mueble.categoria.nombre + " : " + objVenta.mueble.nombre + ' - Cantidad: ' + objVenta.cantidad +
                    " : " + objVenta.cliente.nombre;
                // CREO UN ELEMENTO DEL TIPO OPTION CON EL TESTO CREADO Y EL ID DEL OBJETO.
                let elemento = new Option(texto, objVenta.codigo);
                // LO AGREGO A LA LISTA
                lista.add(elemento);
            }
        }

        if (lista.length == 0) {
            let elemento = new Option("No se encontraron datos para esa fecha");
            lista.add(elemento);
        }
    },

    // MÉTODO PARA LIMPIAR CAJAS E INICIALIZAR (LA IDEA ES QUE QUEDE UNO SOLO)
    inicializar: function () {
        let fechaHoy = new Date();
        let dia = fechaHoy.getDate();
        dia = dia.toString();
        dia = (dia.length == 1) ? "0" + dia : dia;
        let mes = fechaHoy.getMonth() + 1;
        mes = mes.toString();
        mes = (mes.length == 1) ? "0" + mes : mes;
        let fecha = fechaHoy.getFullYear() + "-" + mes + "-" + dia;

        document.getElementById('fechaVenta').value = fecha;
        // document.getElementById('dep').reset();
        // document.getElementById('codigo').value = this.proximoId;
        // document.getElementById('medicamento').focus();
    },

    listarClientes: function () {
        let lista = document.getElementById('cliente').options;
        // BORRO TODOS SUS ELEMENTOS
        lista.length = 0;
        // CREO UN ELEMENTO VACIO PARA MOSTRAR POR DEFECTO Y LO AGREGO AL SELECT
        let elementoVacio = new Option("Seleccione un Cliente", "");
        lista.add(elementoVacio);

        // RECORRO EL ARRAY DE MUEBLES
        for (let objCli of this.clientes) {
            let elemento = new Option(objCli.nombre, objCli.codigo);
            lista.add(elemento);
        }
    },


    listarVentasCliente: function () {
        let codigoCliente = parseInt(document.getElementById('cliente').value);
        let lista = document.getElementById('ventasPorCliente').options;
        lista.length = 0;

        for (let objVenta of this.ventas) {
            if (objVenta.cliente.codigo == codigoCliente) {
                let texto = 'ID: ' + objVenta.codigo + ' - Fecha: ' + objVenta.fecha + ' - Cliente: ' + objVenta.cliente.nombre +
                    ' - Categoría: ' + objVenta.mueble.categoria.nombre +
                    ' - Mueble: ' + objVenta.mueble.nombre + ' - Cantidad: ' + objVenta.cantidad +
                    ' - Total: ' + objVenta.total;
                // CREO UN ELEMENTO DEL TIPO OPTION CON EL TESTO CREADO Y EL ID DEL OBJETO.
                let elemento = new Option(texto, objVenta.codigo);
                // LO AGREGO A LA LISTA
                lista.add(elemento);
            }
        }

        if (lista.length == 0) {
            let elemento = new Option("No se encontraron ventas con ese cliente");
            lista.add(elemento);
        }
    },

    listarCategorias: function () {
        let lista = document.getElementById('categoria').options;
        // BORRO TODOS SUS ELEMENTOS
        lista.length = 0;
        // CREO UN ELEMENTO VACIO PARA MOSTRAR POR DEFECTO Y LO AGREGO AL SELECT
        let elementoVacio = new Option("Seleccione una Categoría", "");
        lista.add(elementoVacio);

        // RECORRO EL ARRAY DE MUEBLES
        for (let objCategoria of this.categorias) {
            let elemento = new Option(objCategoria.nombre, objCategoria.codigo);
            lista.add(elemento);
        }
    },


    listarMuebleCategoria: function () {
        let codigoCategoria = parseInt(document.getElementById('categoria').value);
        let lista = document.getElementById('mueblesPorCategoria').options;
        lista.length = 0;

        for (let objMueble of this.muebles) {
            if (objMueble.codigo == codigoCategoria) {
                // ARMO UN STRING CONCATENANDO EL ID, NOMBRE Y DEMAS DATOS, LLAMO A LA FUNCIÓN MOSTRARGÉNERO PARA RETORNAR EL NOMBRE
                let texto = 'ID: ' + objMueble.codigo + ' - Nombre: ' + objMueble.nombre + ' - Categoría: ' + objMueble.categoria.nombre + ' - Descripción: ' + objMueble.descripcion + ' - Precio: ' + objMueble.precio + ' - Stock: ' + objMueble.stock;
                // CREO UN ELEMENTO DEL TIPO OPTION CON EL TESTO CREADO Y EL ID DEL OBJETO.
                let elemento = new Option(texto, objMueble.codigo);
                // LO AGREGO A LA LISTA
                lista.add(elemento);
            }
        }

        if (lista.length == 0) {
            let elemento = new Option("No se encontraron muebles con esa categoría");
            lista.add(elemento);
        }
    }


};