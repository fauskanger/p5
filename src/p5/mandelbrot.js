import * as M from 'mathjs';

let showLoading = () => undefined;
let hideLoading = () => undefined;

export const mandelbrotSketch = p => {

    let lessThanInfinity = 16;
    let maxIterations = 50;
    let colorOffset = -20;
    let colorEaseExponent = 0.55;


    let startImBounds = p.createVector(-1.2, 1.2);
    let startReBounds = p.createVector(-1.85, 0.6);
    let imBounds = undefined;
    let reBounds = undefined;
    let easedMaxIterations = undefined;

    let setupComplete = false;  // Setup is done (i.e. canvas created etc)
    let initialized = false;    // Pixel grid created, iterations etc.
    let pixels = [];

    const allPixelsCoordsGenerator = function* () {
        if (!initialized) {
            return;
        }
        for (let row = 0; row < p.height; row++) {
            for (let col = 0; col < p.width; col++) {
                yield pixels[row][col];
            }
        }
    };

    const mapToBounds = (col, row) => {
        return {
            re: p.map(col, 0, p.width, reBounds.x, reBounds.y),
            im: p.map(row, 0, p.height, imBounds.x, imBounds.y)
        }
    };

    const computePixelGrid = async () => {
        console.log('Computing pixels for ' + p.width + 'x' + p.height);
        for (let row = 0; row < p.height; row++) {
            pixels[row] = new Array(p.width);
            for (let col = 0; col < p.width; col++) {
                const { re, im } = mapToBounds(col, row);
                const nIterations = getIterationCount(re, im);
                const color = p.map(M.pow(nIterations, colorEaseExponent), 0, easedMaxIterations, 0, 255);
                pixels[row][col] = {
                    col, row,
                    re, im,
                    nIterations,
                    color
                };
            }
        }
    };

    const getIterationCount = (cRe, cIm) => {
        let c = M.complex(cRe, cIm);
        let z = M.complex(0, 0);
        for (let i = 0; i < maxIterations; i++) {
            z = z.pow(2).add(c);
            if (M.square(z.re) + M.square(z.im) > lessThanInfinity) {
                return i;
            }
        }
        return maxIterations;
    };

    const computeBounds = async () => {
        // Must be called after p.createCanvas for p.height/width to have been set correctly
        const widthByHeight = p.width / p.height;
        if (widthByHeight > startImBounds.mag() / startReBounds.mag()) {
            // Compute width from height
            imBounds = startImBounds;
            const reWidth = (imBounds.y - imBounds.x) * widthByHeight;
            const reMidPoint = (startReBounds.y - startReBounds.x) / 2 + startReBounds.x;
            reBounds = p.createVector(reMidPoint - reWidth / 2, reMidPoint + reWidth / 2);
        } else {
            // Compute height from width
            reBounds = startReBounds;
            const imMidPoint = (startImBounds.y - startImBounds.x) / 2 + startImBounds.x;
            const imHeight = (reBounds.y - reBounds.x) / widthByHeight;
            imBounds = p.createVector(imMidPoint - imHeight / 2, imMidPoint + imHeight / 2);
        }

        console.log('Re axis: ', reBounds.x, ' - ', reBounds.y);
        console.log('Im axis: ', imBounds.x, ' - ', imBounds.y);
        console.log('Pixel dimensions: ', window.innerWidth, 'x', window.innerHeight-100);
    };


    const _asyncComputeValues = async () => {
        if (!setupComplete) {
            return;
        }

        showLoading();
        console.log('Starting new calculations');

        console.log('params: ', {
            startReBounds,
            startImBounds,
            maxIterations,
            colorEaseExponent
        });
        easedMaxIterations = M.pow(maxIterations, colorEaseExponent);
        await computeBounds();
        console.log('Starting to count iterations for all pixels');
        await computePixelGrid();
        console.log('New values have been computed');
        initialized = true;
        p.redraw();
        hideLoading();
    };

    const recomputeValues = () => {
        _asyncComputeValues().then(() => console.log('Done'));
    };

    p.setup = function () {
        p.createCanvas(window.innerWidth, window.innerHeight-100, p.P2D);
        // p.frameRate(0.1);
        p.noLoop();
        p.angleMode(p.DEGREES);
        p.background(0);
        p.rectMode(p.CENTER);
        p.colorMode(p.HSB);
        setupComplete = true;
        // Do the stuff
        recomputeValues();
    };

    p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
        const {
            reMin,
            reMax,
            imMin,
            imMax,
            maxIterations: maxIterProp,
            colorEaseExponent: colorEaseProp,
            setLoadingStart,
            setLoadingComplete
        } = props;
        let anyChanges = false;
        showLoading = setLoadingStart;
        hideLoading = setLoadingComplete;
        if (startReBounds.x !== reMin || startReBounds.y !== reMax) {
            startReBounds = p.createVector(reMin, reMax);
            anyChanges = true;
        }
        if (startImBounds.x !== imMin || startImBounds.y !== imMax) {
            startImBounds = p.createVector(imMin, imMax);
            anyChanges = true;
        }
        if (maxIterations !== maxIterProp) {
            maxIterations = maxIterProp;
            anyChanges = true;
        }
        if (colorEaseExponent !== colorEaseProp) {
            colorEaseExponent = colorEaseProp;
            anyChanges = true;
        }
        if (anyChanges) {
            console.log('New props: ', props);
            console.log('FrameCount: ', p.frameCount);
            recomputeValues();
        }
    };

    p.draw = function () {
        p.background(0);

        if (initialized) {
            for (const {col, row, color} of allPixelsCoordsGenerator()) {
                const offsetColor = (color + colorOffset) % 255;
                p.stroke(offsetColor, p.map(color, 0, 255, 100, 200), 255 - color);
                p.point(col, row);
            }
        }
    };
};