//@vrandkode
window.controller = {};
(function(controller){
    var view;
    var step = 0;

    /**
     * constructor of the controller module.
     * @param {View} initView 
     */
    controller.init = function(initView){
        view = initView;
    };

    /**
     * display a message into div object with the 'message' id
     * for 2 seconds.
     * @param {string} msg 
     */
    controller.message = function(msg){
        console.log("[controller] " + msg);
        document.getElementById('message').innerHTML = msg;
        var interval = setInterval(function() {
            document.getElementById('message').innerHTML = "";
            clearInterval(interval);
        }, 2000);
    }

    // Current positions/color of points
    var pointsPositions = [];
    var pointsColors = [];

    /**
     * Call the view to draw a point to the current positions.
     */
    var drawToMousePosition = function(ev){
        var x = ev.clientX; // x coordinate of a mouse pointer
        var y = ev.clientY; // y coordinate of a mouse pointer
        var rect = ev.target.getBoundingClientRect();

        var canvas = view.canvas();
        x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
        y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

        // Store the coordinates to g_points array
        pointsPositions.push([x,y]); 

        // Store the color to g_colors array
        if(x >= 0.0 && y >= 0.0) { // First quadrant
            pointsColors.push([1.0, 0.0, 0.0, 1.0]); // Red
        } else if(x < 0.0 && y < 0.0) { // Third quadrant
            pointsColors.push([0.0, 1.0, 0.0, 1.0]); // Green
        } else { // Others
            pointsColors.push([1.0, 1.0, 1.0, 1.0]); // White
        }

        view.drawPoints(pointsPositions, pointsColors);
    }
    
    /**
     * It should be called when controller initialisation.
     */
    controller.initialization = function(){

        // Draw the canvas 
        controller.message("Initialization...");
        view.draw();

        // Register the controllers: mouse, keyboards
        controller.message("Registering mouse controller ...");
        view.canvas().onmousedown = function(mouseEvent) {
            drawToMousePosition(mouseEvent); 
        };
    }

    /**
     * call to run all the actions.
     */
    controller.runAllOperations = function(){
        controller.message("Running step ..." + step);
        controller.shrinkPoint(parseFloat("-5.0"));
        step++;
    };

    /**
     * call to shrink the current point to size or substracting if negative.
     * @param {*} size 
     */
    controller.shrinkPoint = function(size){
        view.draw({ point: { size: 1.0 * size}});
    }

}(window.controller));