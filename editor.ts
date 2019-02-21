var content = document.getElementsByTagName("div")[0];
var output = document.getElementById("output");

function walk(tree, [done, init], fold) {
  [done, init] = fold([done, init], tree);
  if (tree.nodeType != Node.TEXT_NODE)
    for (let element of tree.childNodes) {
      if (done) {
        break;
      }
      [done, init] = walk(element, [done, init], fold);
    }
  return [done, init];
}

function anchorPosition(content) {
  var selection = window.getSelection();
  var offset = selection.anchorOffset;
  var node = selection.anchorNode;
  var fold = function ([done, sofar], element){
    if (element === node) {
      return [true, sofar + offset];
    } else {
      let length = (element.nodeType === Node.TEXT_NODE) ? element.textContent.length : 0;
      return [false, sofar + length];
    }
  };
  return (walk(content, [false, 0], fold)[1]);
}

function findNewPosition(content, position) {
  var selection = window.getSelection();
  var fold = function ([done, [node, sofar]], element) {
    if (sofar === 0)
      return [true, [node, sofar]];
    if (element.nodeType === Node.TEXT_NODE) {
      var length = element.textContent.length;
      if (sofar <= length) {
        return [true, [element, sofar]];
      } else {
        return [false, [element, sofar - length]];
      }
    }
    return [false, [node, sofar]];
  };
  var [stop, [node, position]] = walk(content, [false, [content, position]], fold);
  selection.collapse(node, position);
}
var colors = ["#e6194B", "#3cb44b", "#ffe119", "#4363d8", "#f58231", "#911eb4", "#42d4f4", "#f032e6", "#bfef45", "#fabebe", "#469990", "#e6beff", "#9A6324", "#fffac8", "#800000", "#aaffc3", "#808000", "#ffd8b1", "#000075", "#a9a9a9", "#ffffff"];

function rainbows (input) : Node[] {
  let create_char = function (char) {
    var span = document.createElement('span');
    span.innerText = char;
    return span;
  };
  let color = function (span, color) {
    span.style.color = color;
  }
  var sofar = "";
  var element : Node[] = [];
  var index = -1;
  for (let char of input.split('')) {
    if (char == '(') {
      if (sofar.length)
        element.push(document.createTextNode(sofar));
      sofar = "";
      let el = create_char('(');
      element.push(el);
      index++;
      color(el, colors[index]);
    } else if (char == ')') {
      if (sofar.length)
        element.push(document.createTextNode(sofar));
      sofar = "";
      let el = create_char(')');
      element.push(el);
      color(el, colors[index]);
      index--;
    } else {
      sofar += char;
    }
  }
  if (sofar.length)
    element.push(document.createTextNode(sofar));
  return element;
}

content.oninput = function() {
  let result = anchorPosition(content);
  output.innerText = String(result);
  let text = content.textContent;
  content.innerHTML = ''; 
  for (var node of rainbows(text))
    content.appendChild(node);
  findNewPosition(content, result);
}
