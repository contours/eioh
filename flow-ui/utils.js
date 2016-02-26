'use strict'

import d3 from 'd3'

export const parseHash = () => {
  const o = {}
  location.hash
    .slice(1)
    .split('&')
    .map(part => part.split('='))
    .forEach(([k,v]) => o[k] = v)
  return o
}

export const wrap = (text, width) => {
  text.each(function() {
    var text = d3.select(this)
      , words = text.text().split(/\s+/).reverse()
      , word
      , line = []
      , lineNumber = 0
      , lineHeight = 1.1 // ems
      , x = text.attr("x")
      , y = text.attr("y")
      , dy = parseFloat(text.attr("dy"))
      , maxHeight = parseFloat(text.attr("max-height")) || Number.MAX_VALUE
      , tspan = text.text(null)
          .append("tspan")
          .attr("x", x)
          .attr("y", y)
          .attr("dy", dy + "em")

    while ((word = words.pop())) {
      line.push(word)
      tspan.text(line.join(" "))
      if (tspan.node().getComputedTextLength() > width - 10) {
        line.pop()
        tspan.text(line.join(" "))
        line = [word]
        tspan = text.append("tspan")
          .attr("x", x)
          .attr("y", y)
          .attr("dy", ++lineNumber * lineHeight + dy + "em")
          .text(word)
        if (text.node().getBBox().height > maxHeight) {
          tspan.remove()
          lineNumber--
          break
        }
      }
    }

    if (lineNumber > 0) {
      text.selectAll("tspan")
        .each(function() {
          var tspan = d3.select(this)
          , dy = parseFloat(tspan.attr("dy"))
          tspan.attr("dy", (dy - lineNumber * 0.5) + "em")
        })
    }
  })
}

