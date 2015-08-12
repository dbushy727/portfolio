
var width = 960,
    height = 500;
var skills = [
  {
    "name":"Ruby",
    "category": "language"
  }, 
  {
    "name":"PHP",
    "category": "language"
  }, 
  {
    "name":"HTML",
    "category": "language"
  }, 
  {
    "name":"CSS",
    "category": "language"
  }, 
  {
    "name":"SQL",
    "category": "db"
  }, 
  {
    "name":"JavaScript",
    "category": "language"
  }, 
  {
    "name":"jQuery",
    "category": "library"
  }, 
  {
    "name":"Laravel",
    "category": "framework"
  }, 
  {
    "name":"Rails",
    "category": "framework"
  }, 
  {
    "name":"MySQL",
    "category": "db"
  }, 
  {
    "name":"Postgres",
    "category": "db"
  }, 
  {
    "name":"Backbone",
    "category": "framework"
  }, 
  {
    "name":"Bootstrap",
    "category": "framework"
  }, 
  {
    "name":"Code Igniter", 
    "category": "framework"
  }, 
  {
    "name":"Skeleton",
    "category": "framework"
  }, 
  {
    "name":"D3.js", 
    "category": "library"
  }, 
  {
    "name":"Underscore",
    "category": "library"
  }, 
  {
    "name":"OSX",
    "category": "os"
  }, 
  {
    "name":"CentOS",
    "category": "os"
  }, 
  {
    "name":"Ubuntu",
    "category": "os"
  }, 
  {
    "name":"Amazon Linux", 
    "category": "os"
  }, 
  {
    "name":"AWS",
    "category": "misc"
  }
],
  nodes = d3.range(22).map(function() { return {radius: 43, skill: skills.pop()}; }),
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

var svg = d3.select(".skills").append("svg")
    .attr("width", width)
    .attr("height", height);

svg.selectAll("circle")
    .data(nodes.slice(1))
  .enter().append("circle")
    .attr("r", function(d) { return d.radius; })
    .style("fill", function(d, i) { 
      if (d.category == "framework") {
        var category_color = 1;
      } else if (d.skill.category == "language") {
        var category_color = 2;
      } else if (d.skill.category == "db") {
        var category_color = 3;
      } else if (d.skill.category == "library") {
        var category_color = 4;
      } else if (d.skill.category == "os") {
        var category_color = 5;
      } else if (d.skill.category == "misc") {
        var category_color = 6;
      }
      return color(category_color);
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
    .attr("x", function (d) {return d.x - (d.skill.name.length * 3.3);  })
    .attr("y", function (d) {return d.y; })
    .attr("font-size", "0.7em")
    .attr("stroke", "#000")
    .attr("font-family", "Helvetica Neue")
    .attr("font-weight", "100")
    .attr("letter-spacing", "2px");
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
