import React from 'react';
import { toNdec } from "../util";
import loaderGif from "../images/loader.gif";


const ControlsComponent = ({ controlItems }) => (
    <div className="controls">
        {
            controlItems.map( item => {
                    const value = toNdec(this.state.sketch[item.stateAttributeName], item.displayPrecision);
                    const tmpValue = toNdec(this.state.tmpSketch[item.stateAttributeName], item.displayPrecision);
                    const valueString = !!tmpValue ? `${value} ⟶ ${tmpValue}`: value;
                    return <div key={item.stateAttributeName}>
                        <div>
                            {item.label}
                        </div>
                        <div>
                            ({ valueString })
                        </div>
                        <div>
                            {this.createStateSlider(item)}
                        </div>
                    </div>
                }
            )
        }
    </div>
);


const FooterComponent = (
    {
        isLoading, footerRef,
        controlItems, isApplyButtonDisabled,
        showReset=true, showUpdate=true,
        resetFunction, applyChangesFunction
    }) => (
    <footer ref={footerRef}>
        {/*<footer ref={(e => this.footerSection = e)}>*/}

        <ControlsComponent controlItems={controlItems} />

        <div className="small-button-section">
            <div className={`loading-icon ${isLoading? 'show': 'hide'}`}>
                <img src={loaderGif} alt="Loading" />
            </div>
            {
                showUpdate && !isLoading &&
                <div className="update-button">
                    <button onClick={applyChangesFunction} disabled={isApplyButtonDisabled}>
                        Apply changes
                    </button>
                </div>
            }
            {
                showReset &&
                <div className="update-button">
                    {/*<button onClick={() => this.setState({ tmpSketch: {}, sketch: startSketchState})}>*/}
                    <button onClick={resetFunction}>
                        Reset
                    </button>
                </div>
            }
        </div>
    </footer>
);

export default FooterComponent;