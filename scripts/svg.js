// Handle the creation of svgs for use in HTML

// https://developer.mozilla.org/en-US/docs/Web/SVG/Guides/Scripting
function getSvg(width, height) {
  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttributeNS(null, "width", width);
  svg.setAttributeNS(null, "height", height);
  return svg;
}

function getRect(colour, width, height) {
  let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttributeNS(null, "x", "5");
  rect.setAttributeNS(null, "y", "5");
  rect.setAttributeNS(null, "width", width);
  rect.setAttributeNS(null, "height", height);
  rect.setAttributeNS(null, "stroke", colour);
  rect.setAttributeNS(null, "stroke-width", "5px");
  rect.setAttributeNS(null, "rx", "10px");
  rect.setAttributeNS(null, "ry", "10px");
  rect.setAttributeNS(null, "stroke-linejoin", "round");
  rect.setAttributeNS(null, "fill-opacity", "0.5");
  rect.setAttributeNS(null, "fill", colour);
  return rect;
}

function getText(x, text) {
  const textNS = document.createElementNS("http://www.w3.org/2000/svg", "text");
  textNS.setAttributeNS(null, "x", x);
  textNS.setAttributeNS(null, "y", "35");
  textNS.setAttributeNS(null, "fill", "white");
  textNS.textContent = text;
  return textNS;
}

export function displayCard(country, distance, colour) {
  const countryCardWidth = 270;
  const countryCardHeight = 50;
  const padding = 10;
  let svg = getSvg(countryCardWidth + padding, countryCardHeight + padding);
  const guessesContainer = "guesses";
  let node = document.getElementById(guessesContainer);
  node.appendChild(svg);

  let r = getRect(colour, countryCardWidth, countryCardHeight);
  svg.appendChild(r);

  const textCoordinateX = "30";
  const textCoordinateY = "180";
  let t1 = getText(textCoordinateX, country);
  svg.appendChild(t1);
  let t2 = getText(textCoordinateY, distance);
  svg.appendChild(t2);
}
