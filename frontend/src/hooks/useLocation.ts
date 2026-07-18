// TODO: wire up geolocation
export function useLocation() {
  return {
    lat: null as number | null,
    lng: null as number | null,
    neighborhood: 'University District',
  };
}
