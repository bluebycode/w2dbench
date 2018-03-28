//@vrandkode
window.controller = {};
(function(controller){
    var view;
    var step = 0;

    controller.init = function(initView){
        view = initView;
    };

    controller.message = function(msg){
        console.log("[controller] " + msg);
        document.getElementById('message').innerHTML = msg;
        var interval = setInterval(function() {
            document.getElementById('message').innerHTML = "";
            clearInterval(interval);
        }, 2000);
    }

    var mousePointerLocationPoints = [];
    var drawToMousePosition = function(ev){
        var x = ev.clientX; // x coordinate of a mouse pointer
        var y = ev.clientY; // y coordinate of a mouse pointer
        var rect = ev.target.getBoundingClientRect();

        var canvas = view.canvas();
        x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
        y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

        // Store the coordinates to g_points array
        mousePointerLocationPoints.push([x,y]); 
        view.drawPoint(mousePointerLocationPoints);
    }
    
    controller.initialization = function(){
        controller.message("Initialization...");
        view.draw();

        controller.message("Registering mouse controller ...");
        view.canvas().onmousedown = function(mouseEvent) {
            drawToMousePosition(mouseEvent); 
        };
    }

    controller.runAllOperations = function(){
        controller.message("Running step ..." + step);
        controller.shrinkPoint(parseFloat("-5.0"));
        step++;
    };

    function isFloat(n){
        return Number(n) === n && n % 1 !== 0;
    }

    controller.shrinkPoint = function(size){
        view.draw({ point: { size: 1.0 * size}});
    }

}(window.controller));