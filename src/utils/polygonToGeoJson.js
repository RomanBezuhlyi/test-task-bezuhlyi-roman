export function convertToGeoJSON(polygonObj) {
	return {
		type: 'Feature',
		properties: {
			id: polygonObj.id,
			name: polygonObj.name,
		},
		geometry: {
			type: 'Polygon',
			coordinates: [polygonObj.polygon.map(coord => [coord.lng, coord.lat])],
		},
	}
}
