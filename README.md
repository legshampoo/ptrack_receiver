
'npm run start:dev'
to start node server

'track' refers to a person or 'blob'
so each person is a 'track'


the node server parses the open_ptrack data, assigns a color to each 'track' and maps the (x,y) position
to fit the final canvas

the track.x/track.y value is the raw x,y from the kinects

the track.cx/track.cy is the mapped value to whatever canvas size you are using  <--- this is what you want






example of data from node server:

[ { id: 6,
    x: 4.94695,
    y: 3.20272,
    height: 1.91037,
    age: 74.5986,
    confidence: 0.918185,
    matched: true,
    color: 'hsla(281, 25%,100%,0.5)',
    cx: 1139.1840000000002,
    cy: -186.87130434782625 },
  { id: 11,
    x: 1.85156,
    y: -1.06507,
    height: 1.06422,
    age: 47.665,
    confidence: 0.916494,
    matched: true,
    color: 'hsla(14, 65%,82%,0.5)',
    cx: 2419.521,
    cy: 782.1203478260869 } ]
