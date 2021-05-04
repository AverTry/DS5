// // THEME GROUP ------------------------------------------------------------

// // HSL Color Slider - Changes HUE
// document.getElementById('hsl-H').addEventListener('change', () => {
//   let hsl = document.getElementById('hsl-H').value
//   document.getElementById('hslNo-H').value = hsl
//   document.documentElement.style.setProperty('--color-base-hue', hsl)
// })

// // HSL Color Slider - Changes SATURATION
// document.getElementById('hsl-S').addEventListener('change', function() {
//   let hsl = document.getElementById('hsl-S').value
//   document.getElementById('hslNo-S').value = hsl
//   document.documentElement.style.setProperty('--color-base-sat', hsl + '%')
// })

// EDITING GROUP ------------------------------------------------------------

// Form-Edit Toggle The Form Elements DISABLED / ENABLED
let bDisabled = false
const bDisabledFormElements = () => {
  bDisabled = !bDisabled
  const el = document.querySelectorAll('.lockCtrl input, .lockCtrl textarea, .lockCtrl select, .lockCtrl btn')
  el.forEach((element) => element.disabled = bDisabled)
};bDisabledFormElements()

// search err
// const searchError = (inputCtrl) => {
//     const throwErr = setInterval(() => document.querySelector(inputCtrl).classList.toggle("is-invalid"), 500);
//     setTimeout(() => clearInterval(throwErr), 4000);
// };searchError('#Search')

// TAB CONTROL -----------------------------------------------------------------------

// var firstTabEl = document.querySelector('#myTab li:last-child a')
// var firstTab = new bootstrap.Tab(firstTabEl)
// firstTab.show()

// CSS CONTROL -----------------------------------------------------------------------

// if (document.body.classList.contains('thatClass')) {
//     // do some stuff
// }

// document.body.classList.add('thisClass');
// // $('body').addClass('thisClass');

// document.body.classList.remove('thatClass');
// // $('body').removeClass('thatClass');

// document.body.classList.toggle('anotherClass');
// // $('body').toggleClass('anotherClass');

// if (document.querySelector(".section-name").classList.contains("section-filter")) {
//   alert("Grid section");
//   // code...
// }


// ----------------------------------------------------------------------

// /* Wrote From memory a closure function */

// counter = 100

// add = (() => {
// 	let counter = 0
//     return () => {counter += 1; return counter}
// })()

// ----------------------------------------------------------------------

// apply

// var person = {
//   fullName: function() {
//     return this.firstName + " " + this.lastName;
//   }
// }
// var person1 = {
//   firstName: "Mary",
//   lastName: "Doe"
// }
// person.fullName.apply(person1);  // Will return "Mary Doe"

// -----------------------------save-----------------------------------------

// Stop Dropdown from closing on click [Using Form prevents ALL clicks - No Good!]
// var myDropdown = document.getElementById('myInp')
// myDropdown.addEventListener('hide.bs.dropdown', (e) => { if (e.clickEvent) {e.preventDefault()} }) // Stops dropdown closing on ALL clicks
// myDropdown.addEventListener('click', (e) => e.stopPropagation()) // Stops dropdown closing on internal clicks Only
