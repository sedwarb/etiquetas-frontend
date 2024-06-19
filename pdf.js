/* Generar PDF INI*/
const fs = require('fs')
const { jsPDF } = require("jspdf")
const { imglogoAUX } = require("./img-logo")
var opciones = {
    orientation: 'l',
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
    for (let j = 0; j < respuesta.length; j++) {                
        //if(j>0)doc.addPage(opciones)
        
        doc.setFontSize(20);
        let tamanio = capitalizarAll(respuesta[j].nombre)
        if(tamanio.length<17){
            doc.text(22, 7, tamanio)
        }else{                                        
            let n1 = tamanio.slice(0,16), 
                n2 = tamanio.slice(16,tamanio.length>34?34:tamanio.length)
            doc.text(22, 7, n1)
            doc.text(22, 14, n2)                    
        }
        doc.setFontSize(30)
        
        doc.text(22, 31, 
            new Intl.NumberFormat(
                'es-CO', 
                { 
                    style: 'currency', 
                    currency: 'COP', 
                    minimumFractionDigits: 0 
                }).format(respuesta[j].precio)
        )
        doc.addImage(imglogoAUX, 'JPEG', 70, 22, 9, 11)
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