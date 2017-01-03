
import { VertexColors, ShaderMaterial, Color, TextureLoader, Vector4 } from '../../../../three.js/src/Three';
import { Shaders } from '../shaders/Shaders';
import { getEnvironmentValue } from '../core/constants';

function ExtendedPointsMaterial () {

	var c = new Color( 0xff00ff );

	ShaderMaterial.call( this, {
		uniforms: {
			diffuse: { value: c },
			opacity: { value: 1.0 },
			size: { value: 1.0 },
			scale: { value: 1.0 },
			pScale: { value: 1.0 },
			offsetRepeat: { value: new Vector4() },
			map: { value: null }
		},
		vertexShader:   Shaders.extendedPointsVertexShader,	
		fragmentShader: Shaders.extendedPointsFragmentShader,
		vertexColors: VertexColors
	} );

	this.map = new TextureLoader().load( getEnvironmentValue( "home", "" ) + "images/disc.png" );

	this.color = new Color();
	this.opacity = 1.0;
	this.alphaTest = 0.8;

	this.size = 1;
	this.scale = 1;
	this.sizeAttenuation = true;
	this.transparent = true;

	this.type = "CV.ExtendedPointsMaterial";

	this.isPointsMaterial = true;

	return this;

}

ExtendedPointsMaterial.prototype = Object.create( ShaderMaterial.prototype );

ExtendedPointsMaterial.prototype.constructor = ExtendedPointsMaterial;

export { ExtendedPointsMaterial };

// EOF