
/*
   date javascript
*/


let currentYear = document.querySelector("#currentYear");

let lastModified = document.querySelector("#lastModified");



/*
   gets the current year dynamically
*/
let today = new Date();

currentYear.textContent = today.getFullYear();



/*
   gets the last modification date of the document
*/
lastModified.textContent = `last modified: ${document.lastModified}`;
