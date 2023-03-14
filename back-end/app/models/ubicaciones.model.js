const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const UbicacionesSchema = mongoose.Schema(
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

UbicacionesSchema.virtual('Tickets', {
  ref: 'Tickets',
  localField: '_id',
  foreignField: 'NombreUbicacion',
  justOne: true,
  type: '',
})

UbicacionesSchema.plugin(mongoosePaginate)
UbicacionesSchema.index({
  Ubicacion: 'text',
  NombreZona: 'text',
})

const myModel = (module.exports = mongoose.model('Ubicaciones', UbicacionesSchema, 'ubicaciones'))
myModel.schema = UbicacionesSchema
