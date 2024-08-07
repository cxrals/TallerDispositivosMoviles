//========================================================================
// ------------------------- VARIABLES GLOBALES -------------------------
//========================================================================
const APIbaseURL = 'https://babytracker.develotion.com';
let usuarioLogueado = null;
let categorias =[];
let departamentos =[];
let ciudades =[];

const MENU = document.querySelector("#menu");
const ROUTER = document.querySelector("#ruteo");
const NAV = document.querySelector("#nav");
const PANTALLA_HOME = document.querySelector("#pantalla-home");
const PANTALLA_LOGIN = document.querySelector("#pantalla-login");
const PANTALLA_REGISTRO = document.querySelector("#pantalla-registro");
const PANTALLA_AGREGAR = document.querySelector("#pantalla-agregar");
const COMBO_CATEGORIAS = document.querySelector("#pantalla-agregar-combo-categorias");
const COMBO_DEPARTAMENTOS = document.querySelector("#inputDepartamento");
const COMBO_CIUDADES = document.querySelector("#inputCiudad");

//========================================================================
// -------------------------------- INIT -------------------------------- 
//========================================================================
inicializar();

function inicializar() {
    suscribirmeAEventos();
}

function suscribirmeAEventos() {
    document.querySelector("#btnIngresar").addEventListener("click", btnIngresarHandler);
    document.querySelector("#btnRegistrarse").addEventListener("click", btnRegistrarseHandler);
    document.querySelector("#btnAgregarEvento").addEventListener("click", btnAgregarEventoHandler);

    COMBO_CATEGORIAS.addEventListener("ionChange", comboCategoriasChangeHandler);
    COMBO_DEPARTAMENTOS.addEventListener("ionChange", comboDepartamentosChangeHandler);

    // Ruteo
    ROUTER.addEventListener("ionRouteDidChange", navegar);
}

//========================================================================
// ------------------------- BUTTON HANDLERS  --------------------------
//========================================================================
function btnRegistrarseHandler() {
    const usuario = document.querySelector("#inputUsuario").value;
    const password = document.querySelector("#inputPassword").value;
    const verificacion = document.querySelector("#inputVerificacion").value;
    const departamento = document.querySelector("#inputDepartamento").value;
    const ciudad = document.querySelector("#inputCiudad").value;

    if (usuario && password && verificacion && departamento && ciudad) {
        if (password === verificacion) {
            
            let nuevoUsuario = new Usuario();
            nuevoUsuario.usuario = usuario;
            nuevoUsuario.password = password;
            nuevoUsuario.idDepartamento = departamento;
            nuevoUsuario.idCiudad = ciudad;

            fetch(`${APIbaseURL}/usuarios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevoUsuario)
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    if (data.error) {
                        mostrarToast('ERROR', 'Error', data.error);
                    } else {
                        // vaciar campos
                        document.querySelector("#inputUsuario").value = "";
                        document.querySelector("#inputPassword").value = "";
                        document.querySelector("#inputVerificacion").value = "";
                        document.querySelector("#inputDepartamento").value = "";
                        document.querySelector("#inputCiudad").value = "";
                        mostrarToast('SUCCESS', 'Registro exitoso', 'Ya puede iniciar sesión.');
                        NAV.push("page-login");
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        } else {
            mostrarToast('ERROR', 'Error', 'Las contraseñas no coinciden.');
        }
    } else {
        mostrarToast('ERROR', 'Error', 'Todos los campos son obligatorios.');
    }

}

/* Login */
function btnIngresarHandler() {
    const usuario = document.querySelector("#inputUsuarioIngresar").value;
    const password = document.querySelector("#inputPasswordIngresar").value;

    if (usuario && password) {
        let usuarioLogin = new Usuario();
        usuarioLogin.usuario = usuario;
        usuarioLogin.password = password;

        fetch(`${APIbaseURL}/login.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuarioLogin)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.error) {
                    mostrarToast('ERROR', 'Error', data.error);
                } else {
                    // vaciar campos
                    document.querySelector("#inputUsuarioIngresar").value = "";
                    document.querySelector("#inputPasswordIngresar").value = "";
                    console.log(data);
                    localStorage.setItem("usuarioLogueado", JSON.stringify(data));
                    mostrarToast('SUCCESS', 'Login exitoso', 'Se ha iniciado sesión.');
                    NAV.push("page-home");
                    // NAV.setRoot("page-productos");
                    // NAV.popToRoot();
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    } else {
        mostrarToast('ERROR', 'Error', 'Todos los campos son obligatorios.');
    }
}

function btnAgregarEventoHandler(){
    const fecha = document.querySelector("#datetime").value;
    console.log(fecha);

}

//========================================================================
// ------------------------------- RUTEO  -------------------------------
//========================================================================
function navegar(evt) {
    const usuarioGuardadoEnLocalStorage = localStorage.getItem("usuarioLogueado");
    console.log(usuarioGuardadoEnLocalStorage);
    if (usuarioGuardadoEnLocalStorage) {
        usuarioLogueado = JSON.parse(usuarioGuardadoEnLocalStorage);
    } else {
        usuarioLogueado = null;
    }

    document.querySelector("#btnMenuLogin").style.display = "none";
    document.querySelector("#btnMenuRegistro").style.display = "none";
    document.querySelector("#btnMenuCerrarSesion").style.display = "none";

    if (usuarioLogueado) {
        document.querySelector("#btnMenuCerrarSesion").style.display = "block";
    } else {
        document.querySelector("#btnMenuLogin").style.display = "block";
        document.querySelector("#btnMenuRegistro").style.display = "block";
    }

    ocultarPantallas();

    const pantallaDestino = evt.detail.to;
    switch(pantallaDestino) {
        case "/":
            if (usuarioLogueado) {
                NAV.setRoot("page-home");
                NAV.popToRoot();
            } else {
                NAV.setRoot("page-login");
                NAV.popToRoot();
            }
            break;
        case "/login":
            PANTALLA_LOGIN.style.display = "block";
            break;
        case "/registro":
            listarDepartamentos();
            PANTALLA_REGISTRO.style.display = "block";
            break;
        case "/agregar":
            listarCategorias();
            PANTALLA_AGREGAR.style.display = "block";
            break;
    }
}

//========================================================================
// ------------------------------ COMBOS  ------------------------------
//========================================================================
function listarDepartamentos() {
    fetch(`${APIbaseURL}/departamentos.php`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        }
    })
    .then(response => {
        if (response.codigo === 401) {
            console.log(response);
        } else {
            return response.json();
        }
    }).then(data => {
        if (data.error) {
            mostrarToast('ERROR', 'Error', data.error);
        } else if (data.departamentos.length === 0) {
            mostrarToast('ERROR', 'Error', 'No se han encontado departamentos');
        } else {
            console.log(data);
            for (let i = 0; i < data.departamentos.length; i++) {
                console.log(data.departamentos[i]);
                const departamentoActual = data.departamentos[i];
                departamentos.push(departamentoActual);
            }
            COMBO_DEPARTAMENTOS.innerHTML = "";
            for (let i = 0; i < departamentos.length; i++) {
                const departamento = departamentos[i];
                const option = document.createElement("ion-select-option");
                option.value = departamento.id;
                option.innerText = departamento.nombre;
                COMBO_DEPARTAMENTOS.appendChild(option);
            }
        }
    })
}

function comboDepartamentosChangeHandler(evt) {
    console.log(evt);
    const idDepartamento = evt.detail.value;
    fetch(`${APIbaseURL}/ciudades.php?idDepartamento=${idDepartamento}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            mostrarToast('ERROR', 'Error', data.error);
        } else if (data.ciudades.length === 0) {
            mostrarToast('ERROR', 'Error', 'No se han encontrado ciudades');
        } else {
            console.log(data);
            for (let i = 0; i < data.ciudades.length; i++) {
                console.log(data.ciudades[i]);
                const ciudadActual = data.ciudades[i];
                ciudades.push(ciudadActual);
            }
            COMBO_CIUDADES.innerHTML = "";
            for (let i = 0; i < ciudades.length; i++) {
                const ciudad = ciudades[i];
                const option = document.createElement("ion-select-option");
                option.value = ciudad.id;
                option.innerText = ciudad.nombre;
                COMBO_CIUDADES.appendChild(option);
            }
        }
    })
}

function listarCategorias() {
    fetch(`${APIbaseURL}/categorias.php`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + usuarioLogueado.apiKey,
            "apikey": usuarioLogueado.apiKey,
            "iduser": usuarioLogueado.id
        }
    })
        .then(response => {
            if (response.status === 401) {
                console.log(response);
            } else {
                return response.json();
            }
        })
        .then(data => {
            if (data.error) {
                mostrarToast('ERROR', 'Error', data.error);
            } else if (data.categorias.length === 0) {
                mostrarToast('ERROR', 'Error', 'No se han encontado categorías');
            } else {
                console.log(data);
                for (let i = 0; i < data.categorias.length; i++) {
                    console.log(data.categorias[i]);
                    const categoriaActual = data.categorias[i];
                    categorias.push(categoriaActual);
                }
                COMBO_CATEGORIAS.innerHTML = "";
                for (let i = 0; i < categorias.length; i++) {
                    const categoria = categorias[i];
                    const option = document.createElement("ion-select-option");
                    option.value = categoria.id;
                    option.innerText = categoria.tipo;
                    COMBO_CATEGORIAS.appendChild(option);
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
   
function comboCategoriasChangeHandler(evt) {
    console.log(evt);
}

function ocultarPantallas() {
    PANTALLA_HOME.style.display = "none";
    PANTALLA_LOGIN.style.display = "none";
    PANTALLA_REGISTRO.style.display = "none";
    PANTALLA_AGREGAR.style.display = "none";
}

/* Menú */
function cerrarMenu() {
    MENU.close();
}

/* Logout */
function cerrarSesion() {
    cerrarMenu();
    localStorage.clear();
    usuarioLogueado = null;
    NAV.setRoot("page-login");
    NAV.popToRoot();
}


/* Toast */
async function mostrarToast(tipo, titulo, mensaje) {
    const toast = document.createElement('ion-toast');
    toast.header = titulo;
    toast.message = mensaje;
    toast.position = 'bottom';
    toast.duration = 2000;
    if (tipo === "ERROR") {
        toast.color = "danger";
    } else if (tipo === "SUCCESS") {
        toast.color = "success";
    } else if (tipo === "WARNING") {
        toast.color = "warning";
    }

    document.body.appendChild(toast);
    return toast.present();
}