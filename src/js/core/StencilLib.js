
const StencilLib = {

	featureOnBeforeRender: function ( renderer ) {

		const stencil = renderer.state.buffers.stencil;
		const gl = renderer.context;

		stencil.setTest( true );

		stencil.setOp( gl.KEEP, gl.KEEP, gl.INCR );

	},

	featureOnAfterRender: function ( renderer ) {

		const stencil = renderer.state.buffers.stencil;

		stencil.setTest( false );


	},

	terrainOnBeforeRender: function ( renderer ) {

		const stencil = renderer.state.buffers.stencil;
		const gl = renderer.context;

		stencil.setTest( true );

		stencil.setOp( gl.KEEP, gl.KEEP, gl.KEEP );
		stencil.setFunc( gl.EQUAL, 0, 0xFFFF );

	},

	terrainOnAfterRender: function ( renderer ) {

		const stencil = renderer.state.buffers.stencil;

		stencil.setTest( false );

	}

};

export { StencilLib };