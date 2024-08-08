//========================================================================
// ------------------------- VARIABLES GLOBALES -------------------------
//========================================================================
const APIbaseURL = 'https://babytracker.develotion.com';
let usuarioLogueado = null;
let categorias =[];
let departamentos =[];
let ciudades =[];
let eventos =[];
let plazas =[];

let map = null;
let markerUsuario = null;
let markerPlaza = null;
let posicionUsuario = {
    latitude: -34.903816878014354,
    longitude: -56.19059048108193
};
let posicionUsuarioIcon = L.icon({
    iconUrl: 'img/usuario.png',
    iconSize: [25, 25],
});
let posicionSucursalIcon = L.icon({
    iconUrl: 'img/location.png',
    iconSize: [25, 25],
});

const MENU = document.querySelector("#menu");
const ROUTER = document.querySelector("#ruteo");
const NAV = document.querySelector("#nav");
const PANTALLA_HOME = document.querySelector("#pantalla-home");
const PANTALLA_LOGIN = document.querySelector("#pantalla-login");
const PANTALLA_REGISTRO = document.querySelector("#pantalla-registro");
const PANTALLA_AGREGAR = document.querySelector("#pantalla-agregar");
const PANTALLA_LISTAR = document.querySelector("#pantalla-listar");
const PANTALLA_INFORME = document.querySelector("#pantalla-informe");
const PANTALLA_MAPA = document.querySelector("#pantalla-mapa");
const COMBO_CATEGORIAS = document.querySelector("#pantalla-agregar-combo-categorias");
const COMBO_DEPARTAMENTOS = document.querySelector("#inputDepartamento");
const COMBO_CIUDADES = document.querySelector("#inputCiudad");

//========================================================================
// -------------------------------- INIT -------------------------------- 
//========================================================================
inicializar();

function inicializar() {
    suscribirmeAEventos();
    cargarPosicionUsuario();
}

function suscribirmeAEventos() {
    document.querySelector("#btnIngresar").addEventListener("click", btnIngresarHandler);
    document.querySelector("#btnRegistrarse").addEventListener("click", btnRegistrarseHandler);
    document.querySelector("#btnAgregarEvento").addEventListener("click", btnAgregarEventoHandler);
    document.querySelector("#btnMenuListarEventos").addEventListener("click", btnMenuListarEventosHandler);
    document.querySelector("#btnInformeEventos").addEventListener("click", btnInformeEventosHandler);
    document.querySelector("#btnMapaPlazas").addEventListener("click", btnMapaPlazasHandler);


    COMBO_CATEGORIAS.addEventListener("ionChange", comboCategoriasChangeHandler);
    COMBO_DEPARTAMENTOS.addEventListener("ionChange", comboDepartamentosChangeHandler);

    // Ruteo
    ROUTER.addEventListener("ionRouteDidChange", navegar);
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
    document.querySelector("#btnMenuAgregarEvento").style.display = "none";
    document.querySelector("#btnMenuListarEventos").style.display = "none";
    document.querySelector("#btnInformeEventos").style.display = "none";
    document.querySelector("#btnMenuCerrarSesion").style.display = "none";

    if (usuarioLogueado) {
        document.querySelector("#btnMenuAgregarEvento").style.display = "block";
        document.querySelector("#btnMenuListarEventos").style.display = "block";
    document.querySelector("#btnInformeEventos").style.display = "block";
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
        case "/listar":
            listarCategorias();
            PANTALLA_LISTAR.style.display = "block";
            break;
        case "/informe":
            PANTALLA_INFORME.style.display = "block";
            break;
        case "/mapa":
            obtenerPlazas();
            PANTALLA_MAPA.style.display = "block";
            inicializarMapa();
            break;
    }
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

            console.log(nuevoUsuario);

            fetch(`${APIbaseURL}/usuarios.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevoUsuario)
            })
            .then((response) => {
                return response.json()
            })
            .then(data => {
                console.log(data);
                if (data.mensaje) {
                    mostrarToast('ERROR', 'Error', data.mensaje);
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

// -------------------------- LOGIN --------------------------
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
                if (data.mensaje) {
                    mostrarToast('ERROR', 'Error', data.mensaje);
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
    const detalle = document.querySelector("#inputDetalle").value;
    const idCategoria = document.querySelector("#pantalla-agregar-combo-categorias").value;
    console.log(idCategoria);
    const idUsuario = usuarioLogueado.id;
    console.log(idUsuario);
    if (fecha && detalle && idCategoria && idUsuario) {
        let nuevoEvento = new Evento();
        nuevoEvento.fecha = fecha;
        nuevoEvento.detalle = detalle;
        nuevoEvento.idCategoria = idCategoria;
        nuevoEvento.idUsuario = idUsuario;
        console.log(nuevoEvento);

        fetch(`${APIbaseURL}/eventos.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + usuarioLogueado.apiKey,
                "apikey": usuarioLogueado.apiKey,
                "iduser": usuarioLogueado.id
            },
            body: JSON.stringify(nuevoEvento)
        })
            .then(response => {
                if (response.status === 401) {
                    console.log(response);
                    cerrarSesionPorFaltaDeToken();
                } else {
                    return response.json();
                }
            })
            .then(data => {
                console.log(data);
                // vaciar campos
                document.querySelector("#datetime").value = "";
                document.querySelector("#inputDetalle").value = "";
                mostrarToast('SUCCESS', 'Evento agregado', data.mensaje);           
            })
            .catch(error => {
                console.error('Error:', error);
            });
    } else {
        mostrarToast('ERROR', 'Error', 'Todos los campos son obligatorios.');
    }

}

function btnMenuListarEventosHandler(){
    fetch(`${APIbaseURL}/eventos.php?idUsuario=${usuarioLogueado.id}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + usuarioLogueado.apiKey,
            "apikey": usuarioLogueado.apiKey,
            "iduser": usuarioLogueado.id
        }})
        .then(response => {
            if (response.codigo === 401) {
                console.log(response);
                // TODO cerrar sesion por falta de token
                cerrarSesionPorFaltaDeToken();
            } else {
                return response.json();
            }
        }).then(data => {
            console.log(data);
            for (let i = 0; i < data.eventos.length; i++) {
                console.log(data.eventos[i]);
                const eventoActual = data.eventos[i];
                eventos.push(eventoActual);
            }
            console.log(eventos);
            
            let listadoEventosHoy = `
                <h1>Eventos Hoy</h1>
                <ion-list>
            
            `;

            let listadoEventosPasados = `
                <h1>Eventos Pasados</h1>
                <ion-list>
            
            `;

            eventos.forEach(e => {
                let categoria = categorias.find(c => c.id === e.idCategoria);
                let hoy = new Date();
                
                if (new Date(e.fecha).toDateString() === new Date(hoy.getFullYear(),hoy.getMonth(),hoy.getDate()).toDateString()) {
                    listadoEventosHoy += `
                    <ion-item class="ion-item-evento" producto-id="${e.id}">
                       <ion-thumbnail slot="start">
                            <img src="https://babytracker.develotion.com/imgs/${categoria.imagen}.png" width="100"/>
                        </ion-thumbnail>
                        <ion-label>
                            <h2>${categoria.tipo}</h2>
                            <p>${e.fecha}</p>
                            <p>${e.detalle}</p>
                        </ion-label>
                        
                    </ion-item>
                `;
                } else {
                    listadoEventosPasados += `
                    <ion-item class="ion-item-evento" producto-id="${e.id}">
                       <ion-thumbnail slot="start">
                            <img src="https://babytracker.develotion.com/imgs/${categoria.imagen}.png" width="100"/>
                        </ion-thumbnail>
                        <ion-label>
                            <h2>${categoria.tipo}</h2>
                            <p>${e.fecha}</p>
                            <p>${e.detalle}</p>
                        </ion-label>
                        
                    </ion-item>
                `;
                }
            });
            
            listadoEventosHoy += '</ion-list>';
            listadoEventosPasados += '</ion-list>';

            document.querySelector("#divEventos").innerHTML = listadoEventosHoy + listadoEventosPasados;


        })
        .catch((error) => {
            console.log(error);
            mostrarToast('ERROR', 'Error', 'Por favor, intente nuevamente.');
        });
}

function btnInformeEventosHandler() {
    let informeBiberones = `
        <ion-card color="medium">
            <ion-card-header>
            <ion-card-title>Biberones</ion-card-title>
            <ion-card-subtitle>$ biberones ingeridos hoy.</ion-card-subtitle>
            </ion-card-header>

            <ion-card-content> Tiempo transcurrido desde ultimo biberón: $ </ion-card-content>
        </ion-card>
    `

    let informePaniales = `
        <ion-card color="medium">
            <ion-card-header>
            <ion-card-title>Pañales</ion-card-title>
            <ion-card-subtitle>$ pañales cambiados hoy.</ion-card-subtitle>
            </ion-card-header>

            <ion-card-content> Tiempo transcurrido desde ultimo cambio de pañal: $ </ion-card-content>
        </ion-card>
    `
    document.querySelector("#divBiberones").innerHTML = informeBiberones;
    document.querySelector("#divPaniales").innerHTML = informePaniales;
}

function btnMapaPlazasHandler() {
    
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
            cerrarSesionPorFaltaDeToken();
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
                cerrarSesionPorFaltaDeToken();
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
    PANTALLA_LISTAR.style.display = "none";
    PANTALLA_INFORME.style.display = "none";
    PANTALLA_MAPA.style.display = "none";
}

/* Menú */
function cerrarMenu() {
    MENU.close();
}

// -------------------------- LOGOUT -------------------------
function cerrarSesion() {
    cerrarMenu();
    localStorage.clear();
    usuarioLogueado = null;
    NAV.setRoot("page-login");
    NAV.popToRoot();
}

function cerrarSesionPorFaltaDeToken() {
    mostrarToast('ERROR', 'No autorizado', 'Se ha cerrado sesión por seguridad');
    cerrarSesion();
}

// -------------------------- TOAST --------------------------
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

//========================================================================
// -------------------------------- MAPA -------------------------------- 
//========================================================================
function inicializarMapa() {
    if (!map) {
        map = L.map('divMapa').setView([posicionUsuario.latitude, posicionUsuario.longitude], 18);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        markerUsuario = L.marker([posicionUsuario.latitude, posicionUsuario.longitude], {icon: posicionUsuarioIcon}).addTo(map);
    }
}

function obtenerPlazas() {
    fetch(`${APIbaseURL}/plazas.php`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + usuarioLogueado.apiKey,
            "apikey": usuarioLogueado.apiKey,
            "iduser": usuarioLogueado.id
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            mostrarToast('ERROR', 'Error', data.error);
        } else if (data.plazas.length === 0) {
            mostrarToast('ERROR', 'Error', 'No se han encontrado plazas');
        } else {
            console.log(data);
            for (let i = 0; i < data.plazas.length; i++) {
                console.log(data.plazas[i]);
                const plazaActual = data.plazas[i];
                plazas.push(plazaActual);
            }
            plazas.forEach(p => {
                let esAccesible = p.accesible == "1" ? "Sí" : "No";
                let aceptaMascotas = p.aceptaMascotas == "1" ? "Sí" : "No";
                markerPlaza = L.marker([p.latitud, p.longitud], {icon: posicionSucursalIcon}).addTo(map);
                markerPlaza.bindTooltip(`Es accesible: ${esAccesible}. Acepta mascotas: ${aceptaMascotas}`).openTooltip();
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

//========================================================================
// ----------------------------- CAPACITOR ----------------------------- 
//========================================================================
function cargarPosicionUsuario() {
    if (Capacitor.isNativePlatform()) {
        // Cargo la posición del usuario desde el dispositivo.
        const loadCurrentPosition = async () => {
            const resultado = await Capacitor.Plugins.Geolocation.getCurrentPosition({ timeout: 3000 });
            if (resultado.coords && resultado.coords.latitude) {
                posicionUsuario = {
                    latitude: resultado.coords.latitude,
                    longitude: resultado.coords.longitude
                }
            }
        };
        loadCurrentPosition();
    } else {
        // Cargo la posición del usuario desde el navegador web.
        window.navigator.geolocation.getCurrentPosition(
        // Callback de éxito.
        function (pos) {
            if (pos && pos.coords && pos.coords.latitude) {
                posicionUsuario = {
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude
                };
            }
        },
        // Callback de error.
        function () {
            // No necesito hacer nada, ya asumí que el usuario estaba en ORT.
        });
    }
}