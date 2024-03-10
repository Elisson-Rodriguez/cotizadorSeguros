// Constructores
function Seguro(marca, type, year) {
    this.marca = marca;
    this.type = type;
    this.year = year;
};
// realizar cotizacion con los datos
Seguro.prototype.cotizarSeguro = function () {
    //No se utiliza arrow functions debido a que debemos acceder a datos del objeto.

    /*
        * 1 = Americano 1.15
        * 2 = Asiatico 1.05
        * 3 = Europeo 1.35
    */

    let cantidad;
    const base = 2000;

    switch (this.marca) {

        case "1":
            cantidad = base * 1.15;
            break;
        case "2":
            cantidad = base * 1.05;
            break;
        case "3":
            cantidad = base * 1.35;
            break;

        default:
            break;
    }

    // Leer el año
    const diferencia = new Date().getFullYear() - this.year;
    // Cada año que la diferencia es mayor, el costo va a reducir un 3%
    cantidad -= ((diferencia * 3) * cantidad) / 100;

    /*
        Si el seguro es básico se multiplica por un 30% más
        Si el seguro es completo se multiplica por un 50% más
    */

    if (this.type === 'basico') {
        cantidad *= 1.30;
    } else {
        cantidad *= 1.50;
    }

    return cantidad;
}

userInterface.prototype.mostrarResultado = (seguro, total) => {
    const { marca, year, type } = seguro;
    let textoMarca;
    switch (marca) {
        case '1':
            textoMarca = "Americano";
            break;
        case '2':
            textoMarca = "Asiatico";
            break;
        case '3':
            textoMarca = "Europeo";
            break;

    }

    // crear el resultado
    const div = document.createElement('div');
    div.classList.add('mt-10');

    div.innerHTML = `
        <p class="header">Tu Resumen<p>
        <p class="font-bold">Marca: <span class="font-normal">${textoMarca}</span></p>
        <p class="font-bold">Total: <span class="font-normal">${total}</span></p>
        <p class="font-bold">Tipo: <span class="font-normal capitalize">${type}</span></p>
        <p class="font-bold">Año: <span class="font-normal">${year}</span></p>
    `;

    const resultadoDiv = document.querySelector('#resultado');
    //Mostrar spinner
    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block';
    setTimeout(() => {
        spinner.style.display = 'none';
        resultadoDiv.appendChild(div);
    }, 3000);

}

function userInterface() { };

userInterface.prototype.llenarOpciones = () => {
    const max = new Date().getFullYear();
    const min = max - 20;
    const selectYear = document.querySelector('#year');

    for (let i = max; i > min; i--) {
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option);
    }
}

//mostrar alertas
userInterface.prototype.mostrarMensaje = function (mensaje, tipo) {
    const div = document.createElement('div');

    if (tipo === 'error') {
        div.classList.add('error');
    } else {
        div.classList.add('correcto');
    }

    div.classList.add('mensaje', 'mt-10');
    div.textContent = mensaje;

    // Insertar en el html
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.insertBefore(div, document.querySelector('#resultado'));

    setTimeout(() => {
        div.remove();
    }, 3000);
}

//instanciar UI
const ui = new userInterface();


//Variables

//Eventos
document.addEventListener('DOMContentLoaded', () => {
    ui.llenarOpciones(); //llena el select con los años
});


eventListeners();
function eventListeners() {
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.addEventListener('submit', cotizarSeguro);
}

function cotizarSeguro(e) {
    e.preventDefault();

    // leer la marca seleccionada
    const marca = document.querySelector('#marca').value;

    // Leer el año
    const year = document.querySelector('#year').value;

    // leer el tipo de cobertura
    const type = document.querySelector('input[name="tipo"]:checked').value;

    if (marca === '' || year === '' || type === '') {
        ui.mostrarMensaje('Todos los campos son obligatorios', 'error');
        return;
    }

    ui.mostrarMensaje('Cotizando...', 'exito');
    // Ocultar las cotizaciones previas;
    const resultados = document.querySelector('#resultado div');
    if (resultados != null) {
        resultados.remove();
    }

    //instanciar el seguro
    const seguro = new Seguro(marca, type, year);
    const total = seguro.cotizarSeguro();

    //utilizar proto para que cotize.
    ui.mostrarResultado(seguro, total);
}