import * as React from 'react';
import mapboxgl, { Map } from 'mapbox-gl';
import { useSubscription } from 'use-subscription';

type Maybe<T> = T | null;

export default function useMapbox(containerId: string, config: any = {}) {
  const { accessToken, ...options } = config;
  const mapRef = React.useRef<Maybe<Map>>(null);
  const [initialized, setInitialized] = React.useState(false);

  React.useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: containerId,
      style: 'mapbox://styles/mapbox/streets-v11',
      accessToken,
      ...options,
    });

    setInitialized(true);

    return () => {
      if (mapRef.current) {
        mapRef.current!.remove();
        mapRef.current = null;
        setInitialized(false);
      }
    };
  }, []);

  const loaded = useSubscription(
    React.useMemo(
      () => ({
        getCurrentValue() {
          return mapRef.current ? mapRef.current!.loaded() : false;
        },
        subscribe: callback => {
          if (mapRef.current) {
            mapRef.current!.on('load', callback);
          }

          return () => {
            if (mapRef.current) {
              mapRef.current!.off('load', callback);
            }
          };
        },
      }),
      [initialized]
    )
  );

  React.useEffect(() => {
    if (loaded && mapRef.current) {
      mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    }
  }, [loaded]);

  return { loaded, map: mapRef.current };
}
