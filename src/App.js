import React, { Component } from 'react';
import P5Wrapper from 'react-p5-wrapper';

// import { demoSketch } from './p5';
import { mandelbrotSketch } from './p5/mandelbrot';
import githubLogo from './images/GitHub-Mark-Light-64px.png';
import loaderGif from './images/loader.gif';

import './App.css';

const repoUrl = 'https://www.github.com/fauskanger/p5';




class App extends Component {
    p5Element = null;
    // headerSection = null;
    state = {
        sketch: {
            reMin: -1.85,
            reMax: 0.6,
            imMin: -1.2,
            imMax: 1.2,
            maxIterations: 100,
            colorEaseExponent: 1.0
        },
        tmpSketch: {},
        loading: false,
        headerHeight: 0
    };

    getTmpOrExistingSketchState = stateAttributeName => typeof this.state.tmpSketch[stateAttributeName] === "undefined"
        ? this.state.sketch[stateAttributeName]
        : this.state.tmpSketch[stateAttributeName];

    componentDidMount() {
        this.setState({
            headerHeight: this.headerSection.clientHeight
        })
    }

    applyChanges = () => {
        this.setLoadingStart();
        setTimeout(
            () =>
                this.setState({
                    sketch: {
                        ...this.state.sketch,
                        ...this.state.tmpSketch
                    },
                    tmpSketch: {}
                }),
            1000
        );
        this.setLoadingComplete();
    };

    createStateSlider = ({ min, max, stateAttributeName, step=0.1, validate=this.defaultControlChangeValidation }) => {
        const value = this.state.sketch[stateAttributeName];
        const tmpValue = this.state.tmpSketch[stateAttributeName];
        return (
            <input
                type={"range"} min={min} max={max} step={step}
                value={tmpValue || value}
                onChange={
                    (e) => {
                        const oldValue = this.state.sketch[stateAttributeName];
                        const newValue = Number(e.target.value);
                        if (oldValue !== newValue && validate(newValue)) {
                            console.log(stateAttributeName, 'old: ', oldValue, 'new: ', newValue);
                            this.setState({
                                tmpSketch: {
                                    ...this.state.tmpSketch,
                                    [stateAttributeName]: newValue
                                }
                            })
                        }
                    }
                }
            />)
    };

    createSliderPair = ({ stateAttributeNameStart, stateAttributeNameEnd, startLabel, endLabel, min, max, step }) => [
        {
            stateAttributeName: stateAttributeNameStart,
            label: startLabel,
            min, max, step,
            validate: (newValue) => newValue < this.getTmpOrExistingSketchState(stateAttributeNameStart)
        },
        {
            stateAttributeName: stateAttributeNameEnd,
            label: endLabel,
            min, max, step,
            validate: (newValue) => newValue > this.getTmpOrExistingSketchState(stateAttributeNameEnd)
        },
    ];

    defaultControlChangeValidation = (newValue) => true;

    // getControlMetas = () => [
    //     {
    //         stateAttributeName: 'reMin',
    //         label: 'Real start',
    //         min: -2, max: 2, step: 0.01,
    //         validate: (newValue) => newValue < this.getTmpOrExistingSketchState('reMin')
    //     },
    //     {
    //         stateAttributeName: 'reMax',
    //         label: 'Real end',
    //         min: -2, max: 2, step: 0.01,
    //         validate: (newValue) => newValue > this.getTmpOrExistingSketchState('reMax')
    //     },
    //     {
    //         stateAttributeName: 'imMin',
    //         label: 'Imaginary start',
    //         min: -2, max: 2, step: 0.01,
    //         validate: (newValue) => newValue < this.getTmpOrExistingSketchState('imMax')
    //     },
    //     {
    //         stateAttributeName: 'imMax',
    //         label: 'Imaginary end',
    //         min: -2, max: 2, step: 0.01,
    //         validate: (newValue) => newValue > this.getTmpOrExistingSketchState('imMax')
    //     },
    //     {
    //         stateAttributeName: 'maxIterations',
    //         label: 'Max iterations',
    //         min: 5, max: 1000, step: 10,
    //     },
    //     {
    //         stateAttributeName: 'colorEaseExponent',
    //         label: 'Color exponent',
    //         min: 0.1, max: 2, step: 0.05,
    //     },
    // ];

    getControlMetas = () => [
        ...this.createSliderPair({
            stateAttributeNameStart: 'reMin',
            stateAttributeNameEnd: 'reMax',
            min: -2, max: 2, step: 0.01,
            startLabel: 'Real start',
            endLabel: 'Real end'
        }),
        ...this.createSliderPair({
            stateAttributeNameStart: 'imMin',
            stateAttributeNameEnd: 'imMax',
            min: -2, max: 2, step: 0.01,
            startLabel: 'Imaginary start',
            endLabel: 'Imaginary end'
        }),
        {
            stateAttributeName: 'maxIterations',
            label: 'Max iterations',
            min: 5, max: 1000, step: 10,
        },
        {
            stateAttributeName: 'colorEaseExponent',
            label: 'Color exponent',
            min: 0.1, max: 2, step: 0.05,
        },
    ];

    setLoadingComplete = () => {
        this.setState({ loading: false })
    };
    setLoadingStart = () => {
        this.setState({ loading: true })
    };

    render = () => {
        const { sketch: sketchState } = this.state;
        const isApplyButtonDisabled = this.state.loading || Object.keys(this.state.tmpSketch).length === 0;
        return (
            <div className="App">
                <header className="App-header" ref={(e => this.headerSection = e)}>
                    <div className="title">
                        Mandelbrot Set Visualization
                    </div>
                    <div className="controls">
                        {
                            this.getControlMetas().map( item => {
                                    const value = this.state.sketch[item.stateAttributeName];
                                    const tmpValue = this.state.tmpSketch[item.stateAttributeName];
                                    return <div key={item.stateAttributeName}>
                                        <div>
                                            {item.label}
                                        </div>
                                        <div>
                                            ({ !!tmpValue ? `${value} ⟶ ${tmpValue}`: value })
                                        </div>
                                        <div>
                                            {this.createStateSlider(item)}
                                        </div>
                                    </div>
                                }
                            )
                        }
                        <div className="update-button">
                            <button onClick={this.applyChanges} disabled={isApplyButtonDisabled}>
                                Apply changes
                            </button>
                        </div>
                    </div>
                    <div className="github-logo">
                        <a href={repoUrl} target="_blank" rel="noopener noreferrer">
                            <span className="github-link-text">See code</span>
                            <img src={githubLogo} alt="Visit repo on GitHub" />
                        </a>
                    </div>
                    <div className={`loading-icon ${this.state.loading? 'show': 'hide'}`}>
                        <img src={loaderGif} alt="Loading" />
                    </div>
                </header>
                <div ref={e => this.p5Element = e} style={{
                    display: 'flex',
                    flexGrow: 1,
                }}>
                    <P5Wrapper
                        sketch={mandelbrotSketch}
                        { ...sketchState }
                        setLoadingStart={this.setLoadingStart}
                        setLoadingComplete={this.setLoadingComplete}
                        headerHeight={this.state.headerHeight}
                    />
                </div>
            </div>
        );
    }
}

export default App;
