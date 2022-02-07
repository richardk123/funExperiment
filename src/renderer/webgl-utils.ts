export class WebglUtils
{
    static createShaderProgram(gl: WebGL2RenderingContext, vertexShaderFile: string, fragmentShaderFile: string): WebGLProgram
    {
        console.log("loading shaders");
        
        // vertex and fragment shaders
        const vertexShader = this.compileShader(gl.VERTEX_SHADER , vertexShaderFile, gl);
        const fragmentShader = this.compileShader(gl.FRAGMENT_SHADER ,fragmentShaderFile, gl);

        const program = gl.createProgram();
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

    private static compileShader(shaderType: GLenum, shaderSource: string, gl: WebGLRenderingContext): WebGLShader
    {
        const shader = gl.createShader(shaderType);
        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw "Shader compile failed with: " + gl.getShaderInfoLog(shader);
        }

        return shader;
    }

    
    // Utility to complain loudly if we fail to find the uniform
    public static getUniformLocation(program, name, gl: WebGLRenderingContext): WebGLUniformLocation {
        var uniformLocation = gl.getUniformLocation(program, name);
        if (uniformLocation === -1) {
            throw 'Can not find uniform ' + name + '.';
        }
        return uniformLocation;
    }

    // Utility to complain loudly if we fail to find the attribute
    public static getAttribLocation(program, name, gl: WebGLRenderingContext) {
        var attributeLocation = gl.getAttribLocation(program, name);
        if (attributeLocation === -1) {
            throw 'Can not find attribute ' + name + '.';
        }
        return attributeLocation;
    }
}