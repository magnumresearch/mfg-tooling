// set up SVG for D3

var margin = 10;
var width = parseInt(d3.select(".chart-div").style("width")) - margin*2,
  height = parseInt(d3.select(".chart-div").style("height")) - margin*2,
  colors = d3.scale.category10();

// var width  = 960,
//     height = 500,
//     colors = d3.scale.category10();

var svg = d3.select('.chart-div')
  .append('svg')
  .attr('oncontextmenu', 'return false;')
  .attr('width', width)
  .attr('height', height);

// set up initial nodes and links
//  - nodes are known by 'id', not by index in array.
//  - reflexive edges are indicated on the node (as a bold black circle).
//  - links are always source < target; edge directions are set by 'left' and 'right'.
var nodes = [
    // {id: "reflexive edges are indicated", reflexive: false},
    // {id: "1", reflexive: true },
    // {id: "links", reflexive: false}
  ],
  lastNodeId = 2,
  links = [
    // {source: nodes[0], target: nodes[1], left: false, right: true },
    // {source: nodes[1], target: nodes[2], left: false, right: true }
  ];

// init D3 force layout
var force = d3.layout.force()
    .nodes(nodes)
    .links(links)
    .size([width, height])
    .linkDistance(90)
    .charge(-500)
    .on('tick', tick)

// define arrow markers for graph links
svg.append('svg:defs').append('svg:marker')
    .attr('id', 'end-arrow')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 6)
    .attr('markerWidth', 3)
    .attr('markerHeight', 3)
    .attr('orient', 'auto')
  .append('svg:path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('fill', '#ff0000');

svg.append('svg:defs').append('svg:marker')
    .attr('id', 'start-arrow')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 4)
    .attr('markerWidth', 3)
    .attr('markerHeight', 3)
    .attr('orient', 'auto')
  .append('svg:path')
    .attr('d', 'M10,-5L0,0L10,5')
    .attr('fill', '#ff0000');

// line displayed when dragging new nodes
var drag_line = svg.append('svg:path')
  .attr('class', 'link dragline hidden')
  .attr('d', 'M0,0L0,0');

// handles to link and node element groups
var path = svg.append('svg:g').selectAll('path'),
    circle = svg.append('svg:g').selectAll('g');

// mouse event vars
var selected_node = null,
    selected_link = null,
    mousedown_link = null,
    mousedown_node = null,
    mouseup_node = null;

function resetMouseVars() {
  mousedown_node = null;
  mouseup_node = null;
  mousedown_link = null;
}

// update force layout (called automatically each iteration)
function tick() {
  // draw directed edges with proper padding from node centers
  path.attr('d', function(d) {
    var deltaX = d.target.x - d.source.x,
        deltaY = d.target.y - d.source.y,
        dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
        normX = deltaX / dist,
        normY = deltaY / dist,
        sourcePadding = d.left ? 18 : 13,
        targetPadding = d.right ? 18 : 13,
        sourceX = d.source.x + (sourcePadding * normX),
        sourceY = d.source.y + (sourcePadding * normY),
        targetX = d.target.x - (targetPadding * normX),
        targetY = d.target.y - (targetPadding * normY);
    return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
  });

  circle.attr('transform', function(d) {
    return 'translate(' + d.x + ',' + d.y + ')';
  });
}

function updateNodesAndLinks(arrayNodes, arrayLinks) {
  // path = path.data(links);
  // path.exit().remove();
  // circle = circle.data(nodes, function(d) { return d.id; });
  // circle.exit().remove();
  // nodes = [];
  // for (var i in links) {
  //   links.pop();
  // }
  var arrayLength = nodes.length;
  for (var i=0; i<arrayLength; i++) {
    nodes.pop();
  }
  arrayLength = links.length;
  for (var i=0; i<arrayLength; i++) {
    links.pop();
  }
  restart();

  arrayNodes.forEach(function(entry) {
    var node = {id:entry.name+"("+entry.id+")", type:entry.type, reflexive:false, color:entry.color, originalid:entry.id};
    nodes.push(node);
  });
  console.log("nodes length:"+ nodes.length);

  // links = [];
  arrayLinks.forEach(function(entry) {
    var link = {source:nodes[entry.sourceIndex], target:nodes[entry.targetIndex], left:entry.left, right:entry.right};
    links.push(link);
  });
  console.log("links length:"+ links.length);
  restart();
}

// update graph (called when needed)
function restart() {
  // path (link) group
  path = path.data(links);

  // update existing links
  path.classed('selected', function(d) { return d === selected_link; })
    .style('marker-start', function(d) { return d.left ? 'url(#start-arrow)' : ''; })
    .style('marker-end', function(d) { return d.right ? 'url(#end-arrow)' : ''; });


  // add new links
  path.enter().append('svg:path')
    .attr('class', 'link')
    .classed('selected', function(d) { return d === selected_link; })
    .style('marker-start', function(d) { return d.left ? 'url(#start-arrow)' : ''; })
    .style('marker-end', function(d) { return d.right ? 'url(#end-arrow)' : ''; })
    .on('mousedown', function(d) {
      if(d3.event.ctrlKey) return;

      // select link
      mousedown_link = d;
      if(mousedown_link === selected_link) { 
        selected_link = null;
        
      } else {
        selected_link = mousedown_link;
      }
      selected_node = null;
      restart();
    });

  // remove old links
  path.exit().remove();


  // circle (node) group
  // NB: the function arg is crucial here! nodes are known by id, not by index!
  circle = circle.data(nodes, function(d) { return d.id; });

  // update existing nodes (reflexive & selected visual states)
  circle.selectAll('circle')
    // .style('fill', function(d) { return (d === selected_node) ? colors.range()[3] : colors.range()[d.color]; })
    .style('stroke', function(d) { return (d === selected_node) ? colors.range()[3] : colors.range()[7]; })
    .style('stroke-width', function(d) {return (d === selected_node) ? 4: 1;})
    .classed('reflexive', function(d) { return d.reflexive; });

  // add new nodes
  var g = circle.enter().append('svg:g');

  g.append('svg:circle')
    .attr('class', 'node')
    .attr('r', function(d) { if(d.type=="processes") return 15; else if(d.type=="processStep") return 10; else return 5;})

  /*
  g.append('svg:rect')
    .attr('class', 'node')
    .attr('width', function(d) { return (d.type=="processes"||d.type=="processStep")?30:20;})
    .attr('height', function(d) { return (d.type=="processes"||d.type=="processStep")?30:20;})
    .attr('x', function(d) { return (d.type=="processes"||d.type=="processStep")?-15:-10;})
    .attr('y', function(d) { return (d.type=="processes"||d.type=="processStep")?-15:-10;})
    // .attr('width', 20)
    // .attr('height', 20)
    // .attr('x', -10)
    // .attr('y', -10)
    .attr('rx', 5)
    .attr('ry', 5)
    //////// .attr('r', 10)
    // .attr('width', function(d) { return d.id.length*5.2+10; })
    // .attr('height', 20)
    // .attr('x', function(d) { return -d.id.length*2.6; })
    // .attr('y', -10)
    // .attr('rx', 5)
    // .attr('ry', 5)
    */
    .style('fill', function(d) { return (d === selected_node) ? colors.range()[3]: colors.range()[d.color]; })
    .style('stroke', function(d) { return d3.rgb(colors.range()[d.color]).darker().toString(); })
    .style('stroke-width', 1)
    .style('opacity', 0.8)
    .classed('reflexive', function(d) { return d.reflexive; })
    .on('mouseover', function(d) {
      if(!mousedown_node || d === mousedown_node) return;
      // enlarge target node
      d3.select(this).attr('transform', 'scale(1.1)');
    })
    .on('mouseout', function(d) {
      if(!mousedown_node || d === mousedown_node) return;
      // unenlarge target node
      d3.select(this).attr('transform', '');
    })
    .on('mousedown', function(d) {
      if(d3.event.ctrlKey) return;

      // select node
      mousedown_node = d;
      if(mousedown_node === selected_node) selected_node = null;
      else selected_node = mousedown_node;
      selected_link = null;

      

      // reposition drag line
      drag_line
        .style('marker-end', 'url(#end-arrow)')
        .classed('hidden', false)
        .attr('d', 'M' + mousedown_node.x + ',' + mousedown_node.y + 'L' + mousedown_node.x + ',' + mousedown_node.y);

      restart();
    })
    .on('mouseup', function(d) {
      if(!mousedown_node) return;

      // needed by FF
      drag_line
        .classed('hidden', true)
        .style('marker-end', '');

      // check for drag-to-self
      mouseup_node = d;
      if(mouseup_node === mousedown_node) { resetMouseVars(); return; }

      // unenlarge target node
      d3.select(this).attr('transform', '');

      // add link to graph (update if exists)
      // NB: links are strictly source < target; arrows separately specified by booleans
      var source, target, direction;
      // if(mousedown_node.id < mouseup_node.id) {
      //   source = mousedown_node;
      //   target = mouseup_node;
      //   direction = 'right';
      // } else {
      //   source = mouseup_node;
      //   target = mousedown_node;
      //   direction = 'left';
      // }
      source = mousedown_node;
      target = mouseup_node;


      var link;
      link = links.filter(function(l) {
        return (l.source === source && l.target === target);
      })[0];

      if(link) {
        link[direction] = true;
      } else {
        link = {source: source, target: target, left: false, right: false};
        link[direction] = true;
        links.push(link);

        $('#DashboardController').scope().updateLink(
          source,
          target,
          false
        );
      }

      // select new link
      selected_link = link;
      selected_node = null;
      restart();
    });

  // show node IDs
  g.append('svg:text')
      // .attr('x', 25)
      .attr('x', function(d) { return (d.id.length*4)/2+20; })
      .attr('y', 4)
      .attr('class', 'id')
      .text(function(d) { return d.id; });

  // remove old nodes
  circle.exit().remove();

  updateButtonVisibility();

  // set the graph in motion
  force.start();
}

function mousedown() {
  // prevent I-bar on drag
  //d3.event.preventDefault();

  // because :active only works in WebKit?
  svg.classed('active', true);

  // var point = d3.mouse(this)
  // console.log(point[0]);
  // console.log(selected_node);

  if(d3.event.ctrlKey) return;
  if(mousedown_node || mousedown_link) {
    // console.log(selected_node);
    // console.log(mousedown_link);
    restart();
  }


  // insert new node at point
  // var point = d3.mouse(this),
  //   node = {id: ''+(++lastNodeId), reflexive: false};
  //     // node = {id: ++lastNodeId, reflexive: false};
  // node.x = point[0];
  // node.y = point[1];
  // nodes.push(node);

  // restart();
}

function mousemove() {
  if(!mousedown_node) return;

  // update drag line
  drag_line.attr('d', 'M' + mousedown_node.x + ',' + mousedown_node.y + 'L' + d3.mouse(this)[0] + ',' + d3.mouse(this)[1]);

  restart();
}

function mouseup() {
  if(mousedown_node) {
    // hide drag line
    drag_line
      .classed('hidden', true)
      .style('marker-end', '');
  }

  // because :active only works in WebKit?
  svg.classed('active', false);

  // clear mouse event vars
  resetMouseVars();
}

function spliceLinksForNode(node) {
  var toSplice = links.filter(function(l) {
    return (l.source === node || l.target === node);
  });
  // console.log(toSplice.length);
  var cache = JSON.parse(JSON.stringify(node));
  if (toSplice.length>0){
    toSplice.map(function(l) {
      var link = links[links.indexOf(l)];
      console.log(link);
      // var cache = JSON.parse(JSON.stringify(node));
      $('#DashboardController').scope().updateLink_tmp(
        link.source,
        link.target,
        true,
        cache
      );
      links.splice(links.indexOf(l), 1);

    });
  } else {
    $('#DashboardController').scope().deleteNode(
      node
    );
  }
}

// only respond once per keydown
var lastKeyDown = -1;

function keydown() {
  // d3.event.preventDefault();

  if(lastKeyDown !== -1) return;
  lastKeyDown = d3.event.keyCode;

  // ctrl
  if(d3.event.keyCode === 17) {
    d3.event.preventDefault();
    circle.call(force.drag);
    svg.classed('ctrl', true);
  }

  if(!selected_node && !selected_link) return;
  switch(d3.event.keyCode) {
    case 8: // backspace
    case 46: // delete
      d3.event.preventDefault();
      if(selected_node) {

        deleteLink();
        // nodes.splice(nodes.indexOf(selected_node), 1);
        // spliceLinksForNode(selected_node);
      } else if(selected_link) {
        // links.splice(links.indexOf(selected_link), 1);

        deleteLink();
      }
      selected_link = null;
      selected_node = null;
      restart();
      break;
    case 66: // B
      if(selected_link) {
        // set link direction to both left and right
        selected_link.left = true;
        selected_link.right = true;
      }
      restart();
      break;
    case 76: // L
      if(selected_link) {
        // set link direction to left only
        selected_link.left = true;
        selected_link.right = false;
      }
      restart();
      break;
    case 82: // R
      if(selected_node) {
        // toggle node reflexivity
        selected_node.reflexive = !selected_node.reflexive;
      } else if(selected_link) {
        // set link direction to right only
        selected_link.left = false;
        selected_link.right = true;
      }
      restart();
      break;
  }
}

function keyup() {
  lastKeyDown = -1;

  // ctrl
  if(d3.event.keyCode === 17) {
    circle
      .on('mousedown.drag', null)
      .on('touchstart.drag', null);
    svg.classed('ctrl', false);
  }
}

// app starts here
svg.on('mousedown', mousedown)
  .on('mousemove', mousemove)
  .on('mouseup', mouseup);
d3.select(window)
  .on('keydown', keydown)
  .on('keyup', keyup);
restart();

function updateButtonVisibility() {
  if (selected_node) {
      // document.getElementById("top-edit-button").style.visibility = "visible";
      document.getElementById("top-delete-button").style.visibility = "visible";
    } else if (selected_link){
      // document.getElementById("top-edit-button").style.visibility = "hidden";
      document.getElementById("top-delete-button").style.visibility = "visible";
    } else {
      document.getElementById("top-delete-button").style.visibility = "hidden";
      // document.getElementById("top-edit-button").style.visibility = "hidden";
    }
}

function deleteLink() {
  if (selected_link) {
    $('#DashboardController').scope().updateLink(
      selected_link.source,
      selected_link.target,
      true
    );
    links.splice(links.indexOf(selected_link), 1);
    selected_link = null;
    selected_node = null;
    // document.getElementById("top-delete-button").style.visibility = "hidden";
    updateButtonVisibility();
    restart();
  } else if(selected_node) {
    // var cache = JSON.parse(JSON.stringify(selected_node));
    // setTimeout(function() { $('#DashboardController').scope().deleteNode(cache); }, 3);
    // $('#DashboardController').scope().deleteNode(
    //   selected_node
    // );

    spliceLinksForNode(selected_node);
    nodes.splice(nodes.indexOf(selected_node), 1);
    
    selected_link = null;
    selected_node = null;
    updateButtonVisibility();
    restart();
    
  }
}

function insertNewNode(entry) {
    var node = {id:entry.name+"("+entry.id+")", type:entry.type, reflexive:false, color:entry.color, originalid:entry.id};
    nodes.push(node);
    restart();
}