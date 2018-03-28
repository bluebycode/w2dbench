//@vrandkode
window.view = {};
(function(view){

    view.id = 'triangle_test';

    /**
     * WebGl Context.
     */
    var gl;

    /**
     * View constructor
     * @param {object} canvas context created in engine script.
     */
    view.init = function(context){
        gl = context.gl;
    };

    /**
     * Shaders specification: vertex + fragment.
     */
    view.shaders = {
        vertex: 
        'attribute vec4 point_position; \n' + // Gets vertex coordinates
        'attribute vec4 point_color; \n' + // Gets vertex color
        'varying vec4 frag_color; \n' + // Pass color to fragment shader
        'uniform mat4 mat_transfo; \n' +
        'uniform int point_ejes; \n' +
        'void main() {\n' +
        'if (point_ejes == 1) { \n' +
        '  gl_Position = point_position; \n' +
        '  frag_color = vec4(0.0, 0.0, 0.0, 1.0); \n' +
        ' } else { \n' +
        '  gl_Position = mat_transfo * point_position;\n' + // Set the vertex coordinates of the point
        '  frag_color = point_color;\n' + // Color fed from buffer goes to fragment shader
        ' } \n' +
        '}\n',

        fragment: 
        'precision mediump float; \n' +
        'varying vec4 frag_color; \n' +
        'void main() {\n' +
        '  gl_FragColor = frag_color; \n' + // Sets the point color
        '}\n'
    }


    /**
     * Triangle view model.
     */
    view.triangle = {

        /**
         * Model representation in few vertex coordinates and color.
         */
        model: new Float32Array ( 
            // Vertex coordinates and color
            [ -0.3,0.3,/* */ 1.0,0.0,0.0,     // 1st vertex
              -0.3,0.1,/* */ 0.0,1.0,0.0,     // 2nd vertex
               0.0,0.3,/* */ 0.0,0.0,1.0]),   // 3rd vertex

        /**
         * Resources initialisation. Call this before draw().
         */
        init: function(){
            this.buffer = gl.createBuffer();
            if (!this.buffer) 
                throw 'error: creating triangle buffer';

            if (!this.matrix) {
                var matriz  = new Matrix4();
                matriz.setIdentity();
                this.matrix_info = 'init';
                this.transform(matriz);
            }
        },
        
        /**
         * Draw the view of the triangle.
         */
        draw: function(attr){
            var triangle = this;

            var block = triangle.model.BYTES_PER_ELEMENT;
            gl.bindBuffer(gl.ARRAY_BUFFER, triangle.buffer);
            gl.bufferData(gl.ARRAY_BUFFER, triangle.model, gl.STATIC_DRAW);

            // dump the position of vertices vector pointer
            gl.vertexAttribPointer(attr.position, 2, gl.FLOAT, false, block * 5, 0);
            gl.enableVertexAttribArray(attr.position);

            // dump the color vector pointer
            gl.vertexAttribPointer(attr.color, 3, gl.FLOAT, false, block * 5, block * 2);
            gl.enableVertexAttribArray(attr.color);

            // isAxis: false
            gl.uniform1i(attr.isAxis, 0);

            // Transformations
            gl.uniformMatrix4fv(attr.transformation, false, triangle.matrix.elements);

            // draw the vertex vector
            gl.drawArrays(gl.TRIANGLES, 0, 3); // draw the number of vertices
        },

        /**
         * Translate the triangle: configuration given by 2nd and 3rd position of vector
         * passed as argument.
         */
        translate : function(vector){
            var matriz  = new Matrix4();
            matriz.setIdentity();
            var x_value = vector[1]/100.0;
            var y_value = vector[2]/100.0;
            matriz.translate(x_value, y_value, 0);
            this.transform(matriz);
            this.triangle.log("{0} {1}".format(x_value.toString(), y_value.toString()));
        },
    
        /**
         * Scales the triangle: configuration given by 4rd and 5th position of vector
         * passed as argument.
         */
        scale : function(vector){
            var matriz  = new Matrix4();
            matriz.setIdentity();
            var x_scale = vector[3];
            var y_scale = vector[4];
            matriz.scale(x_scale, y_scale,1);
            this.transform(matriz);
            this.log("{0} {1}".format(x_scale.toString(), y_scale.toString()));
        },
    
         /**
         * Rotates the triangle: configuration given by 6th-8th
         * passed as argument.
         */
        rotate : function(vector){
            var matriz  = new Matrix4();
            matriz.setIdentity();
            var rot_angle = vector[5];
            var rot_x_axis = vector[6];
            var rot_y_axis = vector[7];
            matriz.rotate(rot_angle, rot_x_axis, rot_y_axis,1);
            this.transform(matriz);
            this.log("{0} {1}".format(rot_angle.toString(), rot_x_axis.toString()));
        },

        /**
         * Set the new matrix of transformation.
         */
        transform: function(matrix){
            this.matrix_info = 'transform';
            this.matrix = matrix;
        },
        /**
         * Reset the matrix transformation to initial state.
         */
        reset: function(){
            var matriz  = new Matrix4();
            matriz.setIdentity();
            this.matrix_info = 'reset';
            this.transform(matriz);
        },

        /**
         * Release the resources and delete the buffer.
         */
        release: function(){
            gl.deleteBuffer(this.buffer);
            this.matrix = null;
            this.buffer = null;
            this.history.clear();
        },
        /**
         * Log the transformation performed.
         */
        log: function(operation){
            this.history.push("M{0} = {1}".format(this.history.length, operation));
        },
        /**
         * Returns a string representation of transformation performed before be released. 
         * Please call this before the general draw or release method.
         */
        toString: function(sep){
            return this.history.reduce((as,s) => as + ((sep) ? sep : " ") +  s);
        },
        /**
         * Returns a html table representation of matrix transformation performed before be released. 
         * Please call this before the general draw or release method.
         */
        toTable: function(){
            if (!this.matrix||!this.matrix.elements) return '';

            var row = function(e, n, m) {
                return "<tr><td>" + e[n] + "</td><td>" + e[m + n]+ "</td><td>" + e[2*m + n] + "</td><td>" + e[3*m +n] + "</td></tr><br><br>";
            }
            var output = "<table style=\"text-align: left;\" border=\"1\" cellpadding=\"2\" cellspacing=\"2\"><tbody>";
    
            var formatted = [];
            for (var n in this.matrix.elements){
                formatted.push(this.matrix.elements[n].toString().replace('.',','));
            }
    
            for (k=0; k<formatted.length/4; k++) {
                output += row(formatted,k,4);
            }
            
            output += "</tbody></table><br><br>";
            return output;
        },
        
        history: [],
        matrix: null,
        matrix_info : '',
        buffer: null
    }

    /**
     * Cartesian axis view model.
     */
    view.cartesianAxis = {

        model: new Float32Array (
            [   /* - x */ -1.0, 0.0, 
                /*   x */  1.0, 0.0, 
                /* - y */  0.0,-1.0, 
                /*   y */  0.0, 1.0]),

        init: function(){
            this.buffer = gl.createBuffer();
            if (!this.buffer) 
                throw 'error: creating axis buffer';
        },
         /**
         * Draw the cartesian axis defined in view.model.axis from the position defined 
         * from the vertex shader attributes: point_position(position) and point_ejes (draw mode).
         * @param {gl attr object} contains position or isAxis
         */
        draw: function(attr) {
            var axis = this;

            // Makes the vertex buffer the active one set to target
            gl.bindBuffer(gl.ARRAY_BUFFER, axis.buffer);

            // Copy data to byffer from axis vector
            gl.bufferData(gl.ARRAY_BUFFER, axis.model, gl.STATIC_DRAW);

            // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
            // Use the buffer object. Binds the buffer currently bound to gl.ARRAY_BUFFER to a generic vertex attribute of the 
            // current vertex buffer object and specifies its layout.
            // 
            // gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
            //   stride: specifying the offset in bytes between the beginning of consecutive vertex attributes.
            //   offset: specifying an offset in bytes of the first component in the vertex attribute array. 
            //           Must be a multiple of type.
            // All buffers with enabled variables will be accessed when drawArrays/Elements called.
            //gl.vertexAttribPointer(js_position, 2, gl.FLOAT, false, view.model.vertices.BYTES_PER_ELEMENT * 5, 0);
            gl.vertexAttribPointer(attr.position, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(attr.position); // Enable assignment to variable

            // Set attribute of axis = 1
            gl.uniform1i(attr.isAxis, 1);

            //Draws cartesian axis
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.LINES, 0, 4);
        },
        release: function(){
            gl.deleteBuffer(this.buffer);
        },
        buffer: null
    }

    
    /**
     * Draw the general view including triangles defined and cartesian axis.
     * 
     * @param {object} specific configuration.
     */
    view.draw = function(options)
    {
        var opts = options || { };
        opts.flags = opts.flags || { refresh: true };
    
        // These variables must be allocated in GPU RAM memory to be retrieved from CPU
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getAttribLocation
        // gl.getAttribLocation(gl.program, 'point_position') returns the location of an attribute
        // given by the compiled program (after linked vertex shader and a fragment shader).

        // These variables passes data that can differ for each vertex
        var js_position    = gl.getAttribLocation(gl.program, 'point_position');
        var js_color       = gl.getAttribLocation(gl.program, 'point_color');

        // These variables passes data that is the same for each vertex
        //var js_mat_transfo = gl.getUniformLocation(gl.program, 'mat_transfo');
        var js_axis        = gl.getUniformLocation(gl.program, 'point_ejes');
        var js_mat_transfo = gl.getUniformLocation(gl.program, 'mat_transfo');

        // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getUniform
        // gl.getUniform. returns the value of a uniform variable at a given location
        /*console.log("Position:\t" + js_position + "\n" +
            "Color:\t" + js_color + "\n" +
            "Axis:\t" + gl.getUniform(gl.program,js_axis) + "\n\n" +
            "Matrix transformation:\t" + gl.getUniform(gl.program,js_mat_transfo) + "\n"
        );*/

        // Clear canvas
        if (opts.flags.refresh)
            view.clear();

        console.log("Drawing the cartesian axis");
        view.cartesianAxis.init();
        view.cartesianAxis.draw({ position: js_position, isAxis: js_axis });

        console.log("Drawing the triangle...");
        view.triangle.init();
        view.triangle.draw({ 
            position: js_position, 
            color: js_color, 
            transformation: js_mat_transfo,
            isAxis: js_axis });

        // Cleanup before exiting        
        gl.disableVertexAttribArray(js_position);
        gl.disableVertexAttribArray(js_color);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        view.cartesianAxis.release();
        view.triangle.release();
    }
   
    /**
     * Clear canvas given the specification.
     * @param {object} configuration.
     */
    view.clear = function(opts){
        console.log("Clean canvas...");
        gl.clearColor(0.9, 1.0, 1.0, 1.0);
        //gl.clearColor(0.0, 0.0, 0.0, 1.0); // black
        gl.clear(gl.COLOR_BUFFER_BIT);
    }
    
}(window.view));
