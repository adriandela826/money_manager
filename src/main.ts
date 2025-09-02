/* MAIN.TS */

/* Selecionando todo lo que esta en ingreso o gastos */
const btnTipo = document.getElementById("input-tipo") as HTMLSelectElement 
const btnCategoria = document.getElementById("input-categoria") as HTMLSelectElement
const btnFecha = document.getElementById("input-fecha") as HTMLInputElement
const btnMonto = document.getElementById("input-monto") as HTMLInputElement
const btnDesc = document.getElementById("input-desc") as HTMLInputElement
const btnReset = document.getElementById("reset") as HTMLElement
const btnAdd = document.getElementById("add") as HTMLElement

const valorInicial = ():void =>{
        btnTipo.value = btnTipo.options[0].value
        btnCategoria.value = btnCategoria.options[0].value
        btnFecha.value = ""
        btnMonto.value = ""
        btnDesc.value = ""
}

/* Creando funcion para botono reiniciar y add */
const btnReiniciar = ():void => {
    btnReset.addEventListener("click", () =>{
        valorInicial()
    })
}

//Crear el registro y agrega el objeto 
const btnAgregar = ():void => {
    btnAdd.addEventListener("click", () =>{
        const tipo = btnTipo.value
        let categoria = btnCategoria.value
        const fecha = btnFecha.value
        const monto = btnMonto.value
        const descripcion = btnDesc.value

        if (tipo === "-" || (tipo !== "ingreso" && categoria === "-") || !monto || !descripcion) {
            alert("Completa todos los campos")}

        else if (!fecha ){
            alert("Ingresa una fecha valida")
        }

        else {
            if (tipo === "ingreso") {categoria = "-"};
            const registroNuevo = {
                tipo, 
                categoria, 
                fecha, 
                monto, 
                descripcion,
            }

            const registroGuardado = localStorage.getItem("registro")
            const registro = registroGuardado? JSON.parse(registroGuardado) : []
            registro.push(registroNuevo)
            localStorage.setItem("registro", JSON.stringify(registro))
            valorInicial()
        }
    })
}

 //Cuando cambie de gasto a ingreso o visceversa entonces desaparecen o aparecen las categorias
btnTipo.addEventListener("change", () => {
    btnTipo.value === "ingreso" ? btnCategoria.style.display = "none" : btnCategoria.style.display = "inline-block"
})

const lisMonto = document.querySelectorAll<HTMLElement>(".grid ul li span:nth-child(2)");
const lisPorcent = document.querySelectorAll<HTMLElement>(".grid ul li span:nth-child(3)");
let saldoMensual = document.querySelector(".total-dinero span") as HTMLElement;
let restaTotal = document.querySelector(".restante-dinero span") as HTMLElement;
let gastoMensual = document.querySelector(".gastado-dinero span") as HTMLElement;
let arrayGastos: number[] = Array(lisMonto.length).fill(0);
let porcentajesTotales: number[] = Array(lisMonto.length).fill(0);

const datosGuardados = localStorage.getItem("fullinner");
const ultimoRegistro = datosGuardados ? JSON.parse(datosGuardados).pop() : null;
let valorIngreso: number = ultimoRegistro ? Number(ultimoRegistro.ingreso.replace("s/", "")) || 0 : 0;
let sumatoriaGastos: number = 0;

saldoMensual.innerHTML = `s/${valorIngreso}`;
restaTotal.innerHTML = `s/${valorIngreso - sumatoriaGastos}`;

btnAdd.addEventListener("click", () => {
    lisMonto.forEach((liInd, index) => {
        //Crea array gastos, suma todo y actualiza
        if (liInd.className.includes(btnCategoria.value) && btnCategoria.value !== "-" && btnTipo.value === "gasto" && btnFecha.value && btnMonto.value && btnDesc.value) {
            arrayGastos[index] += Number(btnMonto.value);
            sumatoriaGastos = arrayGastos.reduce((acumulador, valor) => acumulador + valor, 0);
            //Coloca todos los gastos segun categoria y actualiza el gasto y resta total 
            liInd.innerHTML = `s/${arrayGastos[index]}`;
            gastoMensual.innerHTML = `s/${sumatoriaGastos}`;
            restaTotal.innerHTML = `s/${valorIngreso - sumatoriaGastos}`;

            //Crea array porcentajes, se modifica y actualiza en pantalla
            lisPorcent.forEach((liPor, index) => {
                porcentajesTotales[index] = Math.round((arrayGastos[index]/sumatoriaGastos)*100);
                liPor.innerHTML = `(${porcentajesTotales[index]}%)`;
            });
        }
    });

    //Si es ingreso, suma el ingreso, suma los gastos y vuelve a ejecutar y coloca en innerhtml
    if (btnTipo.value === "ingreso" && btnFecha.value && btnMonto.value && btnDesc.value) {
        valorIngreso += Number(btnMonto.value);
        sumatoriaGastos = arrayGastos.reduce((acumulador, valor) => acumulador + valor, 0); //gasto

        saldoMensual.innerHTML = `s/${valorIngreso}`;
        restaTotal.innerHTML = `s/${valorIngreso - sumatoriaGastos}`;
    }

    //Crea objeto para colocar en localstorage
    const nuevoInner = {
        ingreso: saldoMensual.innerHTML,
        gasto: gastoMensual.innerHTML,
        restante: restaTotal.innerHTML,
        arraygastos: JSON.stringify(arrayGastos),
        arrayporcent: JSON.stringify(porcentajesTotales),
    };

    localStorage.setItem("fullinner", JSON.stringify([nuevoInner]));
});

const innerGuardados = localStorage.getItem("fullinner")
const full = innerGuardados? JSON.parse(innerGuardados):[];

//Todo esto actualiza los datos en la pagina 
const actualizarPagina = ():void => {
    if (full.length > 0) {
        arrayGastos = JSON.parse(full[0].arraygastos);
        porcentajesTotales = JSON.parse(full[0].arrayporcent);
        saldoMensual.innerHTML = full[0].ingreso
        gastoMensual.innerHTML = full[0].gasto  
        restaTotal.innerHTML = full[0].restante 
    }

    if (arrayGastos && porcentajesTotales) {
        for (let index = 0; index < arrayGastos.length; index++) {
            lisMonto[index].innerHTML = `s/${arrayGastos[index]}`;
            lisPorcent[index].innerHTML = `(${porcentajesTotales[index]}%)`;
        }
    }
}


// Agregar toda la info a chart.js 
   
/* Llamando a las funciones */
    btnReiniciar();
    btnAgregar();
    actualizarPagina();

/* Grafico Chart */

const colores = [/* Colocar colores segun el cuadrito de al lado   */
  'rgb(255, 99, 132)',    // Rojo coral
  'rgb(54, 162, 235)',    // Azul brillante
  'rgb(255, 205, 86)',    // Amarillo oro
  'rgb(75, 192, 192)',    // Verde turquesa
  'rgb(153, 102, 255)',   // Morado suave
  'rgb(255, 159, 64)',    // Naranja cálido
  'rgb(201, 203, 207)'    // Gris neutro
];


/* Hacer que cuando algo cambie se note automaticamente */

import Chart from 'chart.js/auto';
const ctx = document.getElementById('myChart') as HTMLCanvasElement;

new Chart(ctx, {
    type: 'doughnut',
    data: {
        datasets: [{
            label: 'gastos',
            data: arrayGastos,
            backgroundColor:colores,
        hoverOffset: 10
    }]
}})

/* Fin de Chart */
