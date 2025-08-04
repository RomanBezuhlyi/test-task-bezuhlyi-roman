import axios from 'axios'

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org'

export async function reverseGeocode(lat, lon) {
	const res = await axios.get(`${NOMINATIM_BASE}/reverse`, {
		params: {
			format: 'json',
			lat,
			lon,
			zoom: 10,
			polygon_geojson: 1,
			addressdetails: 1,
		},
	})
	return res.data
}
