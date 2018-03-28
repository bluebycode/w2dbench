window.context = {};
(function(view, context, controller){

    var canvas, gl;

     /**
     * display a message into div object with the 'message' id
     * for 2 seconds.
     * @param {string} msg 
     */
    context.showMessage = function(msg, ttl){
        console.log("[controller] " + msg);
        document.getElementById('message').innerHTML = msg;
        if (ttl && ttl < 5000){
            var interval = setInterval(function() {
                document.getElementById('message').innerHTML = "";
                clearInterval(interval);
            }, ttl);
        }
    }

    context.changeTitle = function(title){
        document.getElementById('title').innerHTML = title;
    }
 
    var initialize = function(vertex_shader, fragment_shader){

        console.log('Initialisation of app "' + view.id + '" ...');
        
        // Retrieve the canvas from DOM tree
        var canvas = document.getElementById('webgl');

        // Get the rendering context for WebGL
        var gl = getWebGLContext(canvas);
        if (!gl)
            throw 'Failed to get the rendering context for WebGL';

        // Initialize shaders
        if (!initShaders(gl, vertex_shader, fragment_shader))
            throw 'Failed to initialize shaders: ';

        if (!gl.getProgramParameter(gl.program, gl.LINK_STATUS))
            throw 'WebGL compilation failed: program. \n\n' + gl.getProgramInfoLog(gl.program);

        context.gl = gl;
        context.canvas = canvas;
    }

    /**
     * String extension. string.format("{0} {1}", param1, param2);
     */
    String.prototype.format = function () {
        var a = this;
        for (var k in arguments)
            a = a.replace(new RegExp("\\{" + k + "\\}", 'g'), arguments[k]);
        return a
    }

    /**
     * Array extension. Clears the array.
     */
    Array.prototype.clear = function(){
        var a = this;
        a.length = 0;
        a = [];
    }

    try {
        initialize(view.shaders.vertex, view.shaders.fragment);
        view.init(context);
        controller.init(view,context);
    }catch (er){
        console.error(er);
    }
    
}(window.view, window.context, window.controller));