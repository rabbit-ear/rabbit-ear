export default parsers;
declare namespace parsers {
    export { LineToSegments as line };
    export { RectToSegments as rect };
    export { PolygonToSegments as polygon };
    export { PolylineToSegments as polyline };
    export { PathToSegments as path };
}
import LineToSegments from "./line.js";
import RectToSegments from "./rect.js";
import PolygonToSegments from "./polygon.js";
import PolylineToSegments from "./polyline.js";
import PathToSegments from "./path.js";
