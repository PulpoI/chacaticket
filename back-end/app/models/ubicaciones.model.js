const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const UbicacionesSchema = mongoose.Schema(
  {
    Nombre: {
      type: String,
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

UbicacionesSchema.plugin(mongoosePaginate)
UbicacionesSchema.index({
  Nombre: 'text',
  NombreZona: 'text',
})

const myModel = (module.exports = mongoose.model('Ubicaciones', UbicacionesSchema, 'ubicaciones'))
myModel.schema = UbicacionesSchema
