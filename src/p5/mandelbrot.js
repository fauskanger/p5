import * as M from 'mathjs';

export const mandelbrotSketch = p => {

    let lessThanInfinity = 16;
    let maxIterations = 200;
    let colorOffset = -20;
    let colorEaseExponent = 0.55;
    let easedMaxIterations = M.pow(maxIterations, colorEaseExponent);
    // let sqrtMaxIterations = M.sqrt(maxIterations);


    let startImBounds = p.createVector(-1.2, 1.2);
    let startReBounds = p.createVector(-1.85, 0.6);
    let imBounds = undefined;
    let reBounds = undefined;
    let reMidPoint = -0.5;
    let imMidPoint = 0;

    let pixels = [];

    const allPixelsCoordsGenerator = function* () {
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

    const initPixelGrid = () => {
        for (let row = 0; row < p.height; row++) {
            pixels[row] = new Array(p.width);
            for (let col = 0; col < p.width; col++) {
                const { re, im } = mapToBounds(col, row);
                const nIterations = getIterationCount(re, im);
                // const color = p.map(M.sqrt(nIterations), 0, sqrtMaxIterations, 0, 255);
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
            // if (z.re * z.re + z.im * z.im > 100) {
                return i;
            }
        }
        return maxIterations;
    };

    const initBounds = () => {
        // Must be called after p.createCanvas for p.height/width to have been set correctly
        const widthByHeight = p.width / p.height;
        if (widthByHeight > startImBounds.mag() / startReBounds.mag()) {
            // Compute width from height
            imBounds = startImBounds;
            const reWidth = (imBounds.y - imBounds.x) * widthByHeight;
            reBounds = p.createVector(reMidPoint - reWidth / 2, reMidPoint + reWidth / 2);
        } else {
            // Compute height from width
            reBounds = startReBounds;
            const imHeight = (reBounds.y - reBounds.x) / widthByHeight;
            imBounds = p.createVector(imMidPoint - imHeight / 2, imMidPoint + imHeight / 2);
        }

        console.log('Re axis: ', reBounds.x, ' - ', reBounds.y);
        console.log('Im axis: ', imBounds.x, ' - ', imBounds.y);
        console.log('Pixel dimensions: ', window.innerWidth, 'x', window.innerHeight-100);
    };

    p.setup = function () {
        p.createCanvas(window.innerWidth, window.innerHeight-100, p.P2D);
        p.frameRate(0.1);
        p.angleMode(p.DEGREES);
        p.background(0);
        p.rectMode(p.CENTER);
        p.colorMode(p.HSB);
        initBounds();
        initPixelGrid();

    };

    p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
        if (props.maxIterations){
            maxIterations = props.maxIterations;
            console.log('Set maxIterations: ' + maxIterations);
        }
    };

    p.draw = function () {
        p.background(0);

        for (const { col, row, color } of allPixelsCoordsGenerator()) {
            const offsetColor = (color + colorOffset) % 255;
            p.stroke(offsetColor, p.map(color, 0, 255, 100, 200), 255-color);
            p.point(col, row);
        }
    };
};