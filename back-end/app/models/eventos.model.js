const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const EventosSchema = mongoose.Schema(
  {
    Nombre: {
      type: String,
    },
    Fecha: Date,
    Hora: {
      type: String,
    },
    Imagen: String,

    NombreLugar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      autopopulate: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
)

EventosSchema.virtual('Zonas', {
  ref: 'Zonas',
  localField: '_id',
  foreignField: 'NombreEvento',
  justOne: false,
  type: '',
})

EventosSchema.plugin(mongoosePaginate)
EventosSchema.index({
  Nombre: 'text',
  Fecha: 'text',
  Hora: 'text',
  Imagen: 'text',
  NombreLugar: 'text',
})

const myModel = (module.exports = mongoose.model('Eventos', EventosSchema, 'eventos'))
myModel.schema = EventosSchema
