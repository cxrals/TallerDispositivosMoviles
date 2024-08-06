class Usuario {
    constructor() {
        this.id = null;
        this.usuario = null;
        this.password = null;
        this.idDepartamento = null;
        this.idCiudad = null;
        this.apiKey = null;
    }

    static parse(data) {
        let instancia = new Usuario();

        if (data.id) {
            instancia.id = data.id;
        }
        if (data.usuario) {
            instancia.usuario = data.usuario;
        }
        if (data.password) {
            instancia.password = data.password;
        }
        if (data.idDepartamento) {
            instancia.idDepartamento = data.idDepartamento;
        }
        if (data.idCiudad) {
            instancia.idCiudad = data.idCiudad;
        }
        if (data.apiKey) {
            instancia.apiKey = data.apiKey;
        }

        return instancia;
    }
}

class Categoria {
    constructor() {
        this.id = null;
        this.tipo = null;
        this.imagen = null;
    }

    static parse(data) {
        let instancia = new Sucursal();

        if (data._id) {
            instancia.id = data._id;
        }
        if (data.tipo) {
            instancia.tipo = data.tipo;
        }
        if (data.imagen) {
            instancia.imagen = data.imagen;
        }

        return instancia;
    }
}

class Producto {
    constructor() {
        this.id = null;
        this.etiquetas = null;
        this.codigo = null;
        this.nombre = null;
        this.descripcion = null;
        this.precio = null;
        this.urlImagen = null;
        this.estado = null;
        this.puntaje = null;
    }

    static parse(data) {
        let instancia = new Producto();

        if (data._id) {
            instancia.id = data._id;
        }
        if (data.etiquetas) {
            instancia.etiquetas = data.etiquetas;
        }
        if (data.codigo) {
            instancia.codigo = data.codigo;
        }
        if (data.nombre) {
            instancia.nombre = data.nombre;
        }
        if (data.descripcion) {
            instancia.descripcion = data.descripcion;
        }
        if (data.precio) {
            instancia.precio = data.precio;
        }
        if (data.urlImagen) {
            instancia.urlImagen = data.urlImagen;
        }
        if (data.estado) {
            instancia.estado = data.estado;
        }
        if (data.puntaje) {
            instancia.puntaje = data.puntaje;
        }

        return instancia;
    }

    obtenerURLImagen() {
        return "https://ort-tallermoviles.herokuapp.com/assets/imgs/" + this.urlImagen + ".jpg";
    }
}

class Pedido {
    constructor() {
        this.id = null;
        this.idCategoria = null;
        this.fecha = null;
        this.producto = null;
        this.sucursal = null;
        this.estado = null;
        this.total = null;
        this.comentario = null;
    }

    static parse(data) {
        let instancia = new Pedido();

        if (data._id) {
            instancia.id = data._id;
        }
        if (data.idCategoria) {
            instancia.idCategoria = data.idCategoria;
        }
        if (data.fecha) {
            instancia.fecha = data.fecha;
        }
        if (data.producto) {
            instancia.producto = Producto.parse(data.producto);
        }
        if (data.sucursal) {
            instancia.sucursal = Sucursal.parse(data.sucursal);
        }
        if (data.estado) {
            instancia.estado = data.estado;
        }
        if (data.total) {
            instancia.total = data.total;
        }
        if (data.comentario) {
            instancia.comentario = data.comentario;
        }

        return instancia;
    }
}
