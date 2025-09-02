import { _isClickEvent } from "chart.js/helpers";

type TipoRegistro = "gasto" | "ingreso";

interface Registro{
    categoria: string
    descripcion: string
    fecha: string
    monto: string
    tipo: TipoRegistro
}

const registroGuardado = localStorage.getItem("registro")
const registroActual = registroGuardado ? JSON.parse(registroGuardado) : []

const agregarDetalle = ():void => {
const ul = document.querySelector("div.detalle-despli ul") as HTMLElement

    if (registroActual.length > 0){
        registroActual.forEach((registro: Registro, index:number)=> {
            const li = document.createElement("li")
            let categoria: String = ""
            let color: String = ""

            if (registro.tipo === "ingreso") {
                li.className = `registro-ingresos-${index+1}`
                categoria = "ingreso"
                color = "-blue"
            }else{
                li.className = `registro-${registro.categoria}-${index+1}`
                categoria = registro.categoria
                color = "-red"
            }
            
            const meses = 
                ["Ene", "Feb", "Mar", "Abr", "May", "Jun", 
                "Jul", "Ago", "Sep", "Oct", "Nov", "Dic" ]
            const [anioAny, mesAny, diaAny] = registro.fecha.split("-")
            const anio: string = anioAny
            const mes: number = parseInt(mesAny, 10)
            const dia: string = diaAny

            
            li.innerHTML = 
                `<div>
                    <span class="mes">${meses[mes-1]}</span>
                    <span class="dia">${dia}</span>
                    <span class="anio">${anio}</span>
                </div>
                <div>
                    <span class="cat">${categoria.toUpperCase()}</span>
                    <span class="desc">${registro.descripcion}</span>
                </div>
                <div>
                    <span class="monto${color}">s/${registro.monto}</span>
                </div>
                <div>
                    <span>\u00d7</span>
                </div>`

            ul.appendChild(li);
        })
    }
}
    
//Para ordenar segun la categoria de gasto o ingreso

    const btnTodo = document.querySelector(".btn-todo") as HTMLElement
    const btnAlimentacion = document.querySelector(".btn-alimentacion") as HTMLElement
    const btnEducacion = document.querySelector(".btn-educacion") as HTMLElement
    const btnTrabajo = document.querySelector(".btn-trabajo") as HTMLElement
    const btnSalud = document.querySelector(".btn-salud") as HTMLElement
    const btnOcio = document.querySelector(".btn-ocio") as HTMLElement
    const btnAhorro = document.querySelector(".btn-ahorro") as HTMLElement
    const btnOtros = document.querySelector(".btn-otros") as HTMLElement
    const btnIngresos = document.querySelector(".btn-ingresos") as HTMLElement
    
    const botonesCategorias = [
        btnAlimentacion, btnEducacion, 
        btnTrabajo, btnSalud, btnOcio, btnAhorro, btnOtros, btnIngresos]

    const arrayValores:string[] = botonesCategorias.map(boton =>{
            return boton.className.split("-")[1]
    })

const ordenCategoria = ():void => {
    arrayValores.forEach((clase:string, index:number) =>{
        botonesCategorias[index].addEventListener("click", () =>{

            const liDisplay = document.querySelectorAll<HTMLElement>("div.detalle-despli ul li")
            const claseOculta = "oculto"

            for (const liInd of liDisplay) {
                btnTodo.addEventListener("click", () =>{
                    liInd.classList.remove(claseOculta);
                })
                if (!liInd.className.includes(clase)){
                    liInd.classList.add(claseOculta)
                }
                else{
                    liInd.classList.remove(claseOculta)
                }
            }
        })
    })
}

//Eliminar un elemento en el section html al darle clic a la "x"

const eliminarBalance = ():void => {
    const ul = document.querySelector(".detalle-despli ul") as HTMLElement     
    const lis = document.querySelectorAll<HTMLElement>(".detalle-despli ul li")

    if (ul) {
        for (let i = 0; i < lis.length; i++) {
            const eliminar = lis[i].querySelector("div:last-child") as HTMLElement 
            eliminar.addEventListener("click", ()=> {
            registroActual.splice(i, 1);
            localStorage.setItem("registro", JSON.stringify(registroActual));
            location.reload()                
            })
        }
    }
}

//Modifica el fullinner para que se actualice en la principal
const eliminarFulliner = ():void => {
    const ul = document.querySelector(".detalle-despli ul") as HTMLElement     
    const lis = document.querySelectorAll<HTMLElement>(".detalle-despli ul li")

    if (ul) {
        for (let i = 0; i < lis.length; i++) {
            const eliminar = lis[i].querySelector("div:last-child") as HTMLElement 
            const monto = lis[i].querySelector("div:nth-child(3)>span") as HTMLElement 
            const numero = Number(String(monto.textContent).replace("s/",""))

            eliminar.addEventListener("click", ()=> {
                const innerGuardados = localStorage.getItem("fullinner")
                const full = innerGuardados? JSON.parse(innerGuardados): []
                let arrayActual = JSON.parse(full[0].arraygastos)  
                let porcentajeActual:number[] = JSON.parse(full[0].arrayporcent) as number[]
                let dinero = full[0].ingreso.replace("s/","")
                let calculoIngreso
                let gasto = full[0].gasto.replace("s/","")
                let restante = full[0].restante.replace("s/","")
                let sumaGastos: number = 0 


                arrayValores.forEach((clase:string, index:number) =>{
                    //Para arraygastos(luego en main ya hare que todos los gastos se sumen y den gastos)
                    if (lis[i].className.includes(clase) && index < 7)  {
                        let gastoActualizado = arrayActual[index] - numero
                        arrayActual[index] = gastoActualizado
                        sumaGastos = arrayActual.reduce((acumulador:number, valor:number) => acumulador + valor, 0);
                        gasto = sumaGastos
                        restante = dinero - gasto

                        if (sumaGastos > 0){
                            porcentajeActual.forEach((porcentaje:number, index:number) => {
                            porcentajeActual[index] = Math.round((arrayActual[index]/sumaGastos)*100);
                            }) 
                        }else{
                            porcentajeActual.fill(0)
                        }
                    
                        full[0].arraygastos = JSON.stringify(arrayActual);                        
                        full[0].gasto = `s/${gasto}`
                        full[0].arrayporcent = JSON.stringify(porcentajeActual);                        
                        full[0].restante = `s/${restante}`
                        localStorage.setItem("fullinner", JSON.stringify(full));
                    //Para ingresos
                    }else if (lis[i].className.includes(clase) && index === 7) {
                        calculoIngreso = dinero-numero
                        restante = calculoIngreso - gasto

                        full[0].ingreso = `s/${calculoIngreso}`
                        full[0].restante = `s/${restante}`
                        localStorage.setItem("fullinner", JSON.stringify(full));
                    }
                })
            })
        }
    }
}

agregarDetalle()
ordenCategoria()
eliminarBalance()
eliminarFulliner()

