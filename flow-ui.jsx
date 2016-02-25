'use strict'

import React from 'react'
import TranscriptPlayer from 'react-transcript-player'
import FlowMap from './flowmap'
import {parseHash} from './utils'

const PlayPauseButton = ({playing, onClick}) => {
  let handleClick = () => { onClick(playing) }
    , label = `${playing ? "Pause" : "Play"} audio`
  return (
  <svg
    alt={label}
    className={"play-button " + (playing ? "playing" : "paused")}
    height="56"
    onClick={handleClick}
    width="56"
  >
    <polygon points="20,15 20,41 42,28" />
    <line
      strokeWidth="6"
      x1="22"
      x2="22"
      y1="17"
      y2="39"
    />
    <line
      strokeWidth="6"
      x1="34"
      x2="34"
      y1="17"
      y2="39"
    />
    <circle
      cx="28"
      cy="28"
      r="25"
      strokeWidth="6"
    />
  </svg>
  )
}

const CloseButton = ({onClick}) => {
  let handleClick = () => { onClick() }
  return (
  <svg
    alt="Close audio drawer"
    className="close-button"
    height="56"
    onClick={handleClick}
    width="56"
  >
    <line
      strokeWidth="6"
      x1="17"
      x2="39"
      y1="17"
      y2="39"
    />
    <line
      strokeWidth="6"
      x1="17"
      x2="39"
      y1="39"
      y2="17"
    />
    <circle
      cx="28"
      cy="28"
      r="25"
      strokeWidth="6"
    />
  </svg>
  )
}

class FlowUI extends React.Component {
  constructor(props) {
    super(props)
    this.handleHashChange = this.handleHashChange.bind(this)
    this.handlePlayPauseButtonClick = this.handlePlayPauseButtonClick.bind(this)
    this.handlePause = this.handlePause.bind(this)
    this.handlePlaying = this.handlePlaying.bind(this)
    this.handleCloseButtonClick = this.handleCloseButtonClick.bind(this)
    this.state =
      { playerOpen: false
      , play: false
      , playing: false
      , selected: 'U-0078'
      , seekTime: null
      , transcripts: {}
      , flowdata: {}
      }
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
      fetch(`/media/${path}/flowdata.json`)
        .then(response => response.json())
        .then(o => this.setState(state => {
          let flowdata = Object.assign({}, state.flowdata)
          flowdata[o.id] = o
          return {flowdata: flowdata}
        }))
      window.onhashchange = this.handleHashChange
    }
  }
  componentWillUnmount() {
    window.onhashchange = null
  }
  handleHashChange() {
    const o = parseHash()
    this.setState(
      { play: true
      , playerOpen: true
      , seekTime: Number.parseInt(o.t)
      , selected: o.interview
      })
  }
  handlePlayPauseButtonClick(pause) {
    if (pause) {
      this.setState(
        { play: false
        , seekTime: null
        }
      )
    } else {
      this.setState(
        { play: true
        , playerOpen: true
        , seekTime: null
        }
      )
    }
  }
  handlePause() {
    this.setState({play: false, playing: false, seekTime: null})
  }
  handlePlaying() {
    this.setState({play: true, playing: true, seekTime: null})
  }
  handleCloseButtonClick() {
    this.setState({playerOpen: false, seekTime: null})
  }
  render() {
    if (! ('U-0078' in this.state.transcripts)) return <div/>
    if (! ('U-0078' in this.state.flowdata)) return <div/>
    if (! ('U-0080' in this.state.transcripts)) return <div/>
    if (! ('U-0080' in this.state.flowdata)) return <div/>
    return (
      <div>
        <PlayPauseButton
          onClick={this.handlePlayPauseButtonClick}
          playing={this.state.playing}
        />
        <FlowMap
          flowdata={
            [ this.state.flowdata['U-0078']
            , this.state.flowdata['U-0080']
            ]}
          height={1150}
          width={1350}
        />
        <div
          className={"flex flex-column " +
                     (this.state.playerOpen ? "open" : "closed")}
          id="player"
          style={{height: "100vh"}}
        >
          <div className="flex flex-stretch flex-auto">
            <TranscriptPlayer
              onPause={this.handlePause}
              onPlaying={this.handlePlaying}
              play={this.state.play}
              seekTime={this.state.seekTime}
              transcript={this.state.transcripts[this.state.selected]}
            />
          </div>
          <CloseButton
            onClick={this.handleCloseButtonClick}
          />
        </div>
      </div>
    )
  }
}
export default FlowUI

/*
        <FlowMap
          flowdata={
            [ this.state.flowdata['U-0078']
            , this.state.flowdata['U-0080']
            ]}
          height={900}
          width={1400}
        />
*/
