//@vrandkode
window.view = {};
(function(context, controller, view){

    view.id = 'point';

    var gl, canvas;

    view.gl     = function() { return gl; }
    view.canvas = function() { return canvas; }

    view.init = function(context){
        gl = context.gl;
        canvas = context.canvas;
    };

    view.shaders = {
        
        vertex:  
        'attribute vec4 a_Position; \n' + // Gets vertex coordinates
        'attribute float a_PointSize; \n' + // Gets vertex coordinates
        'void main() {\n' +
        '  gl_Position = a_Position; \n' +
        '  gl_PointSize = a_PointSize; \n' +
        '}\n',

        fragment: 
        'void main() {\n' +
        '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); \n' + // Sets the point color
        '}\n'
    }

    // model
    var point = { size: 100.0 };
    
    var normOptions = function(options){
        var opts = options || { };
        opts.flags = opts.flags || { refresh: true };
        opts.point = opts.point || { };
        return opts;
    }

    // Set the color for clearing <canvas>
    // Clear <canvas>
    view.clear = function(){
        console.log("Clean canvas...");
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        //gl.clear(gl.COLOR_BUFFER_BIT);
    }

    view.drawPoint = function(positions){
        view.clear();
        var current = gl.getAttribLocation(gl.program, 'a_Position');
        for (var i = 0; i < positions.length; i+=2) {
            var xy = positions[i];

            // Pass the position of a point to current a_Position variable
            gl.vertexAttrib3f(current, xy[0], xy[1], 0.0);

            // Draw a point
            gl.drawArrays(gl.POINTS, 0, 1);
        }
    }


    view.draw = function(options) {
        var opts = normOptions(options);

        // example: http://0-proquestcombo.safaribooksonline.com.jabega.uma.es/book/animation-and-3d/9780133364903/chapter-3dot-drawing-and-transforming-triangles/ch03lev1sec2_html#X2ludGVybmFsX0h0bWxWaWV3P3htbGlkPTk3ODAxMzMzNjQ5MDMlMkZjaDAybGV2MXNlYzRfaHRtbCZxdWVyeT0=
        console.log("Drawing point...");
        // These variables must be allocated in GPU RAM memory to be retrieved from CPU
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getAttribLocation
        // gl.getAttribLocation(gl.program, 'point_position') returns the location of an attribute
        // given by the compiled program (after linked vertex shader and a fragment shader).
    
        // These variables passes data that can differ for each vertex
        var js_position    = gl.getAttribLocation(gl.program, 'a_Position');
        var js_pointSize    = gl.getAttribLocation(gl.program, 'a_PointSize');
    
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getUniform
        // gl.getUniform. returns the value of a uniform variable at a given location
        console.log("Position:\t" + js_position);
      
        // https://www.khronos.org/registry/OpenGL-Refpages/es2.0/xhtml/glVertexAttrib.xml
        // Pass vertex position to attribute variable
        gl.vertexAttrib3f('a_Position', 0.0, 0.0, 0.0);
        

        if (opts.point.size) {
            point.size = Math.max(point.size + opts.point.size, 0);
            gl.vertexAttrib1f('a_PointSize', point.size);
        }else{
            gl.vertexAttrib1f('a_PointSize', point.size);
        }
        controller.message("point size: " + point.size);
        
        // Clear canvas
        if (opts.flags.refresh)
            view.clear();

        // Draw a point
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}(window.context, window.controller, window.view));
