export const demoSketch = p => {

    let rotation = 45;

    p.setup = function () {
        p.createCanvas(window.innerWidth, window.innerHeight-100, p.P2D);
        p.angleMode(p.DEGREES);
        p.background(0);
        p.rectMode(p.CENTER)
    };

    p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
        if (props.rotation){
            rotation = props.rotation;
            console.log()
        }
    };

    p.draw = function () {
        p.background(0);

        p.push();
        p.noStroke();
        p.fill(127);
        p.rotate(rotation);
        p.rect(0, 0, 100, 100, 20);
        p.pop();

        p.push();
        p.noStroke();
        p.fill(100, 0, 255);
        p.translate(200, 200);
        p.rotate(-rotation);
        p.ellipse(0, 0, 50, 100);
        p.pop();
    };
};