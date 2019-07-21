import React, { Component } from 'react';
import P5Wrapper from 'react-p5-wrapper';

// import { demoSketch } from './p5';
import { mandelbrotSketch } from './p5/mandelbrot';

import './App.css';


class App extends Component {
  p5Element = null;
  state = {
      rotation: 45
  };
  render = () => {
    return (
        <div className="App">
          <header className="App-header">
              Mandelbrot Set Visualization
           {/*Set a number ({ this.state.rotation }°): */}
              {/*<input type={"range"} min={-360} max={360} value={this.state.rotation} onChange={(e) => this.setState({rotation: Number(e.target.value)})}/>*/}
          </header>
          <div ref={e => this.p5Element = e} style={{
            display: 'flex',
            flexGrow: 1,
          }}>
            <P5Wrapper sketch={mandelbrotSketch} rotation={this.state.rotation} />
          </div>
        </div>
    );
  }
}

export default App;
