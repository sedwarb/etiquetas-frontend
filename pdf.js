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
try {
    fs.unlinkSync('./imprimir/imprimir.pdf')
} catch (err) {
    console.error('Ocurrió un error al eliminar el archivo:', err);
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
    texto1 = 14, texto2 = 20, numero = 35
    for (let j = 0; j < respuesta.length; j++) {                
        //if(j>0)doc.addPage(opciones)
        
        doc.setFontSize(15);
        let tamanio = capitalizarAll(respuesta[j].nombre)
        if(tamanio.length<13){
            doc.text(posicion, 7, tamanio)
        }else{                                        
            let n1 = tamanio.slice(0,11), 
                n2 = tamanio.slice(11,tamanio.length>24?24:tamanio.length)
            doc.text(posicion, texto1, n1)
            doc.text(posicion, texto2, n2)                    
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

    doc.save(`./imprimir/imprimir.pdf`)
}
/* funcion ejecutada por boton FIN*/
module.exports = {
    generar_pdf
}

/* Generar PDF FIN*/