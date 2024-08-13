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

class Evento {
    constructor() {
        this.id = null;
        this.detalle = null;
        this.idCategoria = null;
        this.fecha = null;
    }

    static parse(data) {
        let instancia = new Producto();

        if (data._id) {
            instancia.id = data._id;
        }
        if (data.detalle) {
            instancia.detalle = data.detalle;
        }
        if (data.idCategoria) {
            instancia.idCategoria = data.idCategoria;
        }
        if (data.fecha) {
            instancia.fecha = data.fecha;
        }

        return instancia;
    }
}