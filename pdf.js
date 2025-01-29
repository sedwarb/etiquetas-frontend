/* Generar PDF INI*/
const fs = require('fs')
const { jsPDF } = require("jspdf")
const { imglogoAUX } = require("./img-logo")
var opciones = {
    orientation: 'l',
    //orientation: 'p',
    unit: 'mm',
    format: [80, 40]
}
/* try {
    fs.unlinkSync('./imprimir/imprimir.pdf')
} catch (err) {
    console.error('Ocurrió un error al eliminar el archivo:', err);
} */

function separarPalabras(texto, maxCaracteresPorLinea) {
    const palabras = texto.split(' ');
    const lineas = [];
    let lineaActual = '';
  
    palabras.forEach(palabra => {
      if (lineaActual.length + palabra.length + 1 <= maxCaracteresPorLinea) {
        // Si la palabra cabe en la línea actual, la agregamos
        lineaActual += (lineaActual ? ' ' : '') + palabra;
      } else {
        // Si la palabra no cabe, iniciamos una nueva línea
        lineas.push(lineaActual);
        lineaActual = palabra;
      }
    });
  
    // Agregamos la última línea si no está vacía
    if (lineaActual) {
      lineas.push(lineaActual);
    }
  
    return lineas;
  }

var doc = new jsPDF(opciones)
const capitalizarFirst = (texto) => texto.charAt(0).toUpperCase() + texto.substring(1)
const capitalizarAll = (texto) => {
    return texto.split(" ")
                .map(palabra => capitalizarFirst(palabra))
                .join(" ")
}

/* funcion ejecutada por boton INI*/
const generar_pdf = (respuesta)=>{
    //inpresion vertical solo
    //const posicion = 22 (1)
    //const posicion = 22 (2)
    const posicion = 1,
    //texto1 = 17, texto2 = 14, numero = 31 (1)
    texto1 = 14, texto2 = 20, texto3 = 26, numero = 35
    for (let j = 0; j < respuesta.length; j++) {                
        //if(j>0)doc.addPage(opciones)
        
        doc.setFontSize(15);
        let tamanio = capitalizarAll(respuesta[j].nombre)
        if(tamanio.length<13){
            doc.text(posicion, 7, tamanio)
        }else{
            //const texto = 'LA JOYA CON BICARBONATO X500ML';
            const maxCaracteres = 11;
            const lineasSeparadas = separarPalabras(tamanio, maxCaracteres); 
             for (let i = 0; i < lineasSeparadas.length; i++) {
                if(i==0)doc.text(posicion, texto1, lineasSeparadas[i])
                if(i==1)doc.text(posicion, texto2, lineasSeparadas[i]) 
                if(i==2)doc.text(posicion, texto3, lineasSeparadas[i])  
             }

            /* let n1 = tamanio.slice(0,11), 
                n2 = tamanio.slice(11,tamanio.length>24?24:tamanio.length) */
            /* let n1 = lineasSeparadas[0],
                n2 = lineasSeparadas[1],
                n3 = lineasSeparadas[2] */

            /* doc.text(posicion, texto1, n1)
            doc.text(posicion, texto2, n2) */
            //doc.text(posicion, texto3, n3)                     
        }
        doc.setFontSize(30)
        
        doc.text(posicion, numero, 
            new Intl.NumberFormat(
                'es-CO', 
                { 
                    style: 'currency', 
                    currency: 'COP', 
                    minimumFractionDigits: 0 
                }).format(respuesta[j].precio)
        )
        //doc.addImage(imglogoAUX, 'JPEG', 70, 22, 9, 11)
        doc.addPage(opciones)
    }
    let pageCount = doc.internal.getNumberOfPages()
    doc.deletePage(pageCount)
    //doc.autoPrint({ variant: 'non-conform' })
    let fecha = new Date()
    fecha = `${fecha.getDate()}${fecha.getMonth()+1}${fecha.getFullYear()}_${fecha.getHours()}${fecha.getMinutes()}`
    doc.save(`./imprimir/imprimir.pdf`)

}
/* funcion ejecutada por boton FIN*/
module.exports = {
    generar_pdf
}

/* Generar PDF FIN*/