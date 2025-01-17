import { WebGLRenderTarget, LinearFilter, NearestFilter, RGBAFormat } from '../Three';

class Snapshot {

	constructor ( ctx, renderer ) {

		this.getSnapshot = function ( exportSize, lineScale ) {

			const container = ctx.container;
			const viewer = ctx.viewer;

			const newWidth = exportSize;
			const newHeight = Math.round( container.clientHeight * newWidth / container.clientWidth );

			const renderTarget = new WebGLRenderTarget( newWidth, newHeight, { minFilter: LinearFilter, magFilter: NearestFilter, format: RGBAFormat, stencilBuffer: true } );

			renderTarget.texture.generateMipmaps = false;
			renderTarget.texture.name = 'CV.snapshot';

			renderer.setSize( newWidth, newHeight );
			renderer.setPixelRatio( 1 );
			renderer.setRenderTarget( renderTarget );
			renderer.setClearAlpha( 1.0 );

			// reset camera and materials using renderer size/resolution
			viewer.dispatchEvent( { type: 'resized', name: 'rts', 'width': newWidth, 'height': newHeight, lineScale: lineScale } );

			viewer.renderView();

			const bSize = newWidth * newHeight * 4;
			const buffer = new Uint8ClampedArray( bSize );

			renderer.readRenderTargetPixels( renderTarget, 0, 0, newWidth, newHeight, buffer );

			// invert image
			const line = newWidth * 4;
			const invertedBuffer = new Uint8ClampedArray( bSize );

			for ( let i = 0; i < bSize; i += line ) {

				const dst = bSize - i - line;

				for ( let j = 0; j < line; j++ ) {

					invertedBuffer[ dst + j ] = buffer[ i + j ];

				}

			}

			const id = new ImageData( invertedBuffer, newWidth, newHeight );

			const canvas = document.createElement( 'canvas' );

			canvas.width = newWidth;
			canvas.height = newHeight;

			const canvasCtx = canvas.getContext( '2d' );

			canvasCtx.putImageData( id, 0, 0 );

			renderTarget.dispose();

			// restore renderer to normal render size and target
			viewer.resetRenderer();

			return canvas.toDataURL();

		};

	}

}

export { Snapshot };