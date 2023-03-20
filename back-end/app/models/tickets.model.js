const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const TicketsSchema = mongoose.Schema(
  {
    NombreUbicacion: {
      type: String,
    },

    NombreZona: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Zonas',
      autopopulate: true,
    },
    NombrePersona: {
      type: String,
    },
    EmailPersona: {
      type: String,
    },
    FechaPago: Date,
    Usado: Boolean,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
)

TicketsSchema.plugin(mongoosePaginate)
TicketsSchema.index({
  NombreUbicacion: 'text',
  NombreZona: 'text',
  NombrePersona: 'text',
  EmailPersona: 'text',
  FechaPago: 'text',
  Usado: 'text',
})

const myModel = (module.exports = mongoose.model('Tickets', TicketsSchema, 'tickets'))
myModel.schema = TicketsSchema
