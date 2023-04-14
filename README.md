# Geovisto Timeline Tool
Tool which provides the timeline functionality for [Geovisto core library](https://github.com/geovisto/geovisto).

This repository is a snapshot of Geoviosto `tools/timeline` derived from the development repository: [geovisto/geovisto-map](https://github.com/geovisto/geovisto-map).

## Usage
![Geovisto Timeline Tool](https://user-images.githubusercontent.com/44326793/229290880-bca4f8be-93f4-4800-b394-766cfb73688a.png)

```ts 
import { GeovistoTimelineTool } from 'geovisto-timeline'
import 'geovisto-timeline/dist/index.css';
// create instance of map with given props
const map = Geovisto.createMap({
  // ...
  tools?: Geovisto.createMapToolsManager([
    // instances of Geovisto tools (extensions) which will be directly used in the map
    // ...
   GeovistoTimelineTool.createTool({
      id: "geovisto-tool-timeline"
    }),
  ])
});
// rendering of the map
map.draw(Geovisto.getMapConfigManagerFactory().default({
  // initial settings of the map can be overriden by the map config - JSON structure providing user settings 
  // ...
  tools?: [
    // config of Geovisto tools (extensions) used in the map
    // ...
    {
      "type": "geovisto-tool-timeline",
      "id": "geovisto-tool-timeline",
      "enabled": true,
      "layerName": "Timeline",
      // mapping of data domains to data dimensions
       "data": {
            "timePath": "date", // date value to display on the timeline
            "stepTimeLength": 3000, // time of individual step
            "transitionDuration": 2500, // time of transition from between steps
            "realTimeEnabled": true, // enabling time granularity 
            "granularity": "MONTH", // time granularity ['HOUR', 'DAY', 'WEEK', 'MONTH', 'YEAR']
            "chartEnabled": false, // enabling value chart
            "chartValuePath": "chartData", // data to be displayed on chart
            "chartAggregationFn": "sum" // [sum, count]
      }
    },
    // ...
  ]
}));
```
## Instalation
`npm install --save geovisto-timeline`

Peer dependencies:

`npm install --save geovisto leaflet`

## Authors and Contributors
Author: [Kryštof Rykala](https://github.com/rykala), [Vladimír Korenčik](https://github.com/froztt)

Contributors: [Jiři Hynek](https://github.com/jirka)

## License
[MIT](https://github.com/geovisto/geovisto-timeline/blob/master/LICENSE)

### Keywords
[gis](https://www.npmjs.com/search?q=keywords:gis) [map](https://www.npmjs.com/search?q=keywords:map) [geovisto](https://www.npmjs.com/search?q=keywords:geovisto) [leaflet](https://www.npmjs.com/search?q=keywords:leaflet) [spatial-data](https://www.npmjs.com/search?q=keywords:spatial-data) [visualization](https://www.npmjs.com/search?q=keywords:visualization) [timeline](https://www.npmjs.com/search?q=keywords:timeline) [time-series](https://www.npmjs.com/search?q=keywords:time-series)
