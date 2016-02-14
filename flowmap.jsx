'use strict'

import React from 'react'
import d3flowchart from './d3flowchart'

class FlowMap extends React.Component {
  static propTypes =
    { entityPadding: React.PropTypes.number
    , flowdata: React.PropTypes.arrayOf(
        React.PropTypes.shape(
          { id: React.PropTypes.string.isRequired
          , label: React.PropTypes.string.isRequired
          , entities: React.PropTypes.array.isRequired
          , sessions: React.PropTypes.array.isRequired
          })
      ).isRequired
    , height: React.PropTypes.number.isRequired
    , layoutIterations: React.PropTypes.number
    , margin: React.PropTypes.shape(
      { top: React.PropTypes.number
      , right: React.PropTypes.number
      , bottom: React.PropTypes.number
      , left: React.PropTypes.number
      })
    , sessionPadding: React.PropTypes.number
    , sessionWidth: React.PropTypes.number
    , width: React.PropTypes.number.isRequired
    };
  static defaultProps =
    { entityPadding: 1
    , layoutIterations: 32
    , margin: { top: 1, right: 1, bottom: 1, left: 20 }
    , sessionPadding: 120
    , sessionWidth: 150
    };
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    d3flowchart.create(this.chart, this.props)
  }
  render() {
    return(
      <div
        id="chart"
        ref={ref => this.chart = ref}
      >
        <div id="bubble">
          <div className="arrow"></div>
          <h1><span id="count"></span> mentions</h1>
          <ol></ol>
        </div>
      </div>
    )
  }
}
export default FlowMap

