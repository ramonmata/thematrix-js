/* 
    Ramon Mata - 2017
    Website: ramon.mata.com.mx
    GitHub: github.com/ramonmata

    The Matrix Code
    Written entirely with JS without depdencies, making use of Canvas API
    
    Press ESC to pause/unpause the animation
    If paused, try pressing space bar to render one frame
    
*/

var Matrix = (function () {

    var config = {
        containerId: null,
        charSize: 80,
        padding: 6,
        width: window.innerWidth,
        height: window.innerHeight
    }

    var animationConfig = {
        resizing : false,
        initComplete: false,
        stopped: false,
        animationFrameId: null
    }

    var containerElement = null
    var canvasElement = null
    var canvasContext = null
    var lines = []

    var init = function (newConfig) {
        config = newConfig
        if (config.containerId){
            setupContainer()
            setupListeners()
            start()
        } else{
            throw "Missing containerId reference in config parameters!"
        }
    };

    function setupContainer() {
        containerElement = document.getElementById(config.containerId)
        removeElementChildren(containerElement)
        setupCanvas()
        containerElement.appendChild(canvasElement)
    }

    function setupCanvas() {
        canvasElement = document.createElement('canvas')
        canvasElement.setAttribute('width', config.width)
        canvasElement.setAttribute('height', config.height)
        canvasElement.setAttribute('style', 'display:block')
        canvasContext = canvasElement.getContext('2d');
    }

    function setupListeners() {
        window.addEventListener('keyup', function(keyEvent) {
            switch (keyEvent.key) {
                case ' ':
                    if (animationConfig.stopped) {
                        render()
                    }
                    break;
                case 'Escape':
                    if (animationConfig.stopped) {
                        unpause()
                    } else {
                        pause()
                    }
                    break;
                default:
                    break;
            }
        }, true)
        
        window.addEventListener('resize', resize, true)
    }

    function resize() {
        pause()
        if (!animationConfig.resizing) {
            animationConfig.resizing = true
            setTimeout(function() {
                config.width = window.innerWidth
                config.height = window.innerHeight
                canvasElement.setAttribute('width', config.width)
                canvasElement.setAttribute('height', config.height)
                animationConfig.resizing = false
                unpause()
            }, 700)
        }
    }

    function removeElementChildren(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild)
        }
    }

    function start() {
        maxIndex = 0
        lines = []
        for (var i = 0; config.padding + (i * config.charSize) < config.width; i++) {
            lines.push(new MatrixLine((i * (config.charSize + config.padding))))
            maxIndex++;
        }
        animationConfig.initComplete = true
        unpause()
    }

    function pause () {
        cancelAnimationFrame(animationConfig.animationFrameId)
        animationConfig.animationFrameId = null
        animationConfig.stopped = true
    };

    function unpause () {
        if (!animationConfig.animationFrameId) {
            animationConfig.stopped = false
            animationConfig.animationFrameId = requestAnimationFrame(render)
        }
    };

    function render() {
        var completed = []

        canvasContext.globalAlpha = 0.85
        canvasContext.fillStyle = 'rgb(0, 0, 0)'
        canvasContext.fillRect(0, 0, config.width, config.height)
        canvasContext.globalAlpha = 1;

        lines.forEach(function(element, index) {
            element.render()
            if (element.isComplete()) {
                completed.push(index)
            }
        }, this);

        completed.forEach(function(position) {
            lines[position] = new MatrixLine( (position*(config.charSize+config.padding)) )
        })

        if (!animationConfig.stopped) {
            animationConfig.animationFrameId = requestAnimationFrame(render)
        }
    }

    var MatrixCode = function (index) {
        var color = (index==1) ? 'rgb(165, 255, 165)' : 'rgb(0, 195, 0)'
        var speed = Math.random()
        var matrixChar = getRandomCharCode()

        function render (x, y) {
            speed += Math.random()
            if (speed >= 1.5) {
                speed = 0
                matrixChar = getRandomCharCode()
            }
            canvasContext.font = 'bold ' + config.charSize + 'px sans-serif'
            canvasContext.textBaseline = 'middle'
            canvasContext.fillStyle = color
            canvasContext.fillText(matrixChar, x, y)
        }

        function getRandomCharCode() {
            var min = 0x30a0 // Katakana unicode start/end
            var max = 0x30ff
            return String.fromCharCode(range(min, max))
        }

        return {
            render: render
        }
    }

    var MatrixLine = function (column) {
        var matrixCharsLine = []
        var elements = range(20, 60)
        var x = column
        var y = -( (elements * config.charSize) )
        var speed = Math.random()

        // fill with matrix chars
        for (var i=0; i<elements; i++) {
            matrixCharsLine.push(new MatrixCode(elements-i))
        }

        function render() {
                for (i = elements - 1; i >= 0 && (y + (i * config.charSize)) >= 0; i--) {
                    matrixCharsLine[i].render(x, Math.floor(y + (i * config.charSize)))
                }
                y += config.charSize*speed
        }

        function isComplete() {
            if (y>=(config.height+config.charSize)) {
                return true
            } else {
                return false
            }
        }

        return {
            render: render,
            isComplete: isComplete
        }
    }

    function range(min, max) {
        return Math.floor(Math.random()*(max-min+1)+min)
    }

    return {
        init: init
    }
})();

window.addEventListener('load', function(){
    Matrix.init({
        containerId: 'canvas',
        charSize: 12,
        padding: 7,
        width: window.innerWidth,
        height: window.innerHeight
    }) // Setup Matrix
}, true)
