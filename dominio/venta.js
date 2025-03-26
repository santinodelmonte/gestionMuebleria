// NOMBRE DE LA CLASE: VENTA
const venta = {
    // FUNCIÓN/MÉTODO INICIO, LA USAMOS PARA OBTENER LOS DATOS DE LA MEMORIA AL MOMENTO DE ABRIR LA PÁGINA, LA LLAMAMOS DESDE EL BODY CON EL ONLOAD.
    inicio: function () {
        // OBTENEMOS EL ARRAY DE VENTAS DESDE EL LOCAL STORAGE
        this.ventas = memoria.leer('ventas');

        this.muebles = memoria.leer('muebles');
        this.clientes = memoria.leer('clientes');
        this.categorias = memoria.leer('categorias');

        // OBTENEMOS EL PROXIMO ID DESDE EL LOCAL STORAGE
        let id = memoria.leer('proximoIdVenta');
        if (id < 1) {
            // SI NO TRAE NADA GRABAMOS EL 1 COMO 1ER VALOR
            memoria.escribir('proximoIdVenta', 1);
        }
        // LEEMOS DESDE EL LOCAL STORAGE EL PROXIMO ID
        this.proximoId = memoria.leer('proximoIdVenta');

        // CREAMOS UN OBJETO VACÍO PARA CARGAR LOS DATOS DEL MUEBLE QUE INGRESEMOS
        this.muebleSel = {};

        // LLAMAMAMOS A LA FUNCIÓN INICIALIZAR
        this.inicializar();
        // LLAMAMOS AL LISTAR YA QUE SI TENEMOS DATOS EN EL ARRAY NECESITAMOS MOSTRARLOS
        this.listar();
        // LLAMAMOS AL LISTARMUEBLES PARA CARGAR EL SELECT
        this.listarMuebles();
        this.listarCategorias();
        this.listarClientes();

    },

    // MÉTODO CREADOR DEL OBJETO VENTA
    crear: function(codigo, fecha, cliente, mueble, cantidad, total){
        return {
            codigo: codigo,
            fecha: fecha,
            cliente: cliente,
            mueble: mueble,
            cantidad: cantidad,
            total: total,
        };
    },

    // MÉTODO PARA AGREGAR UN OBJETO AL ARRAY
    agregar: function () {

        // RECIBO LOS ATRIBUTOS DESDE LAS CAJAS DE TEXTO DEL HTML
        let codigo = parseInt(document.getElementById('codigo').value);
        let fecha = document.getElementById('fecha').value;
        let codigo_cliente = document.getElementById('cliente').value;
        let mueble = document.getElementById('mueble').value;
        let cantidad = parseInt(document.getElementById('cantidad').value);
        let total = parseInt(document.getElementById('total').value);

        // Validar los datos
        if (isNaN(codigo)) {
            alert("Codigo incorrecto");
            document.getElementById('mueble').focus();
            return;
        }

        // VALIDAMOS QUE EL CODIGO NO EXISTA EN OTRA VENTA DENTRO DEL ARRAY
        if (!this.validarCodigo(codigo)) {
            alert("Codigo incorrecto");
            document.getElementById('mueble').focus();
            return;
        }

        if (fecha == '') {
            alert("Debe seleccionar una fecha!");
            document.getElementById('mueble').focus();
            return;
        }
        
        if (codigo_cliente == '') {
            alert("Debe seleccionar un cliente!");
            document.getElementById('mueble').focus();
            return;
        }

        // VALIDAMOS QUE SE HAYA SELECCIONADO UN MUEBLE
        if (mueble == '') {
            alert("Debe seleccionar un mueble!");
            document.getElementById('mueble').focus();
            return;
        }

        if (isNaN(cantidad) || (cantidad <= 0)) {
            alert("Debe ingresar una cantidad válida");
            document.getElementById('cantidad').focus();
            return;
        }


        // VALIDAMOS QUE HAYA STOCK DEL MUEBLE A VENDER
        if (!this.validarStock()) {
            alert("No hay stock disponible");
            document.getElementById('cantidad').focus();
            return;
        }

        let unCliente = this.buscarCliente(codigo_cliente);

        // LLAMO AL MÉTODO PARA CREAR UN OBJETO Y LE PASO LOS ATRIBUTOS COMO PARAMETROS, 
        // SALVO MUEBLE QUE AHORA AGREGAMOS EL OBJETO ENTERO
        const unaVenta = this.crear(codigo, fecha, unCliente, this.muebleSel, cantidad, total);

        // AGREGO EL OBJETO CREADO AL ARRAY
        this.ventas.push(unaVenta);

        // LUEGO DE AGREGAR UN NUEVO OBJETO AL ARRAY SOBREESCRIBO EL MISMO EN EL LOCALSTORAGE
        memoria.escribir('ventas', this.ventas);

        // LLAMO AL MÉTODO ACTUALIZAR STOCK PARA RESTARLE LA CANTIDAD VENDIDA AL MUEBLE ELEGIDO
        this.actualizarStock(mueble, cantidad, 'VENTA');

        // LLAMO AL MÉTODO LISTAR PARA ACTUALIZAR LA LISTA DE VENTAS
        this.listar();

        // LLAMO A OTRO MÉTODO/FUNCIÓN PARA LIMPIAR LAS CAJAS DE TEXTO 
        this.incrementoId();
        this.inicializar();
    },
    // MÉTODO PARA ELIMINAR UN OBJETO AL ARRAY
    eliminar: function () {
        // RECIBO EL ID/CODIGO/NUMERO DE LA CAJA DE TEXTO
        let codigo = document.getElementById('codigo').value;

        // DECLARO LA VARIABLE POSICION EN -1
        let posicion = -1;

        // CREO 2 VARIABLES PARA GUARDAR LOS DATOS DE CANTIDAD Y CODIGO DEL MUEBLE A ELIMINAR PARA PODER VOLVER A INGRESAR LA CANTIDAD AL STOCK DEL MUEBLE
        let codMuebles, cantMuebles;
        // RECORRO EL ARRAY PARA PODER IDENTIFICAR LA POSICION DEL ELEMENTO A BORRAR
        for (let index = 0; index < this.ventas.length; index++) {
            if (this.ventas[index].codigo == codigo) {
                posicion = index;
                // SI EL CODIGO RECIBIDO COINCIDE CON EL DE LA VENTA, GUARDO EL CODIGO DEL MUEBLE Y LA CANTIDAD
                codMuebles = this.ventas[index].mueble.codigo;
                cantMuebles = this.ventas[index].cantidad;
            }
        }
        // SI ENCONTRÓ UNO QUE COINCIDA, LA VARIABLE POSICION VA A SER MAYOR QUE EL -1 INICIAL, ENTONCES ELIMINO EL OBJETO DE LA POSICIÓN DEL ARRAY.
        if (posicion >= 0) {
            this.ventas.splice(posicion, 1);
            // LUEGO DE ELIMINAR LA VENTA LLAMO AL MÉTODO ACTUALIZAR STOCK PARA DEVOLVER ESA CANTIDAD AL STOCK DEL MUEBLE
            this.actualizarStock(codMuebles, cantMuebles, 'DEVOLUCION');
        } else {
            // SI LA VARIALBE POSICION SIGUE EN -1 DOY AVISO DE ERROR
            alert("Debe seleccionar una venta");
        }

        // LLAMO AL MÉTODO LISTAR PARA ACTUALIZAR LA LISTA DE VENTAS
        this.listar();

        // LUEGO DE ELIMINAR UN OBJETO DEL ARRAY SOBREESCRIBO EL MISMO EN EL LOCALSTORAGE
        memoria.escribir('ventas', this.ventas);

        // LLAMO A OTRO MÉTODO/FUNCIÓN PARA LIMPIAR LAS CAJAS DE TEXTO 
        this.inicializar();
    },

    // MÉTODO PARA LISTAR TODOS LOS OBJETOS DEL ARRAY
    listar: function(){
        // TOMO LA LISTA DE ELEMENTOS DEL SELECT
        let lista = document.getElementById('lista').options;
        // BORRO TODOS SUS ELEMENTOS
        lista.length = 0;
        
        // RECORRO EL ARRAY
        for (let objVenta of this.ventas) {
            
            // let fecha = new Date(objVenta.fecha);
            // let nueva_fecha = fecha.getDate() + "/" + (fecha.getMonth()+1) + "/" + fecha.getFullYear();
            let texto = 'ID: ' + objVenta.codigo + ' - Fecha: ' + objVenta.fecha + ' - Cliente: ' + objVenta.cliente.nombre + 
            ' - Categoría: ' + objVenta.mueble.categoria.nombre + 
            ' - Mueble: ' + objVenta.mueble.nombre + ' - Cantidad: ' + objVenta.cantidad +
            ' - Total: ' + objVenta.total;
            // CREO UN ELEMENTO DEL TIPO OPTION CON EL TESTO CREADO Y EL ID DEL OBJETO.
            let elemento = new Option(texto,objVenta.codigo);
            // LO AGREGO A LA LISTA
            lista.add(elemento);
        }
    },

    listarMuebles: function () {
        let lista = document.getElementById('mueble').options;

        let categoria = document.getElementById('categoria').value;

        // BORRO TODOS SUS ELEMENTOS
        lista.length = 0;
        // CREO UN ELEMENTO VACIO PARA MOSTRAR POR DEFECTO Y LO AGREGO AL SELECT
        let elementoVacio = new Option("Seleccione un mueble", "");
        lista.add(elementoVacio);
        
        // RECORRO EL ARRAY DE MUEBLES
        for (let objMueble of this.muebles) {
            if(categoria != ''){
                if(objMueble.categoria.codigo == categoria){
                    let texto = objMueble.nombre + ' - $ ' + objMueble.precio;
                    // CREO UN ELEMENTO DEL TIPO OPTION CON EL TEXTO CREADO Y EL ID DEL OBJETO.
                    let elemento = new Option(texto,objMueble.codigo);
                    // LO AGREGO A LA LISTA
                    lista.add(elemento);
                }
            }
        }
    },

    listarCategorias: function(){
        let lista = document.getElementById('categoria').options;
        lista.length = 0;
        let elementoVacio = new Option("Seleccione una categoría", "");
        lista.add(elementoVacio);
        
        for (let objCat of this.categorias) {
            let elemento = new Option(objCat.nombre, objCat.codigo);
            lista.add(elemento);
        }
    },

    listarClientes: function(){
        let lista = document.getElementById('cliente').options;
        // BORRO TODOS SUS ELEMENTOS
        lista.length = 0;
        // CREO UN ELEMENTO VACIO PARA MOSTRAR POR DEFECTO Y LO AGREGO AL SELECT
        let elementoVacio = new Option("Seleccione un Cliente", "");
        lista.add(elementoVacio);
        
        // RECORRO EL ARRAY DE MUEBLES
        for (let objCli of this.clientes) {
            let elemento = new Option(objCli.nombre,objCli.codigo);
            lista.add(elemento);
        }
    },

    // MÉTODO PARA LIMPIAR CAJAS E INICIALIZAR (LA IDEA ES QUE QUEDE UNO SOLO)
    inicializar: function () {
        // document.getElementById('dep').reset();
        document.getElementById('codigo').value = this.proximoId;
        document.getElementById('mueble').focus();
    },

    // FUNCIÓN/MÉTODO PARA INCREMENTEAR EL ID AUTOMÁTICAMENTE
    incrementoId: function () {
        // 1RO. LA SUMO 1 A LA VARIABLE PROXIMO ID
        this.proximoId++;
        //LUEGO LO GRABO EN EL LOCAL STORAGE PARA TENER LA ULTIMA ACTUALIZACIÓN GUARDADA
        memoria.escribir('proximoIdVenta', this.proximoId);
    },

    // MÉTODO PARA SELECCIONAR UN ELEMENTO DE LA LISTA Y MOSTRAR SUS DATOS EN LAS CAJAS DE TEXTO
    seleccionar: function () {
        // RECIBO EL ID DE LA CAJA DE TEXTO
        let codigo = document.getElementById('lista').value;
        // RECORRO EL ARRAY Y PREGUNTO CUAL TIENE EL MISMO ID
        for (let objVenta of this.ventas) {
            if(objVenta.codigo == codigo){
                // SI UNO COINCIDE LE PASO LOS DATOS DESDE EL OBJETO A LAS CAJAS DE TEXTO PARA MOSTRARLOS
                document.getElementById('codigo').value = objVenta.codigo;
                document.getElementById('fecha').value = objVenta.fecha;
                document.getElementById('cliente').value = objVenta.cliente.codigo;
                document.getElementById('categoria').value = objVenta.mueble.categoria.codigo;
                this.listarMuebles();
                document.getElementById('mueble').value = objVenta.mueble.codigo;
                // LUEGO DE CARGAR EL CODIGO DEL MUEBLE DEBO CARGAR LOS DATOS LLAMANDO A LA FUNCIÓN
                this.muebleSel = objVenta.mueble;
                document.getElementById('cantidad').value = objVenta.cantidad;
                // LUEGO DE CARGAR LA CANTIDAD DE MUEBLES DEBO CARGAR EL TOTAL DE LA VENTA LLAMANDO A LA FUNCIÓN
                this.calcularTotal();
            }
        }

    },

    // FUNCIÓN QUE RECIBE EL ID DEL MUEBLE Y CARGA LOS DATOS EN EL FORMULARIO
    buscarMueble: function(){
        // OBTENGO EL CÓDIGO DEL MUEBLE DEL FORMULARIO
        let codigo = document.getElementById('mueble').value;
        // RECORRO EL ARRAY DE MUEBLES
        for (let objMueble of this.muebles) {
            // SI EL CODIGO RECIBIDO COINCIDE CON EL DEL OBJETO QUE ESTOY RECORRIENDO 
            if(objMueble.codigo == codigo){
                // CARGO LOS DATOS DEL OBJETO EN MEDSEL Y LO MUESTRO EN LA CAJA DE TEXTO DATOS
                this.muebleSel = objMueble;
                // BORRO LOS DATOS DE CANTIDAD Y TOTAL PARA VOLVER A GENERARLOS CUANDO CAMBIE DE MUEBLE
                document.getElementById('cantidad').value = "";
                document.getElementById('total').value = "";
            }
        }
    },

    buscarCliente: function(codigo){
        for (let objCliente of this.clientes) {
            if(objCliente.codigo == codigo){
                return objCliente;
            }
        }
        return null;
    },

    // FUNCIÓN PARA CALCULAR EL TOTAL DE LA VENTA
    calcularTotal: function () {
        // OBTENGO LA CANTIDAD INGRESADA EN LA CAJA DE TEXTO
        let cantidad = document.getElementById('cantidad').value;
        // OBTENGO EL PRECIO DESDE EL OBJECTO MEDSEL QUE CARGAMOS EN EL BUSCAR MUEBLE Y LO MULTIPLICO POR LA CANTIDAD
        let total = cantidad * this.muebleSel.precio;
        // MUESTRO EL TOTAl EN LA CAJA DE TEXTO TOTAL
        document.getElementById('total').value = total

        return total;
    },

    // FUNCIÓN PARA VALIDAR QUE TENGA SUFICIENTE STOCK DEL MUEBLE A VENDER
    validarStock: function () {
        // OBTENGO LA CANTIDAD INGRESADA EN LA CAJA DE TEXTO
        let cantidad = document.getElementById('cantidad').value;
        // SI LA CANTIDAD ES MENOR QUE EL STOCK MUESTRO ERROR Y RETORNO FALSO
        if (cantidad > this.muebleSel.stock) {
            alert('Stock insuficiente');
            return false;
        }
        // SINO SOLO RETORNO VERDADERO
        return true;
    },

    // FUNCIÓN PARA ACTUALIZAR EL STOCK DE UN MUEBLE, RECIBE POR PARÁMETRO, EL CODIGO, LA CANTIDAD Y EL TIPO (VENTA O DEVOLUCION)
    actualizarStock: function (codMueble, cantidad, tipo) {
        // RECORRO EL ARRAY DE MUEBLES
        for (let objMueble of this.muebles) {
            // SI EL CODIGO COINCIDE CON EL RECIBIDO POR PARAMETRO ENTRO
            if (objMueble.codigo == codMueble) {
                // PREGUNTO SI EL TIPO RECIBIDO ES IGUAL A VENTA
                if (tipo == 'VENTA') {
                    // SI ES UNA VENTA RESTO LA CANTIDAD RECIBIDA AL STOCK DE ESE MUEBLE
                    objMueble.stock -= cantidad;
                    // SUMO LA CANTIDAD AL TOTAL DE MUEBLES VENDIDOS
                    objMueble.vendidos += cantidad;
                } else {
                    // SI ES UNA DEVOLUCIÓN SUMO LA CANTIDAD RECIBIDA AL STOCK DE ESE MUEBLE PARA VOLVER A DEJARLO COMO ESTABA
                    objMueble.stock += cantidad;
                    // RESTO LA CANTIDAD AL TOTAL DE MUEBLES VENDIDOS
                    objMueble.vendidos -= cantidad;
                }
            }
        }
        // LUEGO DE REALIZAR LA ACTUALIZACIÓN GRABO EL ARRAY DE MUEBLES EN LA MEMORIA DEL LOCAL STORAGE
        memoria.escribir('muebles', this.muebles);
    },
    // FUNCION PARA VALIDA QUE EL CODIGO DE LA VENTA A INGRESAR NO EXISTA DENTRO DEL ARRAY
    validarCodigo: function (codigo) {
        // RECORRO EL ARRAY DE VENTAS
        for (let objVenta of this.ventas) {
            // PREGUNTO SI EL CODIGO DE LA VENTA ES IGUAL AL QUE RECIBO POR PARAMETRO
            if (objVenta.codigo == codigo) {
                // SI LO ENCUENTRA, RETORNO FALSO PARA MOSTRAR ERROR Y NO INGRESAR
                return false;
            }
        }
        // SI LO ENCUENTRA RETORNO VERDADERO Y CONTINÚO
        return true;
    },

    ordenar: function(atributo){
        this.ventas = this.ordenoBurbuja(this.ventas, atributo);
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
