//@vrandkode
/**
 * Controller representation of drawing triangle transformation.
 */
window.controller = {};

(function(controller){
    var view, self;

    var maxOperations = operations.length;

    /* Initial step */
    var step = 0;

    /**
     * constructor of the controller module.
     * @param {View} initView 
     */
    controller.init = function(initView, initContext){
        view = initView;
        self = initContext;
    };

    /**
     * It should be called when controller initialisation.
     */
    controller.initialization = function(){
        self.showMessage("Initialization...");
        self.changeTitle(view.id);
        view.draw();
    }

    /**
     * call to run all the actions.
     */
    controller.applyAll = function(){
        var isReverse = document.getElementById('inverse_order').checked;
        var startsAt = parseInt(document.getElementById("startsAt").value);

        var firstStep = 0;
        self.showMessage("Apply all... reverse: "+ isReverse + ", startsAt: " + startsAt);
        if (startsAt >= 0 && startsAt < maxOperations) {
            firstStep = startsAt;
            step = (isReverse) ? maxOperations - startsAt - 1: startsAt;
        }

        for (var k=firstStep;k<maxOperations;k++){
            controller.next(isReverse, (k + 1 == maxOperations));
        }
    };

    /**
     * Displays the transformation performed from the view into the 
     * div object called 'output'.
     */
    controller.display = function(){
        var output = view.triangle.toString("<br><br>");
        output+=view.triangle.toTable();
        document.getElementById("output").innerHTML = output;
    }

    /**
     * call to run next action.
     */
    controller.applyNext = function(){
        var isReverse = document.getElementById('inverse_order').checked;
        controller.next(isReverse, true);
    }
    
    /**
     * Trigger the step and go forward/backward. The triggering implies an transformation.
     * @param {boolean} isReverse. steps.
     * @param {boolean} triggersDraw. if we want to trigger the refresh of objects:
     * it calls the display method and drawing the current view.
     */
    controller.next = function(isReverse, triggersDraw) {
        var lastStep = step;

        controller.showMessage("Running step: " + step + "/ was " + lastStep +", reverse: " + isReverse);

        var type   = operations[step][0],
            vector = operations[step];

        // Trigger the transformation of view object.
        switch (type){
            case "t": view.triangle.translate(vector); break;
            case "s": view.triangle.scale(vector);     break;
            case "r": view.triangle.rotate(vector);    break;
            default:  break;
        }
        
        // In case of final step draws the current view
        // and show the output of transformation.
        if (triggersDraw) {
            controller.display();
            view.draw();
        }

        // go forward/backward!
        step = (step + ((isReverse) ? (maxOperations - 1) : 1)) % maxOperations;
    }

}(window.controller));