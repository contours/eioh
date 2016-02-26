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
  let classes = "flex-auto btn x-group-item not-rounded "
    + (isActive ? "btn-primary is-active" : "border-none")
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
  <div className="flex center blue">
    {items.map(item =>
      Button(item, item.id == selected, onClick))}
  </div>
)

const Segment = ({description, start}, key, isActive, onClick) => {
  let handleClick = () => {
    if (isActive) return
    onClick(start)
  }
  let color = isActive ? 'black' : 'gray'
  return (
    <div
      className={`flex-grow flex flex-column btn btn-outline
                 not-rounded y-group-item ${color}`}
      key={key}
      onClick={handleClick}
      style={{justifyContent: "center"}}
    >{description}</div>
  )
}

const SegmentSelector = ({segments, time, onClick}) => {
  return (
    <div
      className="flex-none border flex flex-column"
      style={{width: "18em", height: "calc(100vh - 36px)", overflowY: "scroll"}}
    >
      {
        segments.segments.map((s, i) => {
          let isActive = time >= s.start && time <= s.end
          return Segment(s, `${segments.id}-${i}`, isActive, onClick)
        })
      }
    </div>
  )
}

class SegmentsUI extends React.Component {
  constructor(props) {
    super(props)
    this.handleChangeTranscript = this.handleChangeTranscript.bind(this)
    this.handleSelectSegment = this.handleSelectSegment.bind(this)
    this.handleTimeUpdate = this.handleTimeUpdate.bind(this)
    this.handlePause = this.handlePause.bind(this)
    this.handlePlaying = this.handlePlaying.bind(this)
    this.state =
      { playing: false
      , selected: 'U-0078'
      , transcripts: {}
      , segments: {}
      , times: {}
      , time: 0
      , seekTime: null
      }
  }
  componentDidMount() {
    for (var path of ['baxley', 'hanes']) {
      fetch(`/media/${path}/transcript.json`)
        .then(response => response.json())
        .then(o => this.setState(state => {
          let transcripts = Object.assign({}, state.transcripts)
            , times = Object.assign({}, state.times)
          transcripts[o.id] = o
          times[o.id] = 0
          return {transcripts: transcripts, times: times}
        }))
      fetch(`/media/${path}/segments.json`)
        .then(response => response.json())
        .then(o => this.setState(state => {
          let segments = Object.assign({}, state.segments)
          segments[o.id] = o
          return {segments: segments}
        }))
    }
  }
  handleChangeTranscript(id) {
    let times = Object.assign({}, this.state.times)
    times[this.state.selected] = this.state.time
    this.setState(
      { selected: id
      , time: this.state.times[id]
      , seekTime: this.state.times[id]
      , times: times
      }
    )
  }
  handleSelectSegment(start) {
    this.setState({seekTime: start})
  }
  handleTimeUpdate(time) {
    if (time === this.state.seekTime) {
      this.setState({time: time, seekTime: null})
    } else {
      this.setState({time: time})
    }
  }
  handlePause() {
    this.setState({playing: false})
  }
  handlePlaying() {
    this.setState({playing: true})
  }
  render() {
    if (! ('U-0078' in this.state.transcripts)) return <div/>
    if (! ('U-0078' in this.state.segments)) return <div/>
    if (! ('U-0080' in this.state.transcripts)) return <div/>
    if (! ('U-0080' in this.state.segments)) return <div/>
    let transcripts =
      [ this.state.transcripts['U-0078']
      , this.state.transcripts['U-0080']
      ]
    return (
      <div
        className="container px3 bg-white"
        style={{maxWidth: "768px"}}
      >
        <ButtonGroup
          items={transcripts}
          onClick={this.handleChangeTranscript}
          selected={this.state.selected}
        />
        <div className="flex">
          <SegmentSelector
            onClick={this.handleSelectSegment}
            segments={this.state.segments[this.state.selected]}
            time={this.state.time}
          />
          <div
            className="flex-auto flex flex-column"
            style={{height: "calc(100vh - 36px)"}}
          >
            <div className="flex flex-stretch flex-auto">
              <TranscriptPlayer
                onPause={this.handlePause}
                onPlaying={this.handlePlaying}
                onTimeUpdate={this.handleTimeUpdate}
                play={this.state.playing}
                seekTime={this.state.seekTime}
                transcript={this.state.transcripts[this.state.selected]}
              />
            </div>
          </div>
       </div>
      </div>
    )
  }
}
export default SegmentsUI
