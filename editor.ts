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
    console.log(element);
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
  console.log(stop, position);
  selection.collapse(node, position);
}

content.oninput = function() {
  let result = anchorPosition(content);
  output.innerText = String(result);
  let text = content.textContent;
  content.innerHTML = text.replace(/test/g, '<span style="color:red">test</span>');
  findNewPosition(content, result);
}
