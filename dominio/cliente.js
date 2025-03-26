// NOMBRE DE LA CLASE: CLIENTE
const cliente = {
    // FUNCIÓN/MÉTODO INICIO, LA USAMOS PARA OBTENER LOS DATOS DE LA MEMORIA AL MOMENTO DE ABRIR LA PÁGINA, LA LLAMAMOS DESDE EL BODY CON EL ONLOAD.
    inicio: function(){
        // OBTENEMOS EL ARRAY DE CLIENTES DESDE EL LOCAL STORAGE
        this.clientes = memoria.leer('clientes');

        // OBTENEMOS EL PROXIMO ID DESDE EL LOCAL STORAGE
        let codigo = memoria.leer('proximoIdCliente');
        if (codigo < 1){
            // SI NO TRAE NADA GRABAMOS EL 1 COMO 1ER VALOR
            memoria.escribir('proximoIdCliente',1);
        }
        // LEEMOS DESDE EL LOCAL STORAGE EL PROXIMO ID
        this.proximoId = memoria.leer('proximoIdCliente');

        // LLAMAMAMOS A LA FUNCIÓN INICIALIZAR
        this.inicializar();
        // LLAMAMOS AL LISTAR YA QUE SI TENEMOS DATOS EN EL ARRAY NECESITAMOS MOSTRARLOS
        this.listar();

    },
    
    // MÉTODO CREADOR DEL OBJETO CLIENTE
    crear: function(codigo, nombre, cedula, telefono, email, direccion){
        return {
            codigo: codigo,
            nombre: nombre,
            cedula: cedula,
            telefono: telefono,
            email: email,
            direccion: direccion,
        };
    },

    // MÉTODO PARA AGREGAR UN OBJETO AL ARRAY
    agregar: function(){
        // RECIBO LOS ATRIBUTOS DESDE LAS CAJAS DE TEXTO DEL HTML
        let codigo = parseInt(document.getElementById('codigo').value);
        let nombre = document.getElementById('nombre').value;
        let cedula = document.getElementById('cedula').value;
        let telefono = document.getElementById('telefono').value;
        let email = document.getElementById('email').value;
        let direccion = document.getElementById('direccion').value;
        // Validar los datos
        if(isNaN(codigo)){
            alert("Codigo incorrecto");
            document.getElementById('codigo').focus();
            return;
        }

        if(!this.validarCodigo(codigo)){
            alert("Codigo incorrecto");
            document.getElementById('codigo').focus();
            return;
        }

        if(nombre == ''){
            alert("Debe ingresar el nombre");
            document.getElementById('nombre').focus();
            return;
        }

        if (cedula.length != 8) {
            alert("Debe ingresar una cédula válida");
            document.getElementById('cedula').focus();
            return;
        }

        if (email.indexOf("@")<=0) {
            alert("Debe ingresar un email válido");
            document.getElementById('email').focus();
            return;
        }

        if(email == ''){
            alert("Debe ingresar un mail");
            document.getElementById('nombre').focus();
            return;
        }


        if(telefono == ''){
            alert("Debe ingresar un telefono");
            document.getElementById('nombre').focus();
            return;
        }

        if(direccion == ''){
            alert("Debe ingresar una dirección");
            document.getElementById('nombre').focus();
            return;
        }

        
        // LLAMO AL MÉTODO PARA CREAR UN OBJETO Y LE PASO LOS ATRIBUTOS COMO PARAMETROS
        const unCliente = this.crear(codigo, nombre, cedula, telefono, email, direccion);
        
        // AGREGO EL OBJETO CREADO AL ARRAY
        this.clientes.push(unCliente);

        // LUEGO DE AGREGAR UN NUEVO OBJETO AL ARRAY SOBREESCRIBO EL MISMO EN EL LOCALSTORAGE
        memoria.escribir('clientes', this.clientes);

        // LLAMO AL MÉTODO LISTAR PARA ACTUALIZAR LA LISTA DE CLIENTES
        this.listar();

        // LLAMO A OTRO MÉTODO/FUNCIÓN PARA LIMPIAR LAS CAJAS DE TEXTO 
        this.incrementoId();
        this.inicializar();
    },

    // MÉTODO PARA MODIFICAR UN OBJETO AL ARRAY
    modificar: function(){
        // RECIBO EL ID/CODIGO/NUMERO DE LA CAJA DE TEXTO
        let codigo = document.getElementById('codigo').value;
        let nombre = document.getElementById('nombre').value;
        let cedula = document.getElementById('cedula').value;
        let email = document.getElementById('email').value;
        
        
        // Validar los datos
        if(isNaN(codigo)){
            alert("Codigo incorrecto");
            document.getElementById('codigo').focus();
            return;
        }

        if(this.validarCodigo(codigo)){
            alert("Codigo incorrecto");
            document.getElementById('codigo').focus();
            return;
        }

        if(nombre == ''){
            alert("Debe ingresar el nombre");
            document.getElementById('nombre').focus();
            return;
        }

        if (cedula.length != 8) {
            alert("Debe ingresar una cédula válida");
            document.getElementById('cedula').focus();
            return;
        }

        if (email.indexOf("@")<=0) {
            alert("Debe ingresar un email válido");
            document.getElementById('email').focus();
            return;
        }

        if(email == ''){
            alert("Debe ingresar un mail");
            document.getElementById('nombre').focus();
            return;
        }


        if(telefono == ''){
            alert("Debe ingresar un telefono");
            document.getElementById('nombre').focus();
            return;
        }

        if(direccion == ''){
            alert("Debe ingresar una dirección");
            document.getElementById('nombre').focus();
            return;
        }

        // RECORRO EL ARRAY Y PREGUNTO CUAL TIENE EL MISMO ID, A ESE LE SOBREESCRIBO EL NOMBRE Y LOS DEMAS DATOS DEL CLIENTE, 
        // EN EL MODIFICAR NO ES RECOMENDABLE CAMBIAR EL ID.
        
        for (let objCliente of this.clientes) {
            if(objCliente.codigo == codigo){
                objCliente.nombre = document.getElementById('nombre').value;
                objCliente.cedula = document.getElementById('cedula').value;
                objCliente.telefono = document.getElementById('telefono').value;
                objCliente.email = document.getElementById('email').value;
                objCliente.direccion = document.getElementById('direccion').value;
                
            }
        }
        // LLAMO AL MÉTODO LISTAR PARA ACTUALIZAR LA LISTA DE CLIENTES
        this.listar();

        // LUEGO DE MODIFICAR UN OBJETO DEL ARRAY SOBREESCRIBO EL MISMO EN EL LOCALSTORAGE
        memoria.escribir('clientes', this.clientes);
        
        // LLAMO A OTRO MÉTODO/FUNCIÓN PARA LIMPIAR LAS CAJAS DE TEXTO 
        this.inicializar();

    },

    // MÉTODO PARA ELIMINAR UN OBJETO AL ARRAY
    eliminar: function(){
        // RECIBO EL ID/CODIGO/NUMERO DE LA CAJA DE TEXTO
        let codigo = document.getElementById('codigo').value;

        // DECLARO LA VARIABLE POSICION EN -1
        let posicion = -1;

        // RECORRO EL ARRAY PARA PODER IDENTIFICAR LA POSICION DEL ELEMENTO A BORRAR
        for (let index = 0; index < this.clientes.length; index++) {
            if(this.clientes[index].codigo == codigo){
                posicion = index;
            }
        }
        // SI ENCONTRÓ UNO QUE COINCIDA, LA VARIABLE POSICION VA A SER MAYOR QUE EL -1 INICIAL, ENTONCES ELIMINO EL OBJETO DE LA POSICIÓN DEL ARRAY.
        if(posicion >= 0){
            this.clientes.splice(posicion,1);
        }else{
            // SI LA VARIALBE POSICION SIGUE EN -1 DOY AVISO DE ERROR
            alert("CODIGO incorrecto");
        }
        
        // LLAMO AL MÉTODO LISTAR PARA ACTUALIZAR LA LISTA DE CLIENTES
        this.listar();

        // LUEGO DE ELIMINAR UN OBJETO DEL ARRAY SOBREESCRIBO EL MISMO EN EL LOCALSTORAGE
        memoria.escribir('clientes', this.clientes);

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
        for (let objCliente of this.clientes) {
                // ARMO UN STRING CONCATENANDO EL ID, NOMBRE Y DEMAS DATOS, LLAMO A LA FUNCIÓN MOSTRARGÉNERO PARA RETORNAR EL NOMBRE
                let texto = 'ID: ' + objCliente.codigo + ' - Nombre: ' + objCliente.nombre
                + ' - Cédula: ' + objCliente.cedula + ' - Tel: ' + objCliente.telefono
                + ' - Email: ' + objCliente.email + ' - Dir: ' + objCliente.direccion;
                // CREO UN ELEMENTO DEL TIPO OPTION CON EL TESTO CREADO Y EL ID DEL OBJETO.
                let elemento = new Option(texto,objCliente.codigo);
                // LO AGREGO A LA LISTA
                lista.add(elemento);
            
        }
    },

    // MÉTODO PARA LIMPIAR CAJAS E INICIALIZAR 
    inicializar: function(){
        document.getElementById('dep').reset();
        document.getElementById('codigo').value = this.proximoId;
        document.getElementById('nombre').focus();
    },

    // FUNCIÓN/MÉTODO PARA INCREMENTEAR EL ID AUTOMÁTICAMENTE
    incrementoId: function(){
        // 1RO. LA SUMO 1 A LA VARIABLE PROXIMO ID
        this.proximoId++;
        //LUEGO LO GRABO EN EL LOCAL STORAGE PARA TENER LA ULTIMA ACTUALIZACIÓN GUARDADA
        memoria.escribir('proximoIdCliente', this.proximoId);
    },

    // MÉTODO PARA SELECCIONAR UN ELEMENTO DE LA LISTA Y MOSTRAR SUS DATOS EN LAS CAJAS DE TEXTO
    seleccionar: function(){
        // RECIBO EL ID DE LA CAJA DE TEXTO
        let codigo = document.getElementById('lista').value;
        // RECORRO EL ARRAY Y PREGUNTO CUAL TIENE EL MISMO ID
        for (let objCliente of this.clientes) {
            if(objCliente.codigo == codigo){
                // SI UNO COINCIDE LE PASO LOS DATOS DESDE EL OBJETO A LAS CAJAS DE TEXTO PARA MOSTRARLOS
                document.getElementById('codigo').value = objCliente.codigo;
                document.getElementById('nombre').value = objCliente.nombre;
                document.getElementById('cedula').value = objCliente.cedula;
                document.getElementById('telefono').value = objCliente.telefono;
                document.getElementById('email').value = objCliente.email;
                document.getElementById('direccion').value = objCliente.direccion;
            }
        }

    },
    validarCodigo: function(codigo){
        for (let objCliente of this.clientes) {
            if(objCliente.codigo == codigo){
                return false;
            }
        }
        return true;
    },

    ordenar: function(atributo){
        this.clientes = this.ordenoBurbuja(this.clientes, atributo);
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