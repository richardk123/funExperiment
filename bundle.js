/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/shader/fragment.glsl":
/*!************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/shader/fragment.glsl ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (\"precision highp float;\\nuniform vec3 metaballs[100];\\nuniform int metaballsCount;\\nconst float WIDTH = 1024.0;\\nconst float HEIGHT = 768.0;\\n\\nvoid main(){\\n    float x = gl_FragCoord.x;\\n    float y = gl_FragCoord.y;\\n    float v = 0.0;\\n    for (int i = 0; i < 300; i++) {\\n        if (i >= metaballsCount)\\n        {\\n            break;\\n        }\\n        vec3 mb = metaballs[i];\\n        float dx = mb.x - x;\\n        float dy = mb.y - y;\\n        float r = mb.z;\\n\\n        vec2 metaballPos = vec2(mb.x, mb.y);\\n        vec2 pixelPos = vec2(x, y);\\n        float distance = distance(metaballPos, pixelPos);\\n        v += r*r / (distance * distance) * 250.0;\\n    }\\n\\n    float color = min(v, 255.0) / 255.0;\\n    gl_FragColor = vec4(color, 0, 0.0, 1.0);\\n}\");\n\n//# sourceURL=webpack://funexperiment/./src/shader/fragment.glsl?./node_modules/raw-loader/dist/cjs.js");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/shader/vertex.glsl":
/*!**********************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/shader/vertex.glsl ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (\"attribute vec2 position;\\n\\nvoid main() {\\n    // position specifies only x and y.\\n    // We set z to be 0.0, and w to be 1.0\\n    gl_Position = vec4(position, 0.0, 1.0);\\n}\");\n\n//# sourceURL=webpack://funexperiment/./src/shader/vertex.glsl?./node_modules/raw-loader/dist/cjs.js");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _physics__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./physics */ \"./src/physics.ts\");\n/* harmony import */ var _renderer_gpu__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./renderer-gpu */ \"./src/renderer-gpu.ts\");\n\n\nclass Application {\n    constructor() {\n        this.frame = 0;\n        this.renderer = new _renderer_gpu__WEBPACK_IMPORTED_MODULE_1__.RendererGpu();\n        this.physics = new _physics__WEBPACK_IMPORTED_MODULE_0__.Physics(this.renderer.width, this.renderer.height);\n        this.mainLoop();\n    }\n    mainLoop() {\n        this.frame++;\n        requestAnimationFrame(() => this.mainLoop());\n        console.log(this.frame);\n        if (this.frame % 2) {\n            this.physics.simulate();\n        }\n        this.renderer.render(this.physics.stars);\n        // this.renderer.renderDebugCircles(this.physics.stars);\n    }\n}\nnew Application();\n\n\n//# sourceURL=webpack://funexperiment/./src/index.ts?");

/***/ }),

/***/ "./src/physics.ts":
/*!************************!*\
  !*** ./src/physics.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Physics\": () => (/* binding */ Physics)\n/* harmony export */ });\n/* harmony import */ var vector2d__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vector2d */ \"./node_modules/vector2d/src/Vec2D.js\");\n/* harmony import */ var vector2d__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vector2d__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _star__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./star */ \"./src/star.ts\");\n\n\nclass Physics {\n    constructor(width, height) {\n        this.edgeOffset = 100;\n        this.numberOfStars = 80;\n        this.gravitationalConstant = 1000;\n        this.massStealSpeed = 500;\n        this.massStealDistanceTreashold = 0;\n        this.width = width;\n        this.height = height;\n        this.starFactory = new _star__WEBPACK_IMPORTED_MODULE_1__.StarFactory(width, height, this.edgeOffset);\n        this.stars = new Array();\n        for (let i = 0; i < this.numberOfStars; i++) {\n            this.stars.push(this.starFactory.createStarOnEdge());\n        }\n    }\n    simulate() {\n        this.stealMass();\n        this.applyGravity();\n        this.applyVelocity();\n        this.spawnStars();\n        this.splitStar();\n    }\n    spawnStars() {\n        if (this.stars.length < this.numberOfStars) {\n            this.stars.push(this.starFactory.createStarOnEdge());\n        }\n    }\n    applyGravity() {\n        this.stars.forEach(star => {\n            const accelerationVector = this.stars\n                .filter(otherStar => otherStar !== star)\n                .map(otherStar => {\n                const distance = otherStar.position.distance(star.position);\n                const force = this.gravitationalConstant * ((star.mass * otherStar.mass) / (distance * distance));\n                return otherStar.position.clone().subtract(star.position).unit().multiplyByScalar(force / star.mass);\n            })\n                .reduce((acc, cur) => acc.add(cur), new vector2d__WEBPACK_IMPORTED_MODULE_0__.Vector(0, 0));\n            star.speed.add(accelerationVector);\n        });\n    }\n    stealMass() {\n        this.stars.forEach(star => {\n            this.stars\n                .filter(otherStar => otherStar !== star)\n                .forEach(otherStar => {\n                const distance = otherStar.position.distance(star.position);\n                const radiusDistance = distance - star.radius - otherStar.radius;\n                let massToSteal = ((star.mass / otherStar.mass) / (distance * distance)) * this.massStealSpeed;\n                if (radiusDistance < this.massStealDistanceTreashold && massToSteal) {\n                    if (massToSteal > otherStar.mass) {\n                        massToSteal = otherStar.mass;\n                        const index = this.stars.indexOf(otherStar);\n                        this.stars.splice(index, 1);\n                    }\n                    // conservate momentum\n                    const starMomentum = star.speed.clone().multiplyByScalar(star.mass);\n                    const stealedMassMomentum = otherStar.speed.clone().multiplyByScalar(massToSteal);\n                    // conservate mass\n                    otherStar.mass -= massToSteal;\n                    star.mass += massToSteal;\n                    const resultSpeed = starMomentum.add(stealedMassMomentum).divideByScalar(star.mass);\n                    star.speed.x = resultSpeed.x;\n                    star.speed.y = resultSpeed.y;\n                }\n            });\n        });\n    }\n    applyVelocity() {\n        this.stars.forEach(star => {\n            // add speed\n            star.position.add(star.speed);\n            // exit the edge\n            if (star.position.x > this.width + this.edgeOffset || star.position.x < -this.edgeOffset ||\n                star.position.y < -this.edgeOffset || star.position.y > this.height + this.edgeOffset) {\n                // star.position.x = this.width - star.position.x;\n                // star.position.y = this.height - star.position.y;\n                const index = this.stars.indexOf(star);\n                this.stars.splice(index, 1);\n            }\n        });\n        const totalMomentum = this.stars.map(star => star.mass);\n        const val = Math.max(...totalMomentum);\n        document.getElementById(\"totalMomentum\").innerHTML = val.toString();\n    }\n    splitStar() {\n        this.stars.forEach(star => {\n            if (star.mass > star.explosionFrameThreshold) {\n                const index = this.stars.indexOf(star);\n                this.stars.splice(index, 1);\n                const numberOfStars = Math.trunc(star.mass);\n                const explosionSpeed = 4 * star.mass;\n                for (let i = 0; i < numberOfStars; i++) {\n                    const pos = new vector2d__WEBPACK_IMPORTED_MODULE_0__.Vector(star.position.x, star.position.y);\n                    const speed = new vector2d__WEBPACK_IMPORTED_MODULE_0__.Vector(star.speed.x, star.speed.y);\n                    const newStar = new _star__WEBPACK_IMPORTED_MODULE_1__.Star(pos, speed, star.mass / numberOfStars);\n                    const explosionDirection = new vector2d__WEBPACK_IMPORTED_MODULE_0__.Vector(1, 1).rotate(((Math.PI * 2) / numberOfStars) * i);\n                    newStar.speed.add(explosionDirection.clone().unit().mulS(explosionSpeed));\n                    newStar.position.add(explosionDirection.clone().unit().mulS(star.radius));\n                    this.stars.push(newStar);\n                }\n            }\n        });\n    }\n}\n\n\n//# sourceURL=webpack://funexperiment/./src/physics.ts?");

/***/ }),

/***/ "./src/renderer-gpu.ts":
/*!*****************************!*\
  !*** ./src/renderer-gpu.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"RendererGpu\": () => (/* binding */ RendererGpu)\n/* harmony export */ });\n/* harmony import */ var _raw_loader_shader_vertex_glsl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !!raw-loader!./shader/vertex.glsl */ \"./node_modules/raw-loader/dist/cjs.js!./src/shader/vertex.glsl\");\n/* harmony import */ var _raw_loader_shader_fragment_glsl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!raw-loader!./shader/fragment.glsl */ \"./node_modules/raw-loader/dist/cjs.js!./src/shader/fragment.glsl\");\n\n\nclass RendererGpu {\n    constructor() {\n        var canvas = document.getElementById(\"canvas\");\n        var webgl = canvas.getContext('webgl');\n        var vertexShader = this.compileShader(webgl.VERTEX_SHADER, _raw_loader_shader_vertex_glsl__WEBPACK_IMPORTED_MODULE_0__[\"default\"], webgl);\n        var fragmentShader = this.compileShader(webgl.FRAGMENT_SHADER, _raw_loader_shader_fragment_glsl__WEBPACK_IMPORTED_MODULE_1__[\"default\"], webgl);\n        var program = webgl.createProgram();\n        webgl.attachShader(program, vertexShader);\n        webgl.attachShader(program, fragmentShader);\n        webgl.linkProgram(program);\n        webgl.useProgram(program);\n        var vertexData = new Float32Array([\n            -1.0, 1.0,\n            -1.0, -1.0,\n            1.0, 1.0,\n            1.0, -1.0, // bottom right\n        ]);\n        var vertexDataBuffer = webgl.createBuffer();\n        webgl.bindBuffer(webgl.ARRAY_BUFFER, vertexDataBuffer);\n        webgl.bufferData(webgl.ARRAY_BUFFER, vertexData, webgl.STATIC_DRAW);\n        // To make the geometry information available in the shader as attributes, we\n        // need to tell WebGL what the layout of our data in the vertex buffer is.\n        var positionHandle = this.getAttribLocation(program, 'position', webgl);\n        webgl.enableVertexAttribArray(positionHandle);\n        webgl.vertexAttribPointer(positionHandle, 2, // position is a vec2\n        webgl.FLOAT, // each component is a float\n        false, // don't normalize values\n        2 * 4, // two 4 byte float components per vertex\n        0 // offset into each span of vertex data\n        );\n        this.metaballsData = this.getUniformLocation(program, 'metaballs', webgl);\n        this.metaballsCount = this.getUniformLocation(program, 'metaballsCount', webgl);\n        this.webgl = webgl;\n        this.width = canvas.width;\n        this.height = canvas.height;\n    }\n    // Utility to complain loudly if we fail to find the uniform\n    getUniformLocation(program, name, webgl) {\n        var uniformLocation = webgl.getUniformLocation(program, name);\n        if (uniformLocation === -1) {\n            throw 'Can not find uniform ' + name + '.';\n        }\n        return uniformLocation;\n    }\n    getAttribLocation(program, name, webgl) {\n        var attributeLocation = webgl.getAttribLocation(program, name);\n        if (attributeLocation === -1) {\n            throw 'Can not find attribute ' + name + '.';\n        }\n        return attributeLocation;\n    }\n    compileShader(shaderType, shaderSource, webgl) {\n        var shader = webgl.createShader(shaderType);\n        webgl.shaderSource(shader, shaderSource);\n        webgl.compileShader(shader);\n        if (!webgl.getShaderParameter(shader, webgl.COMPILE_STATUS)) {\n            throw \"Shader compile failed with: \" + webgl.getShaderInfoLog(shader);\n        }\n        return shader;\n    }\n    render(stars) {\n        // To send the data to the GPU, we first need to\n        // flatten our data into a single array.\n        var dataToSendToGPU = new Float32Array(3 * stars.length);\n        stars.forEach((star, index) => {\n            var baseIndex = 3 * index;\n            dataToSendToGPU[baseIndex + 0] = star.position.x;\n            dataToSendToGPU[baseIndex + 1] = star.position.y;\n            dataToSendToGPU[baseIndex + 2] = star.radius;\n        });\n        this.webgl.uniform3fv(this.metaballsData, dataToSendToGPU);\n        this.webgl.uniform1i(this.metaballsCount, stars.length);\n        this.webgl.drawArrays(this.webgl.TRIANGLE_STRIP, 0, 4);\n    }\n}\n\n\n//# sourceURL=webpack://funexperiment/./src/renderer-gpu.ts?");

/***/ }),

/***/ "./src/star.ts":
/*!*********************!*\
  !*** ./src/star.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Star\": () => (/* binding */ Star),\n/* harmony export */   \"StarFactory\": () => (/* binding */ StarFactory)\n/* harmony export */ });\n/* harmony import */ var vector2d__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vector2d */ \"./node_modules/vector2d/src/Vec2D.js\");\n/* harmony import */ var vector2d__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vector2d__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ \"./src/utils.ts\");\n\n\nclass Star {\n    constructor(position, speed, mass) {\n        this.position = position;\n        this.speed = speed;\n        this.mass = mass;\n        this.explosionFrameThreshold = _utils__WEBPACK_IMPORTED_MODULE_1__.Utils.randomFromInterval(5, 15);\n    }\n    get radius() {\n        return this.mass * 5;\n    }\n    distance(position) {\n        return this.position.distance(position);\n    }\n}\nclass StarFactory {\n    constructor(canvasWidth, canvasHeight, edgeOffset) {\n        this.canvasHeight = canvasHeight;\n        this.canvasWidth = canvasWidth;\n        this.edgeOffset = edgeOffset;\n    }\n    createStarOnEdge() {\n        const mass = _utils__WEBPACK_IMPORTED_MODULE_1__.Utils.randomFromInterval(0.1, 1);\n        const star = new Star(new vector2d__WEBPACK_IMPORTED_MODULE_0__.Vector(0, 0), new vector2d__WEBPACK_IMPORTED_MODULE_0__.Vector(0, 0), mass);\n        this.moveToEdgeAndSetSpeed(star);\n        return star;\n    }\n    moveToEdgeAndSetSpeed(star) {\n        const xFrozen = _utils__WEBPACK_IMPORTED_MODULE_1__.Utils.randomBool();\n        let position = new vector2d__WEBPACK_IMPORTED_MODULE_0__.Vector(0, 0);\n        if (xFrozen) {\n            const minOrMax = _utils__WEBPACK_IMPORTED_MODULE_1__.Utils.randomBool();\n            position.x = minOrMax ? -this.edgeOffset : this.canvasWidth + this.edgeOffset;\n            position.y = Math.trunc(Math.random() * this.canvasHeight);\n        }\n        else {\n            const minOrMax = _utils__WEBPACK_IMPORTED_MODULE_1__.Utils.randomBool();\n            position.x = Math.trunc(Math.random() * this.canvasWidth);\n            position.y = minOrMax ? -this.edgeOffset : this.canvasHeight + this.edgeOffset;\n        }\n        const randomPosition = new vector2d__WEBPACK_IMPORTED_MODULE_0__.Vector(this.canvasWidth * Math.random(), this.canvasHeight * Math.random());\n        const speedMagnitude = _utils__WEBPACK_IMPORTED_MODULE_1__.Utils.randomFromInterval(0.1, 0.5);\n        const speed = randomPosition.subtract(position).unit().mulS(speedMagnitude);\n        star.position = position;\n        star.speed = speed;\n    }\n}\n\n\n//# sourceURL=webpack://funexperiment/./src/star.ts?");

/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Utils\": () => (/* binding */ Utils)\n/* harmony export */ });\nclass Utils {\n    static randomFromInterval(min, max) {\n        return (Math.random() * (max - min)) + min;\n    }\n    static randomBool() {\n        return Math.random() < 0.5;\n    }\n}\n\n\n//# sourceURL=webpack://funexperiment/./src/utils.ts?");

/***/ }),

/***/ "./node_modules/vector2d/src/AbstractVector.js":
/*!*****************************************************!*\
  !*** ./node_modules/vector2d/src/AbstractVector.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\n/**\n * These values are used by the `AbstractVector.round` method to increase\n * performance vs. using  Number.toFixed.\n */\nvar precision = [\n    1,\n    10,\n    100,\n    1000,\n    10000,\n    100000,\n    1000000,\n    10000000,\n    100000000,\n    1000000000,\n    10000000000\n];\n/**\n * The class that all other vector representations are derived from.\n *\n * Contains the core implementation for all methods that will be exposed by\n * vector instances.\n *\n * Example of creating a custom implementation:\n *\n * ```ts\n * import { AbstractVector } from \"./AbstractVector\"\n *\n * export class MyCustomVector extends AbstractVector {\n *  constructor (x: number, y: number) {\n *    super(CustomVectorType)\n *  }\n * }\n * ```\n */\nvar AbstractVector = /** @class */ (function () {\n    function AbstractVector(ctor) {\n        this.ctor = ctor;\n    }\n    /**\n     * Set both x and y axis value\n     * @param x   New x val\n     * @param y   New y val\n     */\n    AbstractVector.prototype.setAxes = function (x, y) {\n        this.x = x;\n        this.y = y;\n        return this;\n    };\n    /**\n     * Getter for x the axis value\n     */\n    AbstractVector.prototype.getX = function () {\n        return this.x;\n    };\n    /**\n     * Setter for x axis value\n     */\n    AbstractVector.prototype.setX = function (x) {\n        this.x = x;\n        return this;\n    };\n    /**\n     * Getter for y axis value\n     */\n    AbstractVector.prototype.getY = function () {\n        return this.y;\n    };\n    /**\n     * Setter for y axis.\n     */\n    AbstractVector.prototype.setY = function (y) {\n        this.y = y;\n        return this;\n    };\n    /**\n     * Return the vector as a formatted string, e.g \"(0, 4)\"\n     */\n    AbstractVector.prototype.toString = function (round) {\n        if (round === void 0) { round = false; }\n        if (round) {\n            return \"(\" + Math.round(this.x) + \", \" + Math.round(this.y) + \")\";\n        }\n        return \"(\" + this.x + \", \" + this.y + \")\";\n    };\n    /**\n     * Return an Array containing the vector axes, e.g [0, 4]\n     */\n    AbstractVector.prototype.toArray = function () {\n        return [this.x, this.y];\n    };\n    /**\n     * Return an Object containing the vector axes, e.g { x: 0, y: 4 }\n     */\n    AbstractVector.prototype.toObject = function () {\n        return {\n            x: this.x,\n            y: this.y\n        };\n    };\n    /**\n     * Add the provided vector to this one\n     */\n    AbstractVector.prototype.add = function (vec) {\n        this.x += vec.x;\n        this.y += vec.y;\n        return this;\n    };\n    /**\n     * Subtract the provided vector from this one\n     */\n    AbstractVector.prototype.subtract = function (vec) {\n        this.x -= vec.x;\n        this.y -= vec.y;\n        return this;\n    };\n    /**\n     * Check if the provided vector equal to this one\n     */\n    AbstractVector.prototype.equals = function (vec) {\n        return vec.x === this.x && vec.y === this.y;\n    };\n    /**\n     * Multiply this vector by the provided vector\n     */\n    AbstractVector.prototype.multiplyByVector = function (vec) {\n        this.x *= vec.x;\n        this.y *= vec.y;\n        return this;\n    };\n    /**\n     * Multiply this vector by the provided vector\n     */\n    AbstractVector.prototype.mulV = function (vec) {\n        return this.multiplyByVector(vec);\n    };\n    /**\n     * Divide this vector by the provided vector\n     */\n    AbstractVector.prototype.divideByVector = function (vec) {\n        this.x /= vec.x;\n        this.y /= vec.y;\n        return this;\n    };\n    /**\n     * Divide this vector by the provided vector\n     */\n    AbstractVector.prototype.divV = function (v) {\n        return this.divideByVector(v);\n    };\n    /**\n     * Multiply this vector by the provided number\n     */\n    AbstractVector.prototype.multiplyByScalar = function (n) {\n        this.x *= n;\n        this.y *= n;\n        return this;\n    };\n    /**\n     * Multiply this vector by the provided number\n     */\n    AbstractVector.prototype.mulS = function (n) {\n        return this.multiplyByScalar(n);\n    };\n    /**\n     * Divive this vector by the provided number\n     */\n    AbstractVector.prototype.divideByScalar = function (n) {\n        this.x /= n;\n        this.y /= n;\n        return this;\n    };\n    /**\n     * Divive this vector by the provided number\n     */\n    AbstractVector.prototype.divS = function (n) {\n        return this.divideByScalar(n);\n    };\n    /**\n     * Normalise this vector\n     */\n    AbstractVector.prototype.normalise = function () {\n        return this.divideByScalar(this.magnitude());\n    };\n    /**\n     * For American spelling. Same as unit/normalise function\n     */\n    AbstractVector.prototype.normalize = function () {\n        return this.normalise();\n    };\n    /**\n     * The same as normalise and normalize\n     */\n    AbstractVector.prototype.unit = function () {\n        return this.normalise();\n    };\n    /**\n     * Returns the magnitude (length) of this vector\n     */\n    AbstractVector.prototype.magnitude = function () {\n        var x = this.x;\n        var y = this.y;\n        return Math.sqrt(x * x + y * y);\n    };\n    /**\n     * Returns the magnitude (length) of this vector\n     */\n    AbstractVector.prototype.length = function () {\n        return this.magnitude();\n    };\n    /**\n     * Returns the squred length of this vector\n     */\n    AbstractVector.prototype.lengthSq = function () {\n        var x = this.x;\n        var y = this.y;\n        return x * x + y * y;\n    };\n    /**\n     * Returns the dot product of this vector by another\n     */\n    AbstractVector.prototype.dot = function (vec) {\n        return vec.x * this.x + vec.y * this.y;\n    };\n    /**\n     * Returns the cross product of this vector by another.\n     */\n    AbstractVector.prototype.cross = function (vec) {\n        return this.x * vec.y - this.y * vec.x;\n    };\n    /**\n     * Reverses this vector i.e multiplies it by -1\n     */\n    AbstractVector.prototype.reverse = function () {\n        this.x = -this.x;\n        this.y = -this.y;\n        return this;\n    };\n    /**\n     * Set the vector axes values to absolute values\n     */\n    AbstractVector.prototype.abs = function () {\n        this.x = Math.abs(this.x);\n        this.y = Math.abs(this.y);\n        return this;\n    };\n    /**\n     * Zeroes the vector i.e sets all axes to 0\n     */\n    AbstractVector.prototype.zero = function () {\n        this.x = this.y = 0;\n        return this;\n    };\n    /**\n     * Returns the distance between this vector and another\n     */\n    AbstractVector.prototype.distance = function (v) {\n        var x = this.x - v.x;\n        var y = this.y - v.y;\n        return Math.sqrt(x * x + y * y);\n    };\n    /**\n     * Rotates the vetor by provided radians\n     */\n    AbstractVector.prototype.rotate = function (rads) {\n        var cos = Math.cos(rads);\n        var sin = Math.sin(rads);\n        var ox = this.x;\n        var oy = this.y;\n        this.x = ox * cos - oy * sin;\n        this.y = ox * sin + oy * cos;\n        return this;\n    };\n    /**\n     * Rounds this vector to n decimal places\n     */\n    AbstractVector.prototype.round = function (n) {\n        if (n === void 0) { n = 2; }\n        var p = precision[n];\n        // This performs waaay better than toFixed and give Float32 the edge again.\n        // http://www.dynamicguru.com/javascript/round-numbers-with-precision/\n        this.x = ((0.5 + this.x * p) << 0) / p;\n        this.y = ((0.5 + this.y * p) << 0) / p;\n        return this;\n    };\n    /**\n     * Returns a copy of this vector\n     */\n    AbstractVector.prototype.clone = function () {\n        return new this.ctor(this.x, this.y);\n    };\n    return AbstractVector;\n}());\nexports.AbstractVector = AbstractVector;\n//# sourceMappingURL=AbstractVector.js.map\n\n//# sourceURL=webpack://funexperiment/./node_modules/vector2d/src/AbstractVector.js?");

/***/ }),

/***/ "./node_modules/vector2d/src/ArrayVector.js":
/*!**************************************************!*\
  !*** ./node_modules/vector2d/src/ArrayVector.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __extends = (this && this.__extends) || (function () {\n    var extendStatics = Object.setPrototypeOf ||\n        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\n    return function (d, b) {\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nvar AbstractVector_1 = __webpack_require__(/*! ./AbstractVector */ \"./node_modules/vector2d/src/AbstractVector.js\");\n/**\n * A vector representation that stores the axes in an Array\n *\n * ```\n * const v = new Vec2D.ArrayVector(2, 5)\n * ```\n */\nvar ArrayVector = /** @class */ (function (_super) {\n    __extends(ArrayVector, _super);\n    function ArrayVector(x, y) {\n        var _this = _super.call(this, ArrayVector) || this;\n        _this.axes = [x, y];\n        _this.ctor = ArrayVector;\n        return _this;\n    }\n    Object.defineProperty(ArrayVector.prototype, \"x\", {\n        get: function () {\n            return this.axes[0];\n        },\n        set: function (x) {\n            this.axes[0] = x;\n        },\n        enumerable: true,\n        configurable: true\n    });\n    Object.defineProperty(ArrayVector.prototype, \"y\", {\n        get: function () {\n            return this.axes[1];\n        },\n        set: function (y) {\n            this.axes[1] = y;\n        },\n        enumerable: true,\n        configurable: true\n    });\n    return ArrayVector;\n}(AbstractVector_1.AbstractVector));\nexports.ArrayVector = ArrayVector;\n//# sourceMappingURL=ArrayVector.js.map\n\n//# sourceURL=webpack://funexperiment/./node_modules/vector2d/src/ArrayVector.js?");

/***/ }),

/***/ "./node_modules/vector2d/src/Float32Vector.js":
/*!****************************************************!*\
  !*** ./node_modules/vector2d/src/Float32Vector.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __extends = (this && this.__extends) || (function () {\n    var extendStatics = Object.setPrototypeOf ||\n        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\n    return function (d, b) {\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nvar AbstractVector_1 = __webpack_require__(/*! ./AbstractVector */ \"./node_modules/vector2d/src/AbstractVector.js\");\n/**\n * A vector representation that stores the axes in a Float32Array\n *\n * ```\n * const v = new Vec2D.Float32Vector(2, 5)\n * ```\n */\nvar Float32Vector = /** @class */ (function (_super) {\n    __extends(Float32Vector, _super);\n    function Float32Vector(x, y) {\n        var _this = _super.call(this, Float32Vector) || this;\n        _this.axes = new Float32Array(2);\n        _this.axes[0] = x;\n        _this.axes[1] = y;\n        return _this;\n    }\n    Object.defineProperty(Float32Vector.prototype, \"x\", {\n        get: function () {\n            return this.axes[0];\n        },\n        set: function (x) {\n            this.axes[0] = x;\n        },\n        enumerable: true,\n        configurable: true\n    });\n    Object.defineProperty(Float32Vector.prototype, \"y\", {\n        get: function () {\n            return this.axes[1];\n        },\n        set: function (y) {\n            this.axes[1] = y;\n        },\n        enumerable: true,\n        configurable: true\n    });\n    return Float32Vector;\n}(AbstractVector_1.AbstractVector));\nexports.Float32Vector = Float32Vector;\n//# sourceMappingURL=Float32Vector.js.map\n\n//# sourceURL=webpack://funexperiment/./node_modules/vector2d/src/Float32Vector.js?");

/***/ }),

/***/ "./node_modules/vector2d/src/Vec2D.js":
/*!********************************************!*\
  !*** ./node_modules/vector2d/src/Vec2D.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nfunction __export(m) {\n    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];\n}\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\n__export(__webpack_require__(/*! ./AbstractVector */ \"./node_modules/vector2d/src/AbstractVector.js\"));\n__export(__webpack_require__(/*! ./ArrayVector */ \"./node_modules/vector2d/src/ArrayVector.js\"));\n__export(__webpack_require__(/*! ./Float32Vector */ \"./node_modules/vector2d/src/Float32Vector.js\"));\n__export(__webpack_require__(/*! ./Vector */ \"./node_modules/vector2d/src/Vector.js\"));\n//# sourceMappingURL=Vec2D.js.map\n\n//# sourceURL=webpack://funexperiment/./node_modules/vector2d/src/Vec2D.js?");

/***/ }),

/***/ "./node_modules/vector2d/src/Vector.js":
/*!*********************************************!*\
  !*** ./node_modules/vector2d/src/Vector.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __extends = (this && this.__extends) || (function () {\n    var extendStatics = Object.setPrototypeOf ||\n        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\n    return function (d, b) {\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nvar AbstractVector_1 = __webpack_require__(/*! ./AbstractVector */ \"./node_modules/vector2d/src/AbstractVector.js\");\n/**\n * A vector representation that stores the axes as part of the instance itself\n *\n * ```ts\n * const v = new Vec2D.Vector(2, 5)\n * ```\n */\nvar Vector = /** @class */ (function (_super) {\n    __extends(Vector, _super);\n    function Vector(x, y) {\n        var _this = _super.call(this, Vector) || this;\n        _this._x = x;\n        _this._y = y;\n        return _this;\n    }\n    Object.defineProperty(Vector.prototype, \"x\", {\n        get: function () {\n            return this._x;\n        },\n        set: function (x) {\n            this._x = x;\n        },\n        enumerable: true,\n        configurable: true\n    });\n    Object.defineProperty(Vector.prototype, \"y\", {\n        get: function () {\n            return this._y;\n        },\n        set: function (y) {\n            this._y = y;\n        },\n        enumerable: true,\n        configurable: true\n    });\n    return Vector;\n}(AbstractVector_1.AbstractVector));\nexports.Vector = Vector;\n//# sourceMappingURL=Vector.js.map\n\n//# sourceURL=webpack://funexperiment/./node_modules/vector2d/src/Vector.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;