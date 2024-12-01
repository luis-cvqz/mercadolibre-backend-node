const { pedido, producto, usuario, Sequelize } = require('../models');
const { body, validationResult } = require('express-validator');
const Op = Sequelize.Op;

let self = {}

self.pedidoValidator = [
  body('usuarioid', 'El campo {0} es obligatorio').not().isEmpty().isLength({ min: 36, max: 36 }),
  body('productoid', 'El campo {0} es obligatorio').not().isEmpty().isNumeric(),
]

//GET: api/pedidos
self.getAll = async function (req, res, next) {
  try {
    let data = await pedido.findAll({
      attributes: [['id', 'pedidoId'], 'usuarioid', 'productoid', 'fecha'],
      include: [
        {
          model: usuario,
          as: 'usuario',
          attributes: [['id', 'usuarioid'], 'nombre', 'email']
        },
        {
          model: producto,
          as: 'producto',
          attributes: [['id', 'productoid'], 'titulo', 'descripcion', 'precio']
        }
      ]
    })
    return res.status(200).json(data)
  } catch (error) {
    next(error)
  }
}

self.create = async function (req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json(errors)
      return
    }

    let usuarioEncontrado = await usuario.findByPk(req.body.usuarioid)
    if (!usuarioEncontrado) 
      return res.status(404).send('Usuario no encontrado')
    
    let productoEncontrado = await producto.findByPk(req.body.productoid)
    if (!productoEncontrado)
      return res.status(404).send('Producto no encontrado')
      
    let data = await pedido.create({
      usuarioid: req.body.usuarioid,
      productoid: req.body.productoid,
      fecha: new Date()
    })

    req.bitacora("Pedido.crear", data.id)
    res.status(201).json(data)
  } catch (error) {
    next(error)
  }
}

module.exports = self