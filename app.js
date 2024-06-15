const express = require('express')

const app = express()

app.listen(3000,()=>console.log("Escuchando en el puerto 3000"))

app.use(express.json())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Permite cualquier origen
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/', (req,res)=>{
    let mysql = require("mysql")

    let conexion = mysql.createConnection({
        host: "localhost",
        database: "base_isla",
        user: "root",
        password: ""
    })

    conexion.connect((error)=>{
        if(error) throw error
    })

    const productos = "SELECT id, codigo, nombre, valor_utilidad as precio FROM producto"

    conexion.query(productos,(error,respuesta)=>{
        if(error)throw error
        else{
            /* Consultar Productos INI*/
            let tbody = ''
            let tr = ''
            respuesta.forEach(producto=>{                
                let td = ''
                for (const clave in producto) {
                    td += `<td>${producto[clave]}</td>`
                }
                tr += `<tr>${td}</tr>`
            })
            tbody = `<tbody>${tr}</tbody>`
            
            /* Consultar Productos FIN*/
            res.send(
                `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" 
                        rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" 
                        crossorigin="anonymous">
                    <title>Productos</title>
                </head>
                <body>
                    <div class="container">
                        <h2 class="p-2">Productos</h2>
                        <div class="p-2">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                    <th scope="col">Id</th>
                                    <th scope="col">Codigo</th>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Precio</th>
                                    </tr>
                                </thead>
                                ${tbody}
                            </table>
                        </div>
                        <div class="p-2">
                            <button type="button" class="btn btn-outline-info">
                                Generar PDF
                            </button>
                        </div>
                    </div>
                    <script>
                        const enviar_info = ()=>{                                                        
                            fetch('http://127.0.0.1:3000/locote', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(${respuesta})}
                            })
                            .then(response => response.json())
                            .then(data => console.log(data))
                            .catch(error => console.error('Error:', error))
                        }
                    </script>
                    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" 
                        integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" 
                        crossorigin="anonymous"></script>
                </body>
                </html>
                `
            )
        }
    })
    conexion.end()
})

app.post('/locote',
async function(req, res){
    try{
        res.json(req.body)
    }catch(error){res.send(`Error: ${error}`)}
})

//npm run start