export class WebglUtils
{
    static createShaderProgram(gl: WebGL2RenderingContext, vertexShaderFile: string, fragmentShaderFile: string): WebGLProgram
    {
        console.log("loading shaders");
        
        // vertex and fragment shaders
        var vertexShader = this.compileShader(gl.VERTEX_SHADER , vertexShaderFile, gl);
        var fragmentShader = this.compileShader(gl.FRAGMENT_SHADER ,fragmentShaderFile, gl);

        var program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        // validate and print
        gl.validateProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        {
            console.error('ERROR linking program!', gl.getProgramInfoLog(program));
            return;
        }

        // validate and print
        gl.validateProgram(program);
        if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS))
        {
            console.error('ERROR validating program!', gl.getProgramInfoLog(program));
            return;
        }

        return program;
    }

    private static compileShader(shaderType: GLenum, shaderSource: string, webgl: WebGLRenderingContext): WebGLShader
    {
        var shader = webgl.createShader(shaderType);
        webgl.shaderSource(shader, shaderSource);
        webgl.compileShader(shader);

        if (!webgl.getShaderParameter(shader, webgl.COMPILE_STATUS)) {
            throw "Shader compile failed with: " + webgl.getShaderInfoLog(shader);
        }

        return shader;
    }
}