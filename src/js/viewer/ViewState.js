import {
	CAMERA_PERSPECTIVE,
	SHADING_HEIGHT, SHADING_RELIEF,
	VIEW_PLAN, MOUSE_MODE_NORMAL, SHADING_DUPLICATE
} from '../core/constants';

const defaultView = {
	autoRotate: false,
	autoRotateSpeed: 0.5,
	box: true,
	cameraType: CAMERA_PERSPECTIVE,
	duplicateShading: SHADING_DUPLICATE,
	editMode: MOUSE_MODE_NORMAL,
	entrances: true,
	entrance_dots: true,
	fog: false,
	fullscreen: false,
	grid: false,
	HUD: true,
	linewidth: 0,
	scaleLinewidth: false,
	scraps: false,
	shadingMode: SHADING_HEIGHT,
	splays: false,
	stations: false,
	stationLabels: false,
	stationLabelOver: false,
	surfaceLegs: false,
	surfaceShading: SHADING_HEIGHT,
	terrain: false,
	terrainDatumShift: false,
	terrainDirectionalLighting: true,
	terrainOpacity: 0.5,
	terrainShading: SHADING_RELIEF,
	traces: false,
	view: VIEW_PLAN,
	walls: false,
	warnings: false,
	zoomToCursor: true
};

function ViewState ( viewer ) {

	const properties = [];

	Object.keys( viewer ).forEach( name => {

		const pDesc = Object.getOwnPropertyDescriptor( viewer, name );

		if ( pDesc.set !== undefined && pDesc.get !== undefined ) {

			properties.push( name );

		}

	} );

	this.saveState = function () {

		const savedState = {};

		properties.forEach( name => {

			const value = viewer[ name ];

			if ( typeof value === 'object' ) return;

			savedState[ name ] = value;

		} );

		return savedState;

	};

}

export { ViewState, defaultView };