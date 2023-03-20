const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const UsersSchema = mongoose.Schema(
  {
    FirstName: {
      type: String,
    },
    LastName: {
      type: String,
    },
    Email: {
      type: String,
    },
    Password: {
      type: String,
    },
    ProfilePic: String,
    Role: String,
    Lugar: {
      type: String,
    },
    DireccionLugar: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
)

UsersSchema.virtual('Eventos', {
  ref: 'Eventos',
  localField: '_id',
  foreignField: 'NombreLugar',
  justOne: false,
  type: '',
})

UsersSchema.plugin(mongoosePaginate)
UsersSchema.index({
  FirstName: 'text',
  LastName: 'text',
  Email: 'text',
  Password: 'text',
  ProfilePic: 'text',
  Role: 'text',
  Lugar: 'text',
  DireccionLugar: 'text',
})

const myModel = (module.exports = mongoose.model('Users', UsersSchema, 'users'))
myModel.schema = UsersSchema
