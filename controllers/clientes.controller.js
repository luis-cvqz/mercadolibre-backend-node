const { usuario, rol} = require('../models')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

let self = {}

// POST: api/clientes
self.create = async function (req, res, next) {
    try {

       if (req.body.password !== req.body.confirmPassword) {
            return res.status(400).json({
                error: "La contraseña y la confirmación de la contraseña no coinciden."
            });
        }

        const rolusuario = await rol.findOne({ where: { nombre: req.body.rol } })


        const data = await usuario.create({
            id: crypto.randomUUID(),
            email: req.body.email,
            passwordhash: await bcrypt.hash(req.body.password, 10),
            nombre: req.body.nombre,
            rolid: rolusuario.id
        })
        
        // Bitacora
        req.bitacora("usuarios.crear", data.email)
        res.status(201).json({
            id: data.id,
            email: data.email,
            nombre: data.nombre,
            rolid: rolusuario.nombre
        })
    } catch (error) {
        next(error)
    }
}


module.exports = self