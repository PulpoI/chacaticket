const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const PreciosSchema = mongoose.Schema(
  {
    Precio: {
      type: String,
    },

    nombreZona: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Zonas',
      autopopulate: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
)

PreciosSchema.virtual('Asientos', {
  ref: 'Asientos',
  localField: '_id',
  foreignField: 'precio',
  justOne: false,
  type: '',
})

PreciosSchema.plugin(mongoosePaginate)
PreciosSchema.index({
  Precio: 'text',
  nombreZona: 'text',
})

const myModel = (module.exports = mongoose.model('Precios', PreciosSchema, 'precios'))
myModel.schema = PreciosSchema
