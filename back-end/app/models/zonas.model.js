const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const ZonasSchema = mongoose.Schema(
  {
    Nombre: {
      type: String,
    },
    Precio: Number,

    NombreEvento: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Eventos',
      autopopulate: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
)

ZonasSchema.virtual('Ubicaciones', {
  ref: 'Ubicaciones',
  localField: '_id',
  foreignField: 'NombreZona',
  justOne: false,
  type: '',
})

ZonasSchema.plugin(mongoosePaginate)
ZonasSchema.index({
  Nombre: 'text',
  Precio: 'text',
  NombreEvento: 'text',
})

const myModel = (module.exports = mongoose.model('Zonas', ZonasSchema, 'zonas'))
myModel.schema = ZonasSchema
