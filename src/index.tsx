import * as React from 'react';

export default function useMapbox(containerId: string, config = {}) {
  const mapRef = React.useRef(null);
  return { map: mapRef.current };
}
