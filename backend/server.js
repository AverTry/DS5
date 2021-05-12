
require('dotenv').config()
const port = process.env.PORT || 3000
const express = require('express')
const mongoose = require('mongoose')
const {Client, Tag} = require('./models/client.model')
const cors = require('cors')
const app = express(); app.use(cors()); app.use(express.json()); app.use(express.urlencoded({ extended: true }))

const sourceConX = process.env.DB_Connect_AtlasNotSetup || process.env.DB_Connect_Local // For Atlas Public test Data (ReadOnly) || Or Localhost (Edit Testing)
mongoose.connect(sourceConX, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
mongoose.connection.once('open', async () => app.listen(port, () => console.log(`Server UP on Port: ${port}`)))

app.get('/clients', paginatedResults(Client), (req, res) => {
  res.json(res.paginatedResults)
})

app.get('/api', apiRes(Client), (req, res) => {
  res.json(res.apiRes)
})

function paginatedResults(model) {
  return async (req, res, next) => {
    let clientArray = []
    let byField = { $match: {} }
    let dates = false
    let sort = req.query.sort
    let byText = req.query.alltxt
    let page = parseInt(req.query.page) || 1
    const user = req.query.user || 'Users1'
    const limit = parseInt(req.query.limit) || 1
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const result = {}
    Boolean(sort) ? sort = JSON.parse( sort ) : sort = { DocumentID: 1 }
    Boolean(byText) ? byText = { $match: { $text: { $search: byText } } } : byText = { $match: {} }
    const joinTags = {'$lookup': {'from': 'Tag','localField': 'DocumentID','foreignField': '_id','as':'Tag'}}
    const addTags = {'$set': {'Tag' : { $arrayElemAt: [ '$Tag.' + user, 0 ] }}}
    const facet = { $facet: { totalDocs: [{ $count: 'count' }], documents: [{ $project: { _id: 0 }},{ $sort: sort },{ $skip: startIndex },{ $limit: limit }]}}
    const Defaults = JSON.stringify({ Seek: { On: false, Case: false }, Field: 'LastUpdated', Criteria: ['2020', '10', '25'], Tags: { On: false }, Not: false, SearchType: 'Day' })
    const params = req.query.params || Defaults    
    parseJSON(params) !== false ? Params = parseJSON(params) : Params = parseJSON(Defaults)
    let byTags = Params.Tags.On ? { $match: { Tag: Params.Tags.By } } : { $match: {} }
    const addDate = { $set: { DateSearchResult: { year: { $year: `$${Params.Field}` }, month: { $month: `$${Params.Field}` }, week: { $week: `$${Params.Field}` }, day: { $dayOfMonth: `$${Params.Field}` } } } }

    const Construct = () => {
      // console.log(Params)
      let results = {}, regArray = []
      if (!Params.Seek.On) return
      switch (Params.SearchType) {
        case "Range":
          let exclude = Params.Not ? '$or' : '$nor'
          results = 
          {
            [exclude]: 
            [
              { [Params.Field]: { '$lte': new Date(Params.Criteria[0]) } },
              { [Params.Field]: { '$gte': new Date(Params.Criteria[1]) } }
            ]
          }
          break;
        case "Year":
            results = {
              'DateSearchResult.year': parseInt(Params.Criteria[0]) 
            }
            dates = true
          break;
        case "Month":
            results = {
              'DateSearchResult.year': parseInt(Params.Criteria[0]),
              'DateSearchResult.month': parseInt(Params.Criteria[1]) 
            }
            dates = true
          break;
        case "Week":
            results = {
              'DateSearchResult.year': parseInt(Params.Criteria[0]), 
              'DateSearchResult.week': parseInt(Params.Criteria[1]) 
            }
            dates = true
          break;
        case "Day":
            results = {
              'DateSearchResult.year': parseInt(Params.Criteria[0]),
              'DateSearchResult.month': parseInt(Params.Criteria[1]),
              'DateSearchResult.day': parseInt(Params.Criteria[2]) 
            }
            dates = true
          break;      
        case "Text":
            let Case = Params.Seek.Case ? 'gm' : 'gmi'
            regArray = Params.Criteria.trim().split(' ').map((knit) => new RegExp(knit, Case))
            results = Params.Not ? { [Params.Field]: { '$not': { $in: regArray } } } : { [Params.Field]: { $in: regArray } }
          break;
        case "DocID":
            regArray = Params.Criteria.trim().split(' ').map((knit) => parseInt(knit))
            results = Params.Not ? { DocumentID: { '$not': { $in: regArray } } } : { DocumentID: { $in: regArray } }
          break;
          
        default:
            results = {}
          break;
      }
      byField = { $match: results }
    }; Construct()

    const addDates = bool => bool ? clientArray = 
      [byText,addDate,byField,joinTags,addTags,byTags,facet] : clientArray = 
      [byText,byField,joinTags,addTags,byTags,facet]
    addDates(dates)

// Paging
    try {
      result.docs = await model.aggregate(clientArray)
      if (result.docs[0].documents[0] === undefined) return res.status(204).send()
      res.paginatedResults = result
      let total = result.docs[0].totalDocs[0].count
      startIndex > 0 ? result.prev = { page: page - 1 } : result.prev = {page}
      result.currentPage = {page}
      endIndex < total ? result.next = { page: page + 1 } : result.next = {page}

      console.log(result);
      // console.log(result.docs[0].documents[0]);
      console.log('Total Documents',result.docs[0].totalDocs[0].count);

      next()
    } catch (e) {res.status(500).json({ message: e.message})}
  }
}

function apiRes(model) {
  return async (req, res, next) => {
    let sort = req.query.sort
    let byText = req.query.alltxt || {}
    let page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    let result = {}
    typeof sort === 'undefined' ? sort = { DocumentID: 1 } : sort = JSON.parse( sort )

    // Paging
    try {
      result = await model.find(byText).limit(limit).sort(sort)
      if (result === undefined) return res.status(204).send()
      res.apiRes = result
      let total = 1000
      startIndex > 0 ? result.prev = { page: page-- } : result.prev = {page}
      result.currentPage = {page}
      endIndex < total ? result.next = { page: page++ } : result.next = {page}

      console.log(result);

      next()
    } catch (e) {res.status(500).json({ message: e.message})}
  }
}

// Creating a new Document
app.post('/clients/create', async (req, res) => {
  const client = new Client({
    DocumentID: req.body.DocumentID,
    Status: req.body.Status,
    Company: req.body.Company,
    Prefix: req.body.Prefix,
    FirstName: req.body.FirstName,
    LastName: req.body.LastName,
    HouseNo: req.body.HouseNo,
    Street: req.body.Street,
    City: req.body.City,
    County: req.body.County,
    PostCode: req.body.PostCode,
    Country: req.body.Country,
    BusinessLine: req.body.BusinessLine,
    HomePhone: req.body.HomePhone,
    MobilePhone: req.body.MobilePhone,
    Email: req.body.Email,
    WebSite: req.body.WebSite,
    FaceBook: req.body.FaceBook,
    Tag: req.body.Tag,
    LastMeeting: req.body.LastMeeting,
    NextMeeting: req.body.NextMeeting,
    Comments: req.body.Comments
  })
  try {
    const newClient = await client.save()
    res.status(201).json(newClient)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

function parseJSON (jsonString){
  try {
    var ob = JSON.parse(jsonString);
    if (ob && typeof ob === "object") {
      return ob;
    }
  }
  catch (e) { }
  return false;
} 

