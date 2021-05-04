const mongoose = require('mongoose')
const Schema = mongoose.Schema;
autoIncrement = require('./counter');
var connection = mongoose.createConnection(process.env.DB_Connect_Local, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
autoIncrement.initialize(connection);

const tagSchema = new Schema({
  _id: Number,
  User1: Boolean,
  User2: Boolean,
  User3: Boolean,
  User4: Boolean,
  User5: Boolean
})

const clientSchema = new Schema({
  DocumentID: {type: Number, required: true, unique: true, ref: 'DocumentID'},
  Status: {type: String, required: true, default: 'Choose...'},
  // AccountCreated: {type: Date, required: true, default: Date.now},
  // LastUpdated: {type: Date, required: true, default: Date.now},
  Company: {type: String, default: ''},
  Prefix: {type: String, required: true, default: 'Choose...'},
  FirstName: {type: String, required: false, trim: true, default: ''},
  LastName: {type: String, required: false, trim: true, default: ''},
  HouseNo: {type: String, required: false, trim: true, default: ''},
  Street: {type: String, required: false, trim: true, default: ''},
  City: {type: String, required: false, trim: true, default: ''},
  County: {type: String, required: false, trim: true, default: ''},
  PostCode: {type: String, required: false, trim: true, default: ''},
  Country: {type: String, required: false, trim: true, default: ''},
  BusinessLine: {type: String, default: ''},
  HomePhone: {type: String, default: ''},
  MobilePhone: {type: String, default: ''},
  Email: {type: String, default: ''},
  WebSite: {type: String, default: ''},
  FaceBook: {type: String, default: ''},
  Tag : { type: Boolean, default: true },
  LastMeeting: {type: Date, default: ''},
  NextMeeting: {type: Date, default: ''},
  Comments: {type: String, default: ''}
  },{
  timestamps: { createdAt: 'CreatedOn', updatedAt: 'EditedOn' }, 
  versionKey: false 
})

// AutoIncrement via DocumentID, leave _id as Object
clientSchema.plugin(autoIncrement.plugin, {
    model: 'Client',
    field: 'DocumentID',
    startAt: 1,
    incrementBy: 1
});

// MongoDB Document Name is Set In The Mongoose Model, Not Var.
const Client = mongoose.model('clients', clientSchema)
const Tag = mongoose.model('taggel', tagSchema)
module.exports = {Client, Tag}
