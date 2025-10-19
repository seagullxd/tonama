
// https://developer.mozilla.org/en-US/docs/Web/SVG/Guides/Scripting
function getSvg() {
  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttributeNS(null, "width", "280");
  svg.setAttributeNS(null, "height", "60");
  return svg 
}


function getRect(colour) {
  this.rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  this.rect.setAttributeNS(null, "x", "5");
  this.rect.setAttributeNS(null, "y", "5");
  this.rect.setAttributeNS(null, "width", "270");
  this.rect.setAttributeNS(null, "height", "50");
  this.rect.setAttributeNS(null, "stroke", colour);
  this.rect.setAttributeNS(null, "stroke-width", "5px");
  this.rect.setAttributeNS(null, "rx", "10px");
  this.rect.setAttributeNS(null, "ry", "10px");
  this.rect.setAttributeNS(null, "stroke-linejoin", "round");
  this.rect.setAttributeNS(null, "fill-opacity", "0.5");
  this.rect.setAttributeNS(null, "fill", colour);

  return rect 
}

function getText(x, text) {
  const textNS = document.createElementNS("http://www.w3.org/2000/svg", "text");
  textNS.setAttributeNS(null, "x", x);
  textNS.setAttributeNS(null, "y", "35");
  textNS.setAttributeNS(null, "fill", "white");
  textNS.textContent = text;

  return textNS
}

function addCard(country, distance, colour) {
  const textCoordinateX = "30"; 
  const textCoordinateY = "180"; 
  const guessesContainer = "guesses"

  let svg = getSvg();
  let node = document.getElementById(guessesContainer);
  node.appendChild(svg)
  let r = getRect(colour);
  svg.appendChild(r);
  let t1 = getText(textCoordinateX, country);
  svg.appendChild(t1);
  let t2 = getText(textCoordinateY, distance);
  svg.appendChild(t2);
}



function main() {
  const countryColours = {
    England: '#003049',
    France: '#D62828',
    Ireland: '#00A878',
    Germany: '#FFB400',
    Scotland: '#00A6ED',
  };

  let guess = {}
  const formElem = document.querySelector("form");
  formElem.addEventListener("submit", (e) => {
    // on form submission, prevent default
    e.preventDefault();

    // construct a FormData object, which fires the formdata event
    new FormData(formElem);
  });

  formElem.addEventListener("formdata", (e) => {
    console.log("formdata fired");

    // Get the form data from the event object
    const data = e.formData;
    for (const value of data.values()) {
      guess = value 
    }
    console.log(guess)
    console.log(countryColours[guess])
    addCard(guess, "500km", countryColours[guess])
  });

  addCard("England", "500km", countryColours.England)
  addCard("France", "1000km", countryColours.France)
  addCard("Ireland", "1500km", countryColours.Ireland)
  addCard("Germany", "2000km", countryColours.Germany)
  addCard("Scotland", "2500km", countryColours.Scotland)
}




main()

