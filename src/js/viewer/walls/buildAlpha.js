import {
	FACE_ALPHA, LEG_SPLAY, FACE_WALLS, LEG_CAVE
} from '../../core/constants';

import { WorkerPool } from '../../core/WorkerPool';

import { Walls } from './Walls';

import { Float32BufferAttribute } from '../../Three';

function getSplays( survey, segments ) {

	const stations = survey.stations;
	const splayLineSegments = survey.getFeature( LEG_SPLAY );
	const splays = splayLineSegments.geometry.vertices;

	var i, j;

	for ( i = 0; i < splays.length; i += 2 ) {

		const v1 = splays[ i ];
		const v2 = splays[ i + 1 ];

		const s1 = stations.getStation( v1 );
		const s2 = stations.getStation( v2 );

		let linkedSegments;

		if ( s1 === undefined && s2 === undefined ) continue;

		if ( v1.connections === 0 || s1 === undefined ) {

			linkedSegments = s2.linkedSegments;

		} else {

			linkedSegments = s1.linkedSegments;

		}

		for ( j = 0; j < linkedSegments.length; j++ ) {

			const s = linkedSegments[ j ];

			if ( segments[ s ] === undefined ) segments[ s ] = new Set();

			segments[ s ].add( v1 );
			segments[ s ].add( v2 );

		}

	}

}

function getWalls( survey, segments ) {

	const stations = survey.stations;
	const walls = survey.getFeature( FACE_WALLS );
	const centerLines = survey.getFeature( LEG_CAVE );

	const lrudVertices = walls.vertices;
	const centerLineVertices = centerLines.geometry.vertices;

	// drop vertices after use
	walls.vertices = null;

	var i, j, k;

	for ( i = 0; i < centerLineVertices.length; i++ ) {

		const vertex = centerLineVertices[ i ];
		const station = stations.getStation( vertex );

		const lrudInfo = vertex.lrudInfo;

		if ( lrudInfo === undefined ) continue;

		let linkedSegments = station.linkedSegments;

		for ( j = 0; j < linkedSegments.length; j++ ) {

			const s = linkedSegments[ j ];

			if ( segments[ s ] === undefined ) segments[ s ] = new Set();

			const start = lrudInfo.start;
			const end = start + lrudInfo.count;

			for ( k = start; k < end; k++ ) {

				segments[ s ].add( lrudVertices[ k ] );

			}

		}

	}

}

function buildAlpha ( survey ) {

	const vertices = [];
	const indices = [];

	const segments = [];

	var points;
	var tasks = 0;
	var pending = 0;

	var i;

	// allocate splays to segments

	if ( survey.hasFeature( LEG_SPLAY ) ) getSplays( survey, segments );
	if ( survey.hasFeature( FACE_WALLS ) ) getWalls( survey, segments );

	survey.dispatchEvent( { type: 'progress', name: 'start' } );

	// submit each set of segment points to Worker

	const workerPool = new WorkerPool( 'alphaWorker.js' );

	for ( i = 0; i < segments.length; i++ ) {

		const segment = segments[ i ];

		if ( segment === undefined ) continue;

		const segmentPointSet = segment;
		points = [];

		segmentPointSet.forEach( _addPoints );

		pending++;
		tasks++;

		workerPool.queueWork(
			{
				segment: i,
				points: points,
				alpha: 0.08
			},
			_wallsLoaded
		);

	}

	const mesh = new Walls();

	mesh.ready = false;

	survey.addFeature( mesh, FACE_ALPHA, 'CV.Survey:faces:alpha' );

	return;

	function _wallsLoaded ( event ) {

		const cells = event.data.cells;
		const worker = event.currentTarget;
		const segment = event.data.segment;
		const offset = vertices.length / 3;

		// console.log( 'alpha walls loaded:', segment, cells.length );

		workerPool.putWorker( worker );

		var i;

		// populate vertices and indices in order of worker completion

		const segmentPointSet = segments[ segment ];

		segmentPointSet.forEach( _addVertices );

		for ( i = 0; i < cells.length; i++ ) {

			const c = cells[ i ];
			indices.push( c[ 0 ] + offset, c[ 1 ] + offset, c[ 2 ] + offset );

		}

		pending--;

		survey.dispatchEvent( { type: 'progress', name: 'set', progress: 100 * ( tasks - pending ) / tasks } );

		if ( pending > 0 ) return;

		console.log( 'loading complete alpha walls' );

		// build geometry

		const geometry = mesh.geometry;

		geometry.setIndex( indices );
		geometry.addAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );

		geometry.computeVertexNormals();

		mesh.ready = true;

		survey.dispatchEvent( { type: 'changed', name: 'changed' } );
		survey.dispatchEvent( { type: 'progress', name: 'end' } );

		// finished with all workers

		workerPool.dispose();

	}

	function _addPoints ( point ) {

		points.push( [ point.x, point.y, point.z ] );

	}

	function _addVertices ( point ) {

		vertices.push( point.x, point.y, point.z );

	}

}

export { buildAlpha };

// EOF