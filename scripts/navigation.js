
/*
   navigation javascript
   controls the mobile menu button*/


let menuButton = document.querySelector("#menuButton");
let navigation = document.querySelector("#navigation");


/*
   opens and closes the navigation menu
   when the hamburger button is clicked
*/
menuButton.addEventListener("click", () => {

    navigation.classList.toggle("open");

});
