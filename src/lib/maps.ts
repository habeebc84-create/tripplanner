/**
 * Google Maps / Google Hotels links. These are plain outbound links — no API
 * key, no per-search cost, and nothing for a backend to scale. That is what
 * makes the site able to serve very large traffic from a static CDN.
 */
export const mapsSearchUrl = (place: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place + ', Karnataka')}`;

export const mapsDirectionsUrl = (from: string, to: string) =>
  `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(from)}&destination=${encodeURIComponent(to + ', Karnataka')}`;

export const hotelsSearchUrl = (place: string) =>
  `https://www.google.com/travel/hotels?q=${encodeURIComponent('hotels in ' + place + ', Karnataka')}`;
