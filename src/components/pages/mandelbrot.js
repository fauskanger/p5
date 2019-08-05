import React, { Component } from 'react';
import P5Wrapper from 'react-p5-wrapper';
import { Helmet } from 'react-helmet';
// import * as M from 'mathjs';

// import { demoSketch } from './p5';
import { mandelbrotSketch } from '../../p5/mandelbrot';
import ogImage from '../../images/thumbnailMandelbrot.png';

import HeaderComponent from "../header";
import FooterComponent from "../footer";

const pageTitle = 'Mandelbrot Set Visualization';

const startSketchState = {
    reMin: -1.85,
    reMax: 0.6,
    imMin: -1.2,
    imMax: 1.2,
    zoomScale: 1.0,
    maxIterations: 50,
    colorEaseExponent: 1.0
};


class MandelbrotPageComponent extends Component {
    p5Element = null;
    // headerSection = null;
    // footerSection = null;
    state = {
        sketch: startSketchState,
        tmpSketch: {},
        loading: true,
        headerHeight: 0,
        footerHeight: 0
    };

    getTmpOrExistingSketchState = stateAttributeName => typeof this.state.tmpSketch[stateAttributeName] === "undefined"
        ? this.state.sketch[stateAttributeName]
        : this.state.tmpSketch[stateAttributeName];


    hasTmpSketch = () => Object.keys(this.state.tmpSketch).length > 0;

    componentDidMount() {
        this.setState({
            headerHeight: this.headerSection.clientHeight,
            footerHeight: this.footerSection.clientHeight
        })
    }

    applyChanges = () => {
        this.setLoadingStart();
        setTimeout(
            () => {
                this.setState({
                    sketch: {
                        ...this.state.sketch,
                        ...this.state.tmpSketch,
                        zoomScale: 1.0
                    },
                    tmpSketch: {}
                });
                // this.setLoadingComplete();
            },
            50
        );
    };

    createStateSlider = (
        {
            min, max, stateAttributeName, step=0.1,
            validate= () => true,
            onPreChange, onPostChange
        }
    ) => {
        const value = this.state.sketch[stateAttributeName];
        const tmpValue = this.state.tmpSketch[stateAttributeName];
        return (
            <input
                type={"range"} min={min} max={max} step={step}
                value={tmpValue || value}
                onChange={
                    (e) => {
                        const newValue = Number(e.target.value);
                        if (!!onPreChange) {
                            onPreChange(newValue);
                        }
                        const oldValue = this.state.sketch[stateAttributeName];
                        const hasTmpValue = typeof this.state.tmpSketch[stateAttributeName] !== "undefined";
                        if ((hasTmpValue || oldValue !== newValue) && validate(newValue)) {
                            console.log(stateAttributeName, 'old: ', oldValue, 'new: ', newValue);
                            this.setState({
                                tmpSketch: {
                                    ...this.state.tmpSketch,
                                    [stateAttributeName]: newValue
                                }
                            });
                            if (!!onPostChange) {
                                onPostChange(newValue)
                            }
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
            validate: (newValue) => newValue < this.getTmpOrExistingSketchState(stateAttributeNameEnd)
        },
        {
            stateAttributeName: stateAttributeNameEnd,
            label: endLabel,
            min, max, step,
            validate: (newValue) => newValue > this.getTmpOrExistingSketchState(stateAttributeNameStart)
        },
    ];


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
            min: 10, max: 1000, step: 10,
            displayPrecision: 0
        },
        {
            stateAttributeName: 'colorEaseExponent',
            label: 'Color exponent',
            min: 0.1, max: 2, step: 0.05,
        },
        {
            stateAttributeName: 'zoomScale',
            label: 'Zoom',
            displayPrecision: 1,
            min: 0.1, max: 10, step: 0.1
        },
    ];

    applyNewZoomState = () => {
        const scaleFactor = this.state.tmpSketch.zoomScale || 1;
        const reWidth = this.state.sketch.reMax - this.state.sketch.reMin;
        const imWidth = this.state.sketch.imMax - this.state.sketch.imMin;
        const reMid = reWidth / 2 + this.state.sketch.reMin;
        const imMid = imWidth / 2 + this.state.sketch.imMin;
        console.log('reMid: ', reMid, ' imMid: ', imMid);
        const newReWidth = reWidth / scaleFactor;
        const newImWidth = imWidth / scaleFactor;
        this.setState({
            tmpSketch: {
                ...this.state.tmpSketch,
                reMax: reMid + newReWidth / 2,
                reMin: reMid - newReWidth / 2,
                imMax: imMid + newImWidth / 2,
                imMin: imMid - newImWidth / 2,
            }
        })
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.tmpSketch.zoomScale !== this.state.tmpSketch.zoomScale) {
            this.applyNewZoomState();
        }
    }

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
                <Helmet>
                    <meta property="og:image" content={ogImage} />
                </Helmet>

                <HeaderComponent title={pageTitle} />

                <main ref={e => this.p5Element = e} className="sketch_wrapper">
                    <P5Wrapper
                        sketch={mandelbrotSketch}
                        { ...sketchState }
                        setLoadingStart={this.setLoadingStart}
                        setLoadingComplete={this.setLoadingComplete}
                        headerHeight={this.state.headerHeight}
                        footerHeight={this.state.footerHeight}
                    />
                </main>

                <FooterComponent
                    controlItems={this.getControlMetas()}
                    applyChangesFunction={this.applyChanges}
                    footerRef={(e => this.footerSection = e)}
                    isApplyButtonDisabled={isApplyButtonDisabled}
                    isLoading={this.state.loading}
                    resetFunction={() => this.setState({ tmpSketch: {}, sketch: startSketchState})}
                    showReset={true}
                    showUpdate={true}
                />

            </div>
        );
    }
}

export default MandelbrotPageComponent;
