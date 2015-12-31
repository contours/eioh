'use strict'

import React from 'react'
import TranscriptPlayer from 'react-transcript-player'

const Label = ({id, label}) => (
  <div>
    <span>{`Interview ${id}: `}</span>
    <span>{label}</span>
  </div>
)

const Button = ({id, label}, isActive, onClick) => {
  let classes = "flex-auto btn btn-primary border-left rounded-right"
  if (isActive) classes += " is-active"
  let handleClick = () => {
    if (isActive) return
    onClick(id)
  }
  return (
    <button
      className={classes}
      key={id}
      onClick={handleClick}
    >
      <Label
        id={id}
        label={label}
      />
    </button>
  )
}

const ButtonGroup = ({items, selected, onClick}) => (
  <div className="flex center">
    {items.map(item =>
      Button(item, item.id == selected, onClick))}
  </div>
)

class BasicUI extends React.Component {
  constructor(props) {
    super(props)
    this.handleChangeTranscript = this.handleChangeTranscript.bind(this)
    this.state = {selected: 'U-0078', transcripts: {}}
  }
  componentDidMount() {
    for (var path of ['baxley', 'hanes']) {
      fetch(`/media/${path}/transcript.json`)
        .then(response => response.json())
        .then(o => this.setState(state => {
          let transcripts = Object.assign({}, state.transcripts)
          transcripts[o.id] = o
          return {transcripts: transcripts}
        }))
    }
  }
  handleChangeTranscript(id) {
    this.setState({selected: id})
  }
  render() {
    if (! ('U-0078' in this.state.transcripts)) return <div/>
    if (! ('U-0080' in this.state.transcripts)) return <div/>
    let transcripts =
      [ this.state.transcripts['U-0078']
      , this.state.transcripts['U-0080']
      ]
    return (
      <div>
        <ButtonGroup
          items={transcripts}
          onClick={this.handleChangeTranscript}
          selected={this.state.selected}
        />
        <div
          className="flex flex-column"
          style={{height: "100vh"}}
        >
          <div className="flex flex-stretch flex-auto">
            <TranscriptPlayer
              transcript={this.state.transcripts[this.state.selected]}
            />
          </div>
        </div>
      </div>
    )
  }
}
export default BasicUI
