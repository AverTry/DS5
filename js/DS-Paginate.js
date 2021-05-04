// Make the console less boring...
console.log('%c DataSafe 5 ', 'padding-bottom: 20px; font-weight: bold; font-size: 50px;color: red; text-shadow: 3px 3px 0 rgb(217,31,38) , 6px 6px 0 rgb(226,91,14) , 9px 9px 0 rgb(245,221,8) , 12px 12px 0 rgb(5,148,68) , 15px 15px 0 rgb(2,135,206) , 18px 18px 0 rgb(4,77,145) , 21px 21px 0 rgb(42,21,113)');
const log = (l, m = ' Null', c1 = 'DeepSkyBlue', c2 = 'Orange') => console.log('%c'+l+'%c'+m,'color:'+c1,'color:'+c2)
log(new Date().toISOString().split('T')[0], ' ' +  new Date().toISOString().split('T')[1].slice(0, 8))
const warn = message => console.log('%c' + message, warnStyles)
var warnStyles = [
  'background: linear-gradient(#D33106, #571402)', 
  'border: 1px solid #3E0E02', 
  'color: white', 
  'display: block', 
  'text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3)', 
  'box-shadow: 0 1px 0 rgba(255, 255, 255, 0.4) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset', 
  'padding: 10px', 
  'text-align: center', 
  'font-size: 22px',
  'font-weight: bold'
].join(';')

// SORTING GROUP -------------------------------------------------------------------

// Event Listeners to Call the Functions
let sortToggle = false
const sortByKey = document.getElementById("sortBy")
const sortChevron = document.getElementById("sortChevron")

sortByKey.addEventListener('change', () => runQuery())
sortChevron.addEventListener('click', () => glyphToggle())

// Toggle Sort Ascending or Descending Function
const getSortOrder = () => {
  let Value = sortToggle === true ?
    `{ "${ sortByKey.options[sortByKey.selectedIndex].text }" : -1 }` :
    `{ "${ sortByKey.options[sortByKey.selectedIndex].text }" : 1 }`
  return Value
}

// Toggle the Sort Glyph up & down
const glyphToggle = () => {
  sortToggle = !sortToggle
  sortChevron.classList.toggle("down")
  runQuery()
}

// SEARCHING GROUP -------------------------------------------------------------------

const searchText = document.getElementById('Search')
const searchBtn = document.getElementById('searchBtn')
const searchByBox = document.getElementById('searchByBox')
const searchByKey = document.getElementById('srcField')
const dateChoice = document.querySelector(".dateChoice");
const radioRange = document.getElementById('radioRange')
const advDrop = document.getElementById('advDrop')
const searchLabelType = document.getElementById('searchLabelType')
const searchTypeInfo = document.querySelectorAll('.searchTypeInfo')
const searchTypeLabel = (info, field = getSearchField) => searchTypeInfo.forEach(e => e.innerHTML = `Searching ( ${field} ) By [ ${info} ]`)
let getSearchField = 'Choose...'
let declareType = 'Text', wasText = ''
let radioOptionIs = radioRange

searchLabelType.addEventListener("click", () => {advDrop.click()})
searchBtn.addEventListener("click", () => query())

// Clears Text SearchBar to return all Documents
let handler = () => {if (searchText.value === '') {firstQuery = ''; runQuery(); return} 
if (event.key === 'Enter') {event.preventDefault(); query();}}
  ['search', 'keyup'].forEach(event => searchText.addEventListener(event, handler))

// Event Search Field Switch
searchByBox.addEventListener('change', () => {
  if (searchByBox.checked) { // only evaluates between date and text - needs DocID
    wasText = searchText.value; searchText.value = '' // remember previous value
    searchByKey.disabled = false // By Field Enabled
    searchLabelType.style.display = 'flex' // Show bottom Lable
    setFieldType() // check what field is
  } else {
    if (wasText !== '') searchText.value = wasText // restore pevious value
    searchLabelType.style.display = 'none' // Hide bottom Lable
    searchByKey.disabled = true // By Field Disabled
    showTextBar() // show text bar
    searchTypeLabel('Text - Space Separated', 'ALL'); declareType = 'Text'
  }
})

// Event Search Field Change - get field name
searchByKey.addEventListener('change', () => {  
  getSearchField = searchByKey.options[searchByKey.selectedIndex].text
  if (getSearchField === 'Choose...') return searchByBox.click()
  setFieldType()
})

// Determine what field got selected?
const setFieldType = () => {
  if (getSearchField === 'Choose...') return
  if (getSearchField === 'DocumentID') {
    showTextBar(); searchTypeLabel('Digit\'s: eg. 100 8 32 558'); declareType = 'DocID'; return
  }
  let thisField = document.querySelector(`#${getSearchField}`)
  if (thisField.type === 'date' || thisField.type === 'datetime-local') {
    dateChoice.style.display = "flex"
    if (radioOptionIs.checked) radioOptionIs.checked = false; radioOptionIs.click() // to trigger the searchBox changes
    return
  }
  showTextBar(); searchTypeLabel('Text - Partials Allowed'); declareType = 'Text'
}

const showTextBar = () => {
  dateChoice.style.display = "none"
  searchText.style.display = 'flex'     
  searchRange.style.display = 'none'     
  searchOptions.style.display = 'none' 
}

document.addEventListener('input',(e)=>{ 
if (e.target.getAttribute('name') !== "radioDateSelect") return
  declareType = e.target.value
  switch (declareType) {
    case 'Range':
      searchText.style.display = 'none'     
      searchRange.style.display = 'flex'     
      searchOptions.style.display = 'none'     
      radioOptionIs = radioRange
      break;
    case 'Year':
      searchText.style.display = 'none'     
      searchRange.style.display = 'none'     
      searchOptions.style.display = 'flex'     
      searchYear.style.display = 'flex'     
      searchMonth.style.display = 'none'     
      searchWeek.style.display = 'none'     
      searchDay.style.display = 'none'
      radioOptionIs = radioYear
      break;
    case 'Month':
      searchText.style.display = 'none'     
      searchRange.style.display = 'none'     
      searchOptions.style.display = 'flex'     
      searchYear.style.display = 'flex'     
      searchMonth.style.display = 'flex'     
      searchWeek.style.display = 'none'     
      searchDay.style.display = 'none'
      radioOptionIs = radioMonth
      break;
    case 'Week':
      searchText.style.display = 'none'     
      searchRange.style.display = 'none'     
      searchOptions.style.display = 'flex'     
      searchYear.style.display = 'flex'     
      searchMonth.style.display = 'none'     
      searchWeek.style.display = 'flex'     
      searchDay.style.display = 'none'
      radioOptionIs = radioWeek
      break;
    case 'Day':
      searchText.style.display = 'none'     
      searchOptions.style.display = 'flex'     
      searchRange.style.display = 'none'     
      searchYear.style.display = 'flex'     
      searchMonth.style.display = 'flex'     
      searchWeek.style.display = 'none'     
      searchDay.style.display = 'flex'        
      radioOptionIs = radioDay
      break;
  }
  searchTypeLabel(`Date-${declareType}`)
})

// ONLOAD GROUP ---------------------------------------------------------------------

// Stop Dropdown from closing on click [Using Form prevents ALL clicks - No Good!]
const myDropdown = document.getElementById('myInp')
myDropdown.addEventListener('hide.bs.dropdown', (e) => {if (e.clickEvent) e.preventDefault()})

// Populate the Date Search Select Inputs

const fromDate = document.getElementById('fromDate');
fromDate.addEventListener('change', () => console.log(fromDate.value))
const toDate = document.getElementById('toDate');
toDate.addEventListener('change', () => console.log(toDate.value))
const dayfield = document.getElementById('searchDay')
const weekfield = document.getElementById('searchWeek')
const monthfield = document.getElementById('searchMonth')
const yearfield = document.getElementById('searchYear')
const today = new Date()
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const getWeek = () => {
  let now = new Date(), yearBegin = new Date(now.getFullYear(), 0)
  return Math.ceil((((now.setHours(0,0,0,0) - yearBegin) / 86400000)-1)/7)
}

let numOfDays = 0
const updateDays = (value = monthfield.selectedIndex) => {
  if ([3,5,8,10].includes(value)) numOfDays = 30
  else if ([0,2,4,6,7,9,11].includes(value)) numOfDays = 31 
  else numOfDays = 28
};updateDays(months[today.getMonth()])

monthfield.addEventListener('change', () => {
  updateDays(monthfield.selectedIndex)
  while (dayfield.options.length > 0) dayfield.remove(0)
  for ( let d = 1; d <= numOfDays; d++ ) dayfield.appendChild(new Option(d, d))
  dayfield.value = today.getDate()
})

dateBoxesPopulate = () => {
  toDate.valueAsDate = new Date()
  fromDate.valueAsDate = new Date(today.getFullYear() + "-" + today.getMonth() + "-" + today.getDate()) // Defaults to One Month Earliar
  
  while (yearfield.options.length > 0) yearfield.remove(0)
  for ( let y = 2000; y <= 2050; y++ ) yearfield.appendChild(new Option(y, y))
  yearfield.value = today.getFullYear()

  while (monthfield.options.length > 0) monthfield.remove(0)
  for ( let m = 0; m < 12; m++ ) monthfield.appendChild(new Option(months[m], months[m]))
  monthfield.value = months[today.getMonth()]

  while (weekfield.options.length > 0) weekfield.remove(0)
  for ( let w = 0; w <= 53; w++ ) weekfield.appendChild(new Option(w, w)) // Week One Starts On The First Sunday.
  weekfield.value = getWeek()

  while (dayfield.options.length > 0) dayfield.remove(0)
  for ( let d = 1; d <= numOfDays; d++ ) dayfield.appendChild(new Option(d, d))
  dayfield.value = today.getDate()
};dateBoxesPopulate()

// Populate the Search and Sort Select Inputs
const loadFormElements = (selBox, selClass) => {
  const elements = document.querySelectorAll(selClass)
  let all = [];
  elements.forEach((element) => all.push(element.id))
  for (index in all) selBox[selBox.options.length] = new Option(all[index], index)
}
loadFormElements(sortByKey, '.sortKey');
loadFormElements(searchByKey, '.searchKey')

// PAGING GROUP -------------------------------------------------------------------

// Main ServerSide Pagination
const formElement = document.getElementById('my-form')
const pageInfoBox = document.getElementById('pageInfoBox')
const first = document.getElementById('first')
const prev = document.getElementById('prev')
const next = document.getElementById('next')
const last = document.getElementById('last')

// Search For
let Seek = false
let srcFieldKey
const query = () => {
  Seek = false
  if (searchByBox.checked) {
    srcFieldKey = searchByKey.options[searchByKey.selectedIndex].text
    if (srcFieldKey === "Choose..." ) return
    if(dateChoice.style.display === "none" && searchText.value === '') return
    Seek = true
  } else {
    if (searchText.value === '') return
    firstQuery = searchText.value
  }
  runQuery()
}

let currentPage = 0, prevPage = 0, nextPage = 0, total = 0
let firstQuery = '', sortValue = JSON.stringify({ DocumentID : 1 })
let Case = false, onTag = false, byTag = true, Not = false // integrate to HTML & script in
const Params = () =>  {
  let result = 'Search'
  switch (declareType) {
    case "Range": result = [fromDate.value, toDate.value]; break
    case "Year": result = [yearfield.value]; break
    case "Month": result = [yearfield.value, monthfield.selectedIndex + 1]; break
    case "Week": result = [yearfield.value, weekfield.value]; break
    case "Day": result = [yearfield.value, monthfield.selectedIndex + 1, dayfield.value]; break      
    case "Text": result = searchText.value; break
    case "DocID": result = searchText.value; break
    default: result = searchText.value; break
  } 
  
  // console.log('%cdeclareType: ' + '%c' + declareType, 'color: deepskyblue', 'color: palegreen')
  // console.log('%cresult: ' + '%c' + result, 'color: dodgerblue', 'color: DarkOrange')
  // log('srcFieldKey: ', srcFieldKey)
  // log('declareType: ', declareType, 'Coral', 'Aqua')

  if (result === 'undefined' || result === 'null' || result === '') {query()}
  return JSON.stringify({
      Seek: { On: Seek, Case: Case },
      Field: srcFieldKey,
      Criteria: result,
      Tags: { On: onTag, By: byTag },
      Not: Not,
      SearchType: declareType
    })
}

// console.log(Params())
runQuery = (pageNo = 1) => {
  // return log('Params',Params())
  sortValue = getSortOrder()  
  let find = `alltxt=${firstQuery}&params=${Params()}&sort=${sortValue}&page=${pageNo}`
  let query = `http://localhost:3000/clients?${find}`
  fetch(query)
  .then(response => {
    if ( response.status === 204) {
      pageInfoBox.value = 'No Documents'
      throw ('No Documents Found..?')
    }
    return response.json()
  })
  .then(data => {
    populate(formElement, data.docs[0].documents[0])
    prevPage = data.prev.page
    nextPage = data.next.page
    currentPage = data.currentPage.page
    totalPages = data.docs[0].totalDocs[0].count
    pageInfoBox.value = `Page ${currentPage} of ${totalPages}`
  })
  .catch(err => warn(err))
};runQuery()
first.addEventListener('click', () => runQuery())
next.addEventListener('click', () => runQuery(nextPage))
prev.addEventListener('click', () => runQuery(prevPage))
last.addEventListener('click', () => runQuery(totalPages))

// For List Module-------------------------------------------------------------------------------------

// List ClientSide Pagenation
let myModalEl = document.getElementById('list')
myModalEl.addEventListener('show.bs.modal', (event) => {
  console.time('1000 Records Fetch')
  fetch('http://localhost:3000/clients?limit=20')
  .then(response => response.json())
  .then(data => {
    if (!data.docs[0].documents.length) return
        // console.log('Object.keys', Object.keys(data.docs[0].documents[0]))
        // console.log('Object.values', Object.values(data.docs[0].documents[0]))

// replace with Tabulator

    new simpleDatatables.DataTable(".table", {
      data: {
        headings: Object.keys(data.docs[0].documents[0]),
        data: data.docs[0].documents.map(item => Object.values(item))
      },
    })
  })
  .then(() => console.timeEnd('1000 Records Fetch'))
  .catch(err => console.error(err))
})  
