"use strict";

let counter = 0;
let ajaxObj;

(function displayLogo() {
  document.querySelector(".logo-overlay").classList.add("show-logo");

  setTimeout(() => {
    document.querySelector(".logo-overlay").classList.remove("show-logo");
  }, 2000);
})();

const xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    const myObj = JSON.parse(this.responseText);

    ajaxObj = myObj;

    const parent = document.getElementById("game-field");
    const coords = getTableOfCoords();
    document.querySelector(".controls__level").innerText = "Level 1";

    myObj[0].map.forEach((item, index) => {
      generateMap(item, index, parent, coords);
    })
    myObj[0].units.forEach((item) => {
      generateUnits(item, parent);
    })

  }
};
xmlhttp.open("GET", "src.json", true);
xmlhttp.send();


function reinit(ajaxObj) {
  document.querySelector(".controls__box").addEventListener("mouseup", checkWin);
  document.querySelector(".controls__box").addEventListener("touchend", checkWin);
  document.addEventListener("keyup", mouseClick);
  document.addEventListener("keyup", checkWin);

  const parent = document.getElementById("game-field");
  const coords = getTableOfCoords();
  document.querySelector(".controls__level").innerText = `Level ${counter + 1}`;


  ajaxObj[counter].map.forEach((item, index) => {
    generateMap(item, index, parent, coords);
  })
  ajaxObj[counter].units.forEach((item) => {
    generateUnits(item, parent);
  })
}

// Event Listeners
document.querySelector(".controls").addEventListener("mousedown", mouseClick);
document.querySelector(".controls").addEventListener("mousedown", mouseClick);
document.querySelector(".controls__box").addEventListener("mouseup", checkWin);
document.querySelector(".controls__box").addEventListener("touchend", checkWin);
document.addEventListener("keyup", mouseClick);
document.addEventListener("keyup", checkWin);

// Define what button or key was clicked
function mouseClick(e) {
  e.preventDefault();
  const [face, startPosition] = getStartPosition();

  switch (e.key) {
    case "ArrowUp":
      move(face, startPosition, "up");
      break;
    case "ArrowDown":
      move(face, startPosition, "down");
      break;
    case "ArrowLeft":
      move(face, startPosition, "left");
      break;
    case "ArrowRight":
      move(face, startPosition, "right");
      break;
  }

  if (e.target.classList.contains("btn")) {

    switch (e.target.id) {
      case "up":
        move(face, startPosition, "up");
        break;
      case "down":
        move(face, startPosition, "down");
        break;
      case "left":
        move(face, startPosition, "left");
        break;
      case "right":
        move(face, startPosition, "right");
        break;
      case "menu":
        slide();
        break;
      case "reload":
        const par = document.getElementById("game-field");
        while (par.firstChild) {
          par.removeChild(par.firstChild);
        }
        reinit(ajaxObj);
        break;
    }

    e.target.classList.add("pressed");
    setTimeout(() => {
      e.target.classList.remove("pressed");
    }, 200);
  }
}
// Defining a starting coordinates of player
function getStartPosition() {
  const face = document.querySelector("#game-field").lastElementChild;
  const gridArea = face.getAttribute("style");
  const result = gridArea.match(/\d/g); // has troubles when coordinate is like [10, 10], 10 is mutated with RegEx to 1,0
  const startPosition = result.map(item => {
    return parseInt(item);
  });
  return [face, startPosition];
}

// Rendering block
function getTableOfCoords() {
  // Generating coordinates of 100 cells [[1,1]...[10,1]...[10,2]...[4,6]...[10,10]]
  const table = [];
  let a = 1,
    b = 1;

  while (table.length < 100) {
    table.push([a, b]);
    a++;
    if (a > 10) {
      a = 1;
      b++;
    }
  }

  return table;
}

function generateMap(item, index, parent, coords) {
  const div = document.createElement("div");

  switch (item) {
    case "t":
      div.classList.add("tree");
      break;
    case "b":
      div.classList.add("brick");
      break;
    case "e":
      div.classList.add("empty");
      break;
  }
  div.style.gridArea = `${coords[index][1]} / ${coords[index][0]} / ${coords[index][1] + 1} / ${coords[index][0] + 1}`;
  parent.appendChild(div);
}

function generateUnits(item, parent) {
  const div = document.createElement("div");

  switch (item[0]) {
    case "a":
      div.classList.add("apple");
      break;
    case "c":
      div.classList.add("container");
      break;
    case "p":
      div.classList.add("person");
      break;
  }
  div.style.gridArea = `${item[3]} / ${item[1]} / ${item[4]} / ${item[2]}`;
  parent.appendChild(div);

  checkBoxOpacity();
}

function checkBoxOpacity() {
  const apples = document.querySelectorAll(".apple");
  const containers = document.querySelectorAll(".container");

  apples.forEach(fruit => {
    const apple = window.getComputedStyle(fruit).getPropertyValue("grid-area")

    containers.forEach(box => {
      const container = window.getComputedStyle(box).getPropertyValue("grid-area")
      if (container == apple) {
        box.style.opacity = "0.7";
      }
    });
  });
}

// Moving block
function move(face, startPosition, direction) {

  const top = gridArea(startPosition, -1, 0, -1, 0);
  const topOpac = gridArea(startPosition, -1, 0, -1, 0, true);
  const topNext = gridArea(startPosition, -2, 0, -2, 0);
  const topNextOpac = gridArea(startPosition, -2, 0, -2, 0, true);
  const bottom = gridArea(startPosition, 1, 0, 1, 0);
  const bottomOpac = gridArea(startPosition, 1, 0, 1, 0, true);
  const bottomNext = gridArea(startPosition, 2, 0, 2, 0);
  const bottomNextOpac = gridArea(startPosition, 2, 0, 2, 0, true);
  const left = gridArea(startPosition, 0, -1, 0, -1);
  const leftOpac = gridArea(startPosition, 0, -1, 0, -1, true);
  const leftNext = gridArea(startPosition, 0, -2, 0, -2);
  const leftNextOpac = gridArea(startPosition, 0, -2, 0, -2, true);
  const right = gridArea(startPosition, 0, 1, 0, 1);
  const rightOpac = gridArea(startPosition, 0, 1, 0, 1, true);
  const rightNext = gridArea(startPosition, 0, 2, 0, 2);
  const rightNextOpac = gridArea(startPosition, 0, 2, 0, 2, true);

  const elements = face.parentElement.children;
  let first = [];
  let second = [];

  switch (direction) {

    case "up":
      pushValues(elements, top, topOpac, topNext, topNextOpac, first, second);
      logic(first, second, face, top, topOpac, topNext, topNextOpac, topNext);
      break;

    case "down":
      pushValues(elements, bottom, bottomOpac, bottomNext, bottomNextOpac, first, second);
      logic(first, second, face, bottom, bottomOpac, bottomNext, bottomNextOpac, bottomNext);
      break;

    case "left":
      pushValues(elements, left, leftOpac, leftNext, leftNextOpac, first, second);
      logic(first, second, face, left, leftOpac, leftNext, leftNextOpac, leftNext);
      break;

    case "right":
      pushValues(elements, right, rightOpac, rightNext, rightNextOpac, first, second);
      logic(first, second, face, right, rightOpac, rightNext, rightNextOpac, rightNext);
      break;
  }
}

function gridArea(startPosition, a, b, c, d, opacity) {

  if (opacity) {
    return `grid-area: ${startPosition[0] + a} / ${startPosition[1] + b} / ${startPosition[2] + c} / ${startPosition[3] + d}; opacity: 0.7;`;

  } else {
    return `grid-area: ${startPosition[0] + a} / ${startPosition[1] + b} / ${startPosition[2] + c} / ${startPosition[3] + d};`;
  }
}

function pushValues(array, direction, directionOpac, directionNext, directionNextOpac, first, second) {

  for (let i = 0; i < array.length; i++) {

    if (array[i].getAttribute("style") == direction || array[i].getAttribute("style") == directionOpac) {
      first.push(array[i]);
    }

    if (array[i].getAttribute("style") == directionNext || array[i].getAttribute("style") == directionNextOpac) {
      second.push(array[i]);
    }
  }
}

// Logic block
function logic(first, second, face, self, selfOpac, next, nextOpac, above) {

  if (first[0].classList.contains("empty")) {

    if (first[1]) {

      if (first[1].classList.contains("container")) {
        pushBox(first, second, face, self, selfOpac, next, nextOpac, above);

      } else if (first[1].classList.contains("apple")) {

        if (first[2] && first[2].classList.contains("container")) {
          pushBox(first, second, face, self, selfOpac, next, nextOpac, above);

        } else {
          moveTo(face, first, false, selfOpac);
        }
      }

    } else {
      moveTo(face, first, self);
    }
  }
}

function pushBox(first, second, face, self, selfOpac, next, nextOpac, above) {

  if (second[0].classList.contains("empty")) {

    if (second[1]) {

      if (!second[2]) {

        if (second[1].classList.contains("apple")) {

          if (first[1].classList.contains("container")) {
            moveTo(face, first, self, false, false, nextOpac);

          } else {
            moveTo(face, first, false, selfOpac, false, nextOpac);
          }
        }
      }
    } else {

      if (first[2] && first[2].classList.contains("container")) {
        moveTo(face, first, self, false, false, false, above);

      } else {
        moveTo(face, first, self, false, next);
      }
    }
  }
}

function moveTo(face, first, self, selfOpac, next, nextOpac, above) {

  if (self && !selfOpac && !next && !nextOpac && above) {
    face.setAttribute("style", self);
    first[2].setAttribute("style", above);

  } else if (!self && selfOpac && !next && nextOpac) {
    face.setAttribute("style", selfOpac);
    first[2].setAttribute("style", nextOpac);

  } else if (self && !next && nextOpac) {
    face.setAttribute("style", self);
    first[1].setAttribute("style", nextOpac);

  } else if (self && next && !nextOpac) {
    face.setAttribute("style", self);
    first[1].setAttribute("style", next);

  } else if (!self && selfOpac) {
    face.setAttribute("style", selfOpac);

  } else {
    face.setAttribute("style", self);
  }
}

// Check for win
function checkWin() {
  const apples = document.querySelectorAll(".apple");
  const containers = document.querySelectorAll(".container");

  let appleStyle = [];
  let containerStyle = [];

  apples.forEach(item => {
    appleStyle.push(window.getComputedStyle(item).getPropertyValue("grid-area"));
  });
  containers.forEach(item => {
    containerStyle.push(window.getComputedStyle(item).getPropertyValue("grid-area"));
  });

  const set = new Set(appleStyle);

  containerStyle.forEach(item => {
    set.add(item);
  });

  if (set.size == appleStyle.length) {
    document.querySelector(".controls__box").removeEventListener("mouseup", checkWin);
    document.querySelector(".controls__box").removeEventListener("touchend", checkWin);
    document.removeEventListener("keyup", mouseClick);
    document.removeEventListener("keyup", checkWin);
    const overlay = document.querySelector(".overlay");

    setTimeout(() => {
      overlay.classList.add("show");

      const par = document.getElementById("game-field");
      while (par.firstChild) {
        par.removeChild(par.firstChild);
      }
    }, 1000);

    counter++;

    setTimeout(() => {
      if (counter < ajaxObj.length) {
        overlay.classList.remove("show");
        reinit(ajaxObj);

      } else {
        document.getElementById("text").innerText = "The End";
      }
    }, 2500);
  }
}

// sliding menu
function slide() {
  document.querySelector(".menu-overlay").classList.toggle("slide-down");
}

// Level choosing
function pickLevel(event, val) {
  counter = val - 1;
  const par = document.getElementById("game-field");
  while (par.firstChild) {
    par.removeChild(par.firstChild);
  }

  event.target.classList.add("pressed");
  setTimeout(() => {
    event.target.classList.remove("pressed");
    slide();
  }, 200);

  reinit(ajaxObj);
}