
/*
   date javascript
*/


const currentYear = document.querySelector("#currentYear");
const lastModified = document.querySelector("#lastModified");



/*
   gets the current year dynamically
*/

const today = new Date();

currentYear.textContent = today.getFullYear();



/*
   gets the last modification date of the document
*/
lastModified.textContent = `last modified: ${document.lastModified}`;
