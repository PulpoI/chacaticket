const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const TicketsSchema = mongoose.Schema(
  {
    FechaPago: Date,
    NombrePersona: {
      type: String,
    },
    NombreUbicacion: mongoose.Schema.Types.ObjectId,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
)

TicketsSchema.plugin(mongoosePaginate)
TicketsSchema.index({
  FechaPago: 'text',
  NombrePersona: 'text',
  NombreUbicacion: 'text',
})

const myModel = (module.exports = mongoose.model('Tickets', TicketsSchema, 'tickets'))
myModel.schema = TicketsSchema
