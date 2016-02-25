'use strict'

import d3 from 'd3'
window.d3 = d3
import 'd3-svg-legend'
import colorbrewer from 'colorbrewer'
import './entityflow'
import {wrap} from './utils'

const d3flowchart = {}

d3flowchart.create = function(el, props) {
  const color = d3.scale.ordinal().range(colorbrewer.Set3[12])
      , svg = d3.select(el)
          .append('svg')
          .attr('width', props.width)
          .attr('height',props.height)
          .append('g')
      , flow = d3.entityflow()
          .size([props.width, props.height])
          .sessionMap(
          // Filter out participants in sessions with value = 1
          function(session) {
            return Object.assign({},
              session,
              {entities: session.entities.filter(
                function(entity) { return entity.value > 1 })})
          })
      , sources = []

  for (let data of props.flowdata) {
    flow.entities(data.entities, data.id, data.label)
    flow.sessions(data.sessions, data.id, data.label)
    sources.push({id: data.id, label: data.label})
  }

  flow.entityFilter(
      // only keep entities participating in multiple sessions
      function(entity) {
        return ('nodes' in entity && entity.nodes.length > 1)
      })
    .valueScale(
      function(domain) {
        return d3.scale.log()
          .domain(domain)
          .range([1.3, 5])
      })
    .sessionWidth(props.sessionWidth)
    .sessionPadding(props.sessionPadding)
    .entityPadding(props.entityPadding)
    .layout(props.layoutIterations)

  // draw legend
  svg.append('g')
    .attr('class', 'legend')
    .attr('transform', 'translate(1100,55)')
  var ordinal = d3.scale.ordinal()
    .domain(props.flowdata.map(s => s.label).sort())
    .range([d3.rgb('#E5E5E5'), d3.rgb('#465A61')])
  var legend = d3.legend.color()
    .shape('path', d3.svg.symbol().type('square').size(500)())
    .shapePadding(10)
    .scale(ordinal)
  svg.select('.legend').call(legend)
  // end draw legend

  svg.append('g')
    .selectAll('.session')
    .data(flow.sessions())
    .enter()
    .append('g')
    .attr('class', 'session')
    .attr('transform'
      , function(d) { return 'translate(' + d.x + ',' + d.y + ')' })
    .append('rect')
    .attr('height', function(d) { return d.dy })
    .attr('width', flow.sessionWidth())

  const entity =
    svg.append('g')
      .selectAll('.entity')
      .data(flow.entities())
      .enter()
      .append('g')
      .attr('class', 'entity')

  entity.append('path')
    .attr('d', flow.entitypath())
    .style('fill' , function(d) {
      return d.color = color(d.name) })
    .style('stroke', function(d) { return d3.rgb(d.color).darker(1) })
    .append('title')
    .text(function(d) { return d.name })

  const entityLabel = entity.selectAll('.entity-label')
    .data(flow.entitynodes())
    .enter()
    .append('g')
    .attr('class', 'entity-label')
    .attr('transform'
          , function(d) { return 'translate(' + d.x + ',' + d.y + ')' })

  entityLabel.append('text')
    .attr('x', 6)
    .attr('y', function(d) { return d.dy / 2 })
    .attr('dy', '.35em')
    .attr('max-height', function(d) { return d.dy })
    .text(function(d) { return d.entity.name })
    .call(wrap, flow.sessionWidth())

  entityLabel.append('rect')
    .attr('height', function(d) { return d.dy })
    .attr('width', flow.sessionWidth())
    .on('click', showMentions)

  d3.select(el).on("click", hideMentions)

  function showMentions(d) {
    d3.event.stopPropagation()
    var bubble = d3.select("#bubble")
      , style =
        { display: "block"
        , top: Math.round(d.y + d.dy + 6) + "px"
        }
    if (d.x < props.width/2) {
      d3.select("#bubble .arrow")
        .classed({arrow: true, left: true, right: false})
      style.left = Math.round(d.x) + "px"
      style.right = "auto"
    } else {
      d3.select("#bubble .arrow")
        .classed({arrow: true, left: false, right: true})
      style.left = "auto"
      style.right = Math.round(props.width - d.x - d.dx) + "px"
    }
    var changed = false
    for (var prop in style) {
      if (style[prop] != bubble.style(prop)) {
        changed = true
        break
      }
    }
    if (! changed) {
      hideMentions()
      return
    }
    bubble.style(style)
    d3.select("#count").text(d.mentions.length)
    var render = function(d) {
      return '<a href="' + d.url + '">' + d.excerpt + '</a>'
    }
    var sel = d3.select("#bubble ol")
      .selectAll("li")
      .data(d.mentions)
      .html(render)
    sel.enter()
      .append("li")
      .html(render)
    sel.exit().remove()
  }

  function hideMentions() {
    d3.select("#bubble").style("display", "none")
  }

  const sessionLabelHeight = 85
      , sessionLabel =
    svg.append('g')
        .selectAll('.session-label')
        .data(flow.sessions())
        .enter()
        .append('g')
        .attr('class'
              , function(d) {
                return 'session-label ' + d.source.id })
        .attr('transform'
              , function(d) {
                return 'translate(' + d.x + ','
                  + (d.y - sessionLabelHeight - 1)  + ')' })
        .append('a')
        .attr('xlink:href', function(d) { return d.url })

  sessionLabel.append('rect')
    .attr('height', sessionLabelHeight)
    .attr('width', flow.sessionWidth())

  sessionLabel.append('text')
    .attr('text-anchor', 'middle')
    .attr('x', flow.sessionWidth() / 2)
    .attr('y', sessionLabelHeight / 2)
    .attr('dy', '.45em')
    .text(function(d) { return d.name })
    .call(wrap, flow.sessionWidth())
}
export default d3flowchart
