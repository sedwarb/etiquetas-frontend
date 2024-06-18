const express = require('express')
const cors = require('cors')
require('dotenv').config()

const {
    DB_USER, DB_PASSWORD, DB_HOST,DB_NAME
  } = process.env;

const app = express()

app.listen(3000,()=>console.log("Escuchando en el puerto 3000"))

app.use(express.json())
app.use(cors())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.get('/',cors(), (req,res)=>{
    let mysql = require("mysql")

    let conexion = mysql.createConnection({
        host: DB_HOST,
        database: DB_NAME,
        user: DB_USER,
        password:DB_PASSWORD
    })

    conexion.connect((error)=>{
        if(error) throw error
    })

    const productos = "SELECT id, codigo, nombre, valor_utilidad as precio FROM producto"

    conexion.query(productos,(error,respuesta)=>{
        if(error)throw error
        else{
            /* Consultar Productos INI*/
            let produc_array = []
            let tbody = ''
            let tr = ''
            respuesta.forEach((producto)=>{
                let td = `<td>
                        <input 
                        class="form-check-input" 
                        type="checkbox" 
                        value="${producto["id"]}" 
                        id="${producto["id"]}">
                    </td>`
                produc_array.push(producto)
                for (const clave in producto) {
                    td += `<td>${producto[clave]}</td>`
                }
                tr += `<tr id="id-tbody-${producto["id"]}">${td}</tr>`
            })
            tbody = `<tbody id="tbody-productos">${tr}</tbody>`
            
            /* Consultar Productos FIN*/
            //res.send(respuesta)
             
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
                                    <th scope="col">Selec</th>
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
                            <button class="btn btn-outline-info" id="consultar">Imprimir</button>
                        </div>
                    </div>
                    <script>
                        const consultar = document.getElementById("consultar")
                        consultar.addEventListener('click',()=>{
                            const inputs = document.getElementsByTagName("input")
                            const tbody = document.getElementById("tbody-productos")

                            const chequeados = [], info = []
                            for (const key in inputs) {        
                                if(inputs[key].checked){
                                    chequeados.push(parseInt(inputs[key].id))
                                }
                            }
                            chequeados.forEach(element=>{
                                const tr = document.getElementById("id-tbody-"+element)
                                const trobj = tr.getElementsByTagName("td"), reg = []
                                
                                for (const key in trobj){
                                    if(key>0){
                                        reg.push(trobj[key].innerText)
                                    }
                                }
                                info.push({nombre:reg[2],precio:reg[3]})
                            })
                            fetch('http://127.0.0.1:3000/envio', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(info)
                            })
                            .then(response => response.json())
                            .then(data => location.href = 'http://127.0.0.1:3000/exitoso')
                            .catch(error => console.log(error))
                            /*.catch(error => location.href = 'http://127.0.0.1:3000/error')*/
                        })
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

app.get('/exitoso',cors(),
function(req, res){
    res.sendFile(__dirname + "/vistas/exitoso.html")
})

app.get('/error',cors(),
function(req, res){
    res.sendFile(__dirname + "/vistas/error.html")
})

app.post('/envio',cors(),
function(req, res){
    const { generar_pdf } = require("./pdf")
    generar_pdf(req.body)
    res.send({"msg":"Bien"})
})
//npm run start