

 function AngleScale ( container ) {

	var width  = container.clientWidth;
	var height = container.clientHeight;

	var stdWidth  = HudObject.stdWidth;
	var stdMargin = HudObject.stdMargin;

	var i, l;

	var geometry = new THREE.RingGeometry( 1, 40, 36, 1, Math.PI, Math.PI );
	var c = [];

	var pNormal = new THREE.Vector3( 1, 0, 0 );
	var hues = Colours.inclinationColours;

	var vertices = geometry.vertices;

	for ( i = 0, l = vertices.length; i < l; i++ ) {

		var legNormal  = vertices[ i ].clone().normalize();
		var dotProduct = legNormal.dot( pNormal );
		var hueIndex = Math.floor( 127 * 2 * Math.asin( Math.abs( dotProduct ) ) / Math.PI );

		c[ i ] = new THREE.Color( hues[ hueIndex ] );

	}

	var faces = geometry.faces;

	for ( i = 0, l = faces.length; i < l; i++ ) {

		var f = faces[ i ];

		f.vertexColors = [ c[ f.a ], c[ f.b ], c[ f.c ] ];

	}

	geometry.colorsNeedUpdate = true;

	THREE.Mesh.call( this, geometry, new THREE.MeshBasicMaterial( { color: 0xffffff, vertexColors: THREE.VertexColors, side: THREE.FrontSide } ) );

	this.translateY( -height / 2 + 3 * ( stdWidth + stdMargin ) + stdMargin + 30 );
	this.translateX(  width / 2 - 40 - 5 );

	this.name = "CV.AngleScale";
	this.domObjects = [];

	var legend = document.createElement( "div" );

	legend.id = "angle-legend";
	legend.textContent = "Inclination";

	container.appendChild( legend );

	this.txt = legend;
	this.domObjects.push( legend );

	this.addEventListener( "removed", this.removeDomObjects );

	return this;

}

AngleScale.prototype = Object.create( THREE.Mesh.prototype );

Object.assign( AngleScale.prototype, HudObject.prototype );

AngleScale.prototype.constructor = AngleScale;

export { AngleScale };

// EOF