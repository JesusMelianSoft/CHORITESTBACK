const express = require('express');
//Cors nos permite compartir datos dentro del mismo servidor
const cors = require('cors');
const { query } = require('../config/db.js');
const app = express();
app.disable('x-powered-by');

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
    //permite el control de acceso al origen, permite compartir recursos dentro del mismo servidor
app.use(cors());

let server;
const runServer = () => {
    // Initialize the server
    server = app.listen(8002, () => {
        console.log(
            `Server started at port http://localhost:${server.address().port}`
            );
    })
}

const stopServer = () => {
    console.log('Closing out remaining connection');
    server.close();
}
/*
* Rutas de Nuestra API 
*/


//QUERYS DE CLIENTES
app.get('/api/v1/clientes/', async(req, res) => {
    try {
        const sql = "SELECT * FROM `clientes`";
        const result = await query(sql);
        let message = '';
        if(result === undefined || result.length === 0) {
            message = 'Actores table is empty';
        }else{
            message = 'Successfully retrieved all actors';
        }

        res.send({ 
            error: false,
            data: result,
            message: message
        })
    } catch (error) {
        console.log(error);
        res.resStatus(500);
    }
})
//OBTENER CLIENTES DE UN TRABAJADOR ESPECIFICO
app.get('/api/v1/clientes/:id_cliente', async(req, res) => {
    const { id_cliente } = req.params;
    try {
        const sql = "SELECT * FROM clientes WHERE id_cliente =?";
        const result = await query(sql, [id_cliente]);
        let message = '';
        if(result === undefined || result.length === 0) {
            message = 'Actores table is empty';
        }else{
            message = 'Successfully retrieved all actors';
        }

        res.send({ 
            error: false,
            data: result,
            message: message
        })
    } catch (error) {
        console.log(error);
        res.resStatus(500);
    }
})

//Update client by cod
app.put('/api/v1/client/:id_cliente', async(req, res) => {
    console.log(req.body);
    const { id_tip_fac, id_tip_alb, proveedor, departamento, sucursal, cen_entrega, CIF, dir1, dir2, dir3, cuenta_banca, provincia, localidad, nombre} = req.body;
    const { id_cliente } = req.params;
    console.log('req.body: ',req.body);

    try {
        const sql = 'UPDATE clientes SET ' +
        'id_tip_fac = ?,' +
        'id_tip_alb = ?,'+
        'proveedor = ?,'+
        'departamento = ?,'+
        'sucursal = ?,'+
        'cen_entrega = ?,'+
        'CIF = ?,'+
        'dir1 = ?,'+
        'dir2 = ?,'+
        'dir3 = ?,'+
        'cuenta_banca = ?,'+
        'provincia = ?,'+
        'localidad = ?,'+
        'nombre = ?'+
    'WHERE id_cliente = ?;';
        const result = await query(sql, [id_tip_fac, 
            id_tip_alb, 
            proveedor, 
            departamento, 
            sucursal, 
            cen_entrega, 
            CIF, 
            dir1,
            dir2, 
            dir3, 
            cuenta_banca, 
            provincia, 
            localidad,
            nombre,
            id_cliente])

        let message = '';
        if(result.changedRows == 0){
            message = 'Actor not found or data are same';
        }else{
            message = 'Actor successfully updated';
        }
        res.send({
            error: false,
            data: {chandedRows: result.chandedRows},
            message: message
        })
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

//Delete client by id
app.delete('/api/v1/client/:id_cliente', async(req, res) => {
    const { id_cliente} = req.params;

    if(!id_cliente){
        res.status(400).send({ 
            error: true,
            message: 'provide actor id',

        })
    }
    try {
        const sql = "DELETE FROM clientes WHERE id_cliente = ?";
        const result = await query(sql, [id_cliente]);
        let message = '';
        
        if(result.affectedRows === 0) {
            message = 'Client is not found';
        }else{
            message = 'Client ' + id_cliente + ' successfully delete';
        }

        res.send({
            error: false,
            data: {affectedRows: result.affectedRows},
            message: message
        })
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

// Add new client
app.post('/api/v1/client/', async(req, res) => {
    console.log("BODY DE CLIENTE",req.body);
    var {id_cliente, id_tip_fac, id_tip_alb, proveedor,
    departamento, sucursal, cen_entrega, CIF, dir1, dir2, dir3, cuenta_banca,
    provincia, localidad, nombre} = req.body;

    console.log("MI CLIENTE:",id_cliente, id_tip_fac, id_tip_alb, proveedor,
                departamento, sucursal, cen_entrega, CIF, dir1, dir2, dir3, cuenta_banca, 
                provincia, localidad, nombre);
    try {
        const sql = 'INSERT INTO clientes (id_cliente, id_tip_fac, id_tip_alb, proveedor, ' + 
                    'departamento, sucursal, cen_entrega, CIF, dir1, dir2, dir3, cuenta_banca, ' + 
                    'provincia, localidad, nombre)VALUES(?, ?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        console.log('SQL:',sql)
        const result = await query(sql, [id_cliente, id_tip_fac, id_tip_alb, proveedor,
            departamento, sucursal, cen_entrega, CIF, dir1, dir2, dir3, cuenta_banca,
            provincia, localidad, nombre])
        console.log('result insertClient: ',result)

        res.send({
            error: false,
            data: {id_cliente},
            message: 'El cliente se ha añadido de forma correcta ' + result.insert_id
        })
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

//QUERYS DE ALBARANES
app.get('/api/v1/albaranes/', async(req, res) => {
    try {
        const sql = "SELECT * FROM `albaranes`";
        const result = await query(sql);
        let message = '';
        if(result === undefined || result.length === 0) {
            message = 'Actores table is empty';
        }else{
            message = 'Successfully retrieved all actors';
        }

        res.send({ 
            error: false,
            data: result,
            message: message
        })
    } catch (error) {
        console.log(error);
        res.resStatus(500);
    }
})
//OBTENER UNO EN ESPECIFICO
app.get('/api/v1/albaranes/:id_alb', async(req, res) => {
    const { id_alb } = req.params;
    try {
        const sql = "SELECT * FROM albaranes WHERE id_alb =?";
        const result = await query(sql, [id_alb]);
        let message = '';
        if(result === undefined || result.length === 0) {
            message = 'Albaranes table is empty';
        }else{
            message = 'Successfully retrieved all actors';
        }

        res.send({ 
            error: false,
            data: result,
            message: message
        })
    } catch (error) {
        console.log(error);
        res.resStatus(500);
    }
})

//Albaranes de un cliente en especifico
app.get('/api/v1/albaranes/cliente/:id_cli', async(req, res) => {
    const { id_cli } = req.params;
    try {
        const sql = "SELECT * FROM albaranes WHERE id_cli =?";
        const result = await query(sql, [id_cli]);
        let message = '';
        if(result === undefined || result.length === 0) {
            message = 'Albaranes table is empty';
        }else{
            message = 'Successfully retrieved all actors';
        }

        res.send({ 
            error: false,
            data: result,
            message: message
        })
    } catch (error) {
        console.log(error);
        res.resStatus(500);
    }
})

//Delete client by id
app.delete('/api/v1/albaranes/:id_alb', async(req, res) => {
    const { id_alb} = req.params;

    if(!id_alb){
        res.status(400).send({ 
            error: true,
            message: 'provide actor id',

        })
    }
    try {
        const sql = "DELETE FROM albaranes WHERE id_alb = ?";
        const result = await query(sql, [id_alb]);
        let message = '';
        
        if(result.affectedRows === 0) {
            message = 'No se ha encontrado el albarán';
        }else{
            message = 'Albarán ' + id_alb + ' se ha borrado correctamente';
        }

        res.send({
            error: false,
            data: {affectedRows: result.affectedRows},
            message: message
        })
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

//NUEVO ALABRAN
app.post('/api/v1/albaranes/', async(req, res) => {
    console.log("BODY DE ALBARAN",req.body);
    var {id_cli, id_tip_fac, tip_pago, f_pago,tip_med,tip_impuesto,impuesto,descuento,f_ven,f_pedido,subtotal,total,aux_uno,aux_cabe} = req.body;

    console.log("MI ALBARAN:",id_cli, id_tip_fac, tip_pago, f_pago,tip_med,tip_impuesto,impuesto,descuento,f_ven,f_pedido,subtotal,total,aux_uno,aux_cabe);
    try {
        const sql = 'INSERT INTO albaranes(id_cli,id_tip_fac,tip_pago,f_pago,tip_med,tip_impuesto,impuesto,descuento,f_ven,f_pedido,subtotal,total,aux_uno,aux_cabe)VALUES(?, ?,?,?,?,?,?,?,?,?,?,?,?,?);';
        console.log('SQL:',sql)
        const result = await query(sql, [id_cli, id_tip_fac, tip_pago, f_pago,tip_med,tip_impuesto,impuesto,descuento,f_ven,f_pedido,subtotal,total,aux_uno,aux_cabe])
        console.log('result InsertAlbaran: ',result)

        res.send({
            error: false,
            data: {id_cli},
            message: 'El Albarán se ha añadido de forma correcta ' + result.insert_id
        })
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

//OBTENER LINEAS DE UN ALABRAN EN ESPECIFICO
app.get('/api/v1/albaranes_linea/albaran/:id_alb', async(req, res) => {
    const { id_alb } = req.params;
    try {
        const sql = "SELECT * FROM albaranes_linea WHERE id_alb =?";
        const result = await query(sql, [id_alb]);
        let message = '';
        if(result === undefined || result.length === 0) {
            message = 'Albaranes table is empty';
        }else{
            message = 'Successfully retrieved all actors';
        }

        res.send({ 
            error: false,
            data: result,
            message: message
        })
    } catch (error) {
        console.log(error);
        res.resStatus(500);
    }
})

// Add new client
app.post('/api/v1/albaranes_linea/:id_alb', async(req, res) => {
    console.log("BODY DE CLIENTE",req.body);
    var {id_linea,id_alb,cantidad,descripcion,precio_un,subtotal,total} = req.body;

    console.log("MI ALBARANLINE:",id_linea,id_alb,cantidad,descripcion,precio_un,subtotal,total);
    try {
        const sql = 'INSERT INTO albaranes_linea (id_alb,cantidad,descripcion,precio_un,subtotal,total)VALUES(?,?,?,?,?,?)';
        console.log('SQL:',sql)
        const result = await query(sql, [id_alb,cantidad,descripcion,precio_un,subtotal,total])
        console.log('result InsertLine: ',result)

        res.send({
            error: false,
            data: {id_linea},
            message: 'la línea del albarán se ha añadido de forma correcta ' + result.insert_id
        })
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

// Add new client
app.put('/api/v1/albaranes_linea/:id_alb', async(req, res) => {
    console.log("BODY DE CLIENTE",req.body);
    var {id_linea,id_alb,cantidad,descripcion,precio_un,subtotal,total} = req.body;

    console.log("MI ALBARANLINE:",id_linea,id_alb,cantidad,descripcion,precio_un,subtotal,total);
    try {
        const sql = 'UPDATE albaranes_linea SET cantidad = ?,descripcion = ?,precio_un = ?,subtotal = ?,total = ? WHERE id_linea = ?';
        console.log('SQL:',sql)
        const result = await query(sql, [cantidad,descripcion,precio_un,subtotal,total, id_linea])
        console.log('result InsertLine: ',result)

        res.send({
            error: false,
            data: {id_linea},
            message: 'El cliente se ha añadido de forma correcta ' + result.insert_id
        })
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

//Delete client by id
app.delete('/api/v1/albaranes_linea/:id_linea', async(req, res) => {
    const { id_linea} = req.params;

    if(!id_linea){
        res.status(400).send({ 
            error: true,
            message: 'provide actor id',

        })
    }
    try {
        const sql = "DELETE FROM albaranes_linea WHERE id_linea = ?";
        const result = await query(sql, [id_linea]);
        let message = '';
        
        if(result.affectedRows === 0) {
            message = 'Linea is not found';
        }else{
            message = 'Linea ' + id_linea + ' successfully delete';
        }

        res.send({
            error: false,
            data: {affectedRows: result.affectedRows},
            message: message
        })
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})



//OBTENER TOTAL DEL TACO
app.get('/api/v1/totalDebeClient/:cod_user', async(req, res) => {
    const { cod_user} = req.params;
    try {
        console.log("SERVER"+cod_user)
        const sql = "SELECT SUM(debe) AS suma FROM clientes WHERE clientes.cod_user="+cod_user;
        const result = await query(sql);
        let message = '';
        if(result === undefined || result.length === 0) {
            message = 'Actores table is empty';
        }else{
            message = 'Successfully retrieved all actors';
        }

        res.send({ 
            error: false,
            data: result,
            message: message
        })
    } catch (error) {
        console.log(error);
        res.resStatus(500);
    }
})



//OBTENER TOTAL DEL TACO
app.get('/api/v1/pagos/:cod_user', async(req, res) => {
    const { cod_user} = req.params;
    try {
        console.log("SERVER"+cod_user)
        const sql = "SELECT * FROM `pagos` WHERE cod_user="+cod_user+" ORDER BY cod_pago DESC";
        const result = await query(sql);
        let message = '';
        if(result === undefined || result.length === 0) {
            message = 'Actores table is empty';
        }else{
            message = 'Successfully retrieved all actors';
        }

        res.send({ 
            error: false,
            data: result,
            message: message
        })
    } catch (error) {
        console.log(error);
        res.resStatus(500);
    }
})

app.post('/api/v1/pago', async(req, res) => {
    console.log("BODY DE PAGO",req.body);
    var { cod_cliente, nombre_c, apellidos_c, cantidad_pago, tipo_pago, cod_user} = req.body;

    if(!cod_cliente || !nombre_c) {
        return res.status(400).send({
            error: true,
            message: 'provide actor first_name and last_name'
        })
    }
    if (cantidad_pago!=0) {
        console.log("MI PAGO:",cod_cliente, nombre_c, apellidos_c, cantidad_pago, tipo_pago);
        try {
            const sql = 'INSERT INTO `pagos`(`cod_cliente_p`, `nombre_c_p`, `apellidos_c_p`, `fecha_pago`, `tipo_de_pago`, `cantidad_pago`, `vista`, `cod_user`) VALUES (?,?,?,CURDATE(),?,?,2,?);';
            console.log('SQL:',sql)
            const result = await query(sql, [cod_cliente, nombre_c, apellidos_c, tipo_pago, cantidad_pago, cod_user])
            console.log('result insertClient: ',result)

            res.send({
                error: false,
                data: {cod_cliente},
                message: 'Client successfully added with id ' + result.insert_id
            })
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }

    
})

//OBTENER COMPRAS DEL TACO
app.get('/api/v1/compras/:cod_user', async(req, res) => {
    const { cod_user} = req.params;
    try {
        console.log("SERVER"+cod_user)
        const sql = "SELECT * FROM `comprasb` WHERE comprasb.cod_user= ? ORDER BY codCom DESC";
        const result = await query(sql, [cod_user]);
        let message = '';
        if(result === undefined || result.length === 0) {
            message = 'Actores table is empty';
        }else{
            message = 'Successfully retrieved all actors';
        }

        res.send({ 
            error: false,
            data: result,
            message: message
        })
    } catch (error) {
        console.log(error);
        res.resStatus(500);
    }
})

//OBTENER COMPRAS DE LA SEMANA
app.get('/api/v1/comprasWeek/:cod_user', async(req, res) => {
    const { cod_user} = req.params;
    try {
        console.log("SERVER"+cod_user)
        const sql = "SELECT SUM(total) as total FROM `comprasb` WHERE comprasb.cod_user= ? AND vista = 2 ORDER BY codCom DESC";
        const result = await query(sql, [cod_user]);
        let message = '';
        if(result === undefined || result.length === 0) {
            message = 'Actores table is empty';
        }else{
            message = 'Successfully retrieved all actors';
        }

        res.send({ 
            error: false,
            data: result,
            message: message
        })
    } catch (error) {
        console.log(error);
        res.resStatus(500);
    }
})

//OBTENER PAGOS DE LA SEMANA
app.get('/api/v1/pagosWeek/:cod_user', async(req, res) => {
    const { cod_user} = req.params;
    try {
        console.log("SERVER"+cod_user)
        const sql = "SELECT SUM(cantidad_pago) as total FROM `pagos` WHERE pagos.cod_user= ? AND vista = 2 ORDER BY cod_pago DESC";
        const result = await query(sql, [cod_user]);
        let message = '';
        if(result === undefined || result.length === 0) {
            message = 'Actores table is empty';
        }else{
            message = 'Successfully retrieved all actors';
        }

        res.send({ 
            error: false,
            data: result,
            message: message
        })
    } catch (error) {
        console.log(error);
        res.resStatus(500);
    }
})

//UPDATE VISTA PAGOS, HACER RESET
app.get('/api/v1/resetPays/:cod_user', async(req, res) => {
    const { cod_user} = req.params;
    try {
        console.log("SERVER"+cod_user)
        const sql = "UPDATE `pagos` SET `vista`='3' WHERE cod_user = ?";
        const result = await query(sql, [cod_user]);
        let message = '';
        if(result === undefined || result.length === 0) {
            message = 'Actores table is empty';
        }else{
            message = 'Successfully retrieved all actors';
        }

        res.send({ 
            error: false,
            data: result,
            message: message
        })
    } catch (error) {
        console.log(error);
        res.resStatus(500);
    }
})

//UPDATE VISTA COMPRAS, HACER RESET
app.get('/api/v1/resetBuys/:cod_user', async(req, res) => {
    const { cod_user} = req.params;
    try {
        console.log("SERVER"+cod_user)
        const sql = "UPDATE `comprasb` SET `vista`='3' WHERE cod_user = ?";
        const result = await query(sql, [cod_user]);
        let message = '';
        if(result === undefined || result.length === 0) {
            message = 'Actores table is empty';
        }else{
            message = 'Successfully retrieved all actors';
        }

        res.send({ 
            error: false,
            data: result,
            message: message
        })
    } catch (error) {
        console.log(error);
        res.resStatus(500);
    }
})

app.post('/api/v1/compra/', async(req, res) => {
    console.log("BODY DE PAGO",req.body);
    var { codArt, codCli, nombreCli, apellidosCli, nombreArt, precio, cantidad, subtotal, total, cod_user} = req.body;


        console.log("MI COMPRA:",req.body);
        try {
            const sql = 'INSERT INTO `comprasb`(`codArt`, `codCli`, `nombreCli`, `apellidosCli`, `nombreArt`, `precio`, `cantidad`, `subtotal`, `total`, `fechaCom`, `vista`, `cod_user`) VALUES (?,?,?,?,?,?,?,?,?,CURDATE(),2,?)';
            console.log('SQL:',sql)
            const result = await query(sql, [codArt, codCli, nombreCli, apellidosCli, nombreArt, precio, cantidad, subtotal, total, cod_user])
            console.log('result insertClient: ',result)

            res.send({
                error: false,
                data: {total},
                message: 'Client successfully added with id ' + result.insert_id
            })
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }

    
})

//Delete client by id
app.delete('/api/v1/pay/:cod_pago/:cod_user', async(req, res) => {
    const { cod_pago, cod_user} = req.params;

    if(!cod_pago){
        res.status(400).send({ 
            error: true,
            message: 'provide pay id',

        })
    }
    try {
        const sql = "DELETE FROM pagos WHERE cod_pago = ? AND cod_user = ?";
        const result = await query(sql, [cod_pago, cod_user]);
        let message = '';
        
        if(result.affectedRows === 0) {
            message = 'Pay is not found';
        }else{
            message = 'Pay successfully delete';
        }

        res.send({
            error: false,
            data: {affectedRows: result.affectedRows},
            message: message
        })
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

//Delete client by id
app.delete('/api/v1/buy/:cod_compra/:cod_user', async(req, res) => {
    const { cod_compra, cod_user} = req.params;

    if(!cod_compra){
        res.status(400).send({ 
            error: true,
            message: 'provide buy id',

        })
    }
    try {
        const sql = "DELETE FROM comprasb WHERE codCom = ? AND cod_user = ?";
        const result = await query(sql, [cod_compra, cod_user]);
        let message = '';
        
        if(result.affectedRows === 0) {
            message = 'Buy is not found';
        }else{
            message = 'Buy successfully delete';
        }

        res.send({
            error: false,
            data: {affectedRows: result.affectedRows},
            message: message
        })
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})
module.exports = { runServer, stopServer };