const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const AsientosSchema = mongoose.Schema(
  {
    Ubicacion: {
      type: String,
      unique: true,
    },

    NombreZona: {
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

AsientosSchema.virtual('Tickets', {
  ref: 'Tickets',
  localField: '_id',
  foreignField: 'UbicacionAsiento',
  justOne: true,
  type: '',
})

AsientosSchema.plugin(mongoosePaginate)
AsientosSchema.index({
  Ubicacion: 'text',
  NombreZona: 'text',
})

const myModel = (module.exports = mongoose.model('Asientos', AsientosSchema, 'asientos'))
myModel.schema = AsientosSchema
