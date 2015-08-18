skills = [
    {
      "name":"Ruby",
      "category": "language",
      "radius": 33
    }, 
    {
      "name":"PHP",
      "category": "language",
      "radius": 33
    }, 
    {
      "name":"HTML",
      "category": "language",
      "radius": 33
    }, 
    {
      "name":"CSS",
      "category": "language",
      "radius": 33
    }, 
    {
      "name":"SQL",
      "category": "db",
      "radius": 33
    }, 
    {
      "name":"JavaScript",
      "category": "language",
      "radius": 33
    }, 
    {
      "name":"jQuery",
      "category": "library",
      "radius": 33
    }, 
    {
      "name":"Laravel",
      "category": "framework",
      "radius": 33
    }, 
    {
      "name":"Rails",
      "category": "framework",
      "radius": 33
    }, 
    {
      "name":"MySQL",
      "category": "db",
      "radius": 33
    }, 
    {
      "name":"Postgres",
      "category": "db",
      "radius": 33
    }, 
    {
      "name":"Backbone",
      "category": "framework",
      "radius": 33
    }, 
    {
      "name":"Bootstrap",
      "category": "framework",
      "radius": 33
    }, 
    {
      "name":"CodeIgniter", 
      "category": "framework",
      "radius": 33
    }, 
    {
      "name":"Skeleton",
      "category": "framework",
      "radius": 33
    }, 
    {
      "name":"D3.js", 
      "category": "library",
      "radius": 33
    }, 
    {
      "name":"Underscore",
      "category": "library",
      "radius": 33
    }, 
    {
      "name":"OSX",
      "category": "os",
      "radius": 33
    }, 
    {
      "name":"CentOS",
      "category": "os",
      "radius": 33
    }, 
    {
      "name":"Ubuntu",
      "category": "os",
      "radius": 33
    }, 
    {
      "name":"AWS",
      "category": "misc",
      "radius": 33
    }
  ];

function renderSkills(height, width, skills) {
  var nodes = d3.range(skills.length).map(function(i) { return {radius: skills[i].radius, skill: skills[i]}; }),
      root = nodes[0],
      color = d3.scale.category10();
  root.radius = 0;
  root.fixed = true;

  var force = d3.layout.force()
      .gravity(0.05)
      .charge(function(d, i) { return i ? 0 : -2000; })
      .nodes(nodes)
      .size([width, height]);

  force.start();

  var svg = d3.select(".skills_box").append("svg")
      .attr("width", width)
      .attr("height", height);

  svg.selectAll("circle")
      .data(nodes.slice(1))
    .enter().append("circle")
      .attr("r", function(d) { return d.radius; })
      .style("fill", function(d, i) { 
        if (d.skill.category == "language") {
          return "#ff7f0e";
        } else if (d.skill.category == "framework") {
          return "#1f77b4";
        } else if (d.skill.category == "db") {
          return "#2ca02c";
        } else if (d.skill.category == "library") {
          return "#d62728";
        } else if (d.skill.category == "os") {
          return "#9467bd";
        } else if (d.skill.category == "misc") {
          return "#8c564b";
        }
      });

  svg.selectAll("text")
      .data(nodes.slice(1))
    .enter().append("text")
      .attr("stroke", "black")
      .text(function(d) { return d.skill.name });

  force.on("tick", function(e) {
    var q = d3.geom.quadtree(nodes),
        i = 0,
        n = nodes.length;

    while (++i < n) q.visit(collide(nodes[i]));

    svg.selectAll("circle")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

    svg.selectAll("text")
      .attr("x", function (d) {return d.x - (d.skill.name.length * 2.5);  })
      .attr("y", function (d) {return d.y; })
      .attr("stroke", "#000")
      .attr("class", "skill_text");
  });

  svg.on("mousemove", function() {
    var p1 = d3.mouse(this);
    root.px = p1[0];
    root.py = p1[1];
    force.resume();
  });

  function collide(node) {
    var r = node.radius + 16,
        nx1 = node.x - r,
        nx2 = node.x + r,
        ny1 = node.y - r,
        ny2 = node.y + r;
    return function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== node)) {
        var x = node.x - quad.point.x,
            y = node.y - quad.point.y,
            l = Math.sqrt(x * x + y * y),
            r = node.radius + quad.point.radius;
        if (l < r) {
          l = (l - r) / l * .5;
          node.x -= x *= l;
          node.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    };
  }
}

function getSize() {
  var document_width = $(document).width();

  if (document_width > 1000) {
    var size = {height: 500, width: 900};
  } else {
    var size = {height: 500, width: document_width * 0.9};
  }

  return size;
}

function resizeend() {
    if (new Date() - rtime < delta) {
        setTimeout(resizeend, delta);
    } else {
        timeout = false;
        $('.skills_box').empty();
        var new_size = getSize();
        renderSkills(new_size.height, new_size.width, skills);
    }               
}

var rtime;
var timeout = false;
var delta = 200;
$(window).resize(function() {
    rtime = new Date();
    if (timeout === false) {
        timeout = true;
        setTimeout(resizeend, delta);
    }
});

$(function() {
  var size = getSize();
  renderSkills(size.height, size.width, skills);
});
