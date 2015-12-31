'use strict'

import React from 'react'
import TranscriptPlayer from 'react-transcript-player'

class BasicUI extends React.Component {
  constructor(props) {
    super(props)
    this.state = {baxley:null, hanes:null}
  }
  componentDidMount() {
    fetch('/media/baxley/transcript.json')
      .then(response => response.json())
      .then(o => this.setState({baxley:o}))
    fetch('/media/hanes/transcript.json')
      .then(response => response.json())
      .then(o => this.setState({hanes:o}))
  }
  render() {
    if (this.state.baxley) {
      return <TranscriptPlayer transcript={this.state.baxley}/>
    } else {
      return <div></div>
    }
  }
}
export default BasicUI
