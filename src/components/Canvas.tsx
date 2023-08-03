import paper from "paper";
import { WheelEventHandler, useRef } from "react";
import reactIcon from "../assets/react.svg";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

function initGraph() {
  //Add Image
  const raster = new paper.Raster(reactIcon);
  raster.scale(10);
  raster.opacity = 1;
  raster.position = paper.view.center; //

  //Add Points randomly sized and randomly colored
  for (let i = 0; i < 100; i++) {
    addRandomPoint();
  }
}

window.onload = function () {
  // Get a reference to the canvas object
  const canvas = document.getElementById("my-canvas") as HTMLCanvasElement;
  // Create an empty project and a view for the canvas:
  paper.setup(canvas);
  console.log("setup");

  initGraph();
};

function addRandomPoint() {
  const radius = 2.0 * Math.random() + 2.0;

  const randomFillColor =
    "rgb(" +
    ~~(256 * Math.random()) +
    ", " +
    ~~(256 * Math.random()) +
    ", " +
    ~~(256 * Math.random()) +
    ")";
  const x = Math.random() * window.innerWidth;
  const y = Math.random() * window.innerHeight;

  new paper.Path.Circle({
    center: new paper.Point(x, y),
    radius: radius,
    fillColor: randomFillColor,
  });
}

const Canvas = () => {
  const canvasRef = useRef(null);

  // useEffect(() => {
  //   addEventListener("wheel", handleWheel, { passive: false });
  //   return () => {
  //     removeEventListener("wheel", handleWheel);
  //   };
  // }, []);

  const handleWheel: WheelEventHandler<HTMLCanvasElement> = (event) => {
    console.log("wheel event: ", event.deltaY, event.clientX, event.clientY);
    // event.preventDefault();
    let newZoom = paper.view.zoom;
    const oldZoom = paper.view.zoom;

    if (event.deltaY > 0) {
      newZoom = paper.view.zoom * 0.95;
    } else {
      newZoom = paper.view.zoom * 1.05;
    }

    const beta = oldZoom / newZoom;

    const mousePosition = new paper.Point(event.clientX, event.clientY);

    //viewToProject: gives the coordinates in the Project space from the Screen Coordinates
    const viewPosition = paper.view.viewToProject(mousePosition);

    const mpos = viewPosition;
    const ctr = paper.view.center;

    const pc = mpos.subtract(ctr);
    const offset = mpos.subtract(pc.multiply(beta)).subtract(ctr);

    paper.view.zoom = newZoom;
    paper.view.center = paper.view.center.add(offset);
  };

  return (
    <TransformWrapper>
      <TransformComponent>
        <canvas
          id="my-canvas"
          ref={canvasRef}
          onWheel={handleWheel}
          onTouchStart={(e) => {
            console.log("touch", e.touches);
          }}
          onTouchMove={(e) => {
            console.log("touch move", e.touches);
          }}
          className="bg-slate-300"
          data-paper-resize
        ></canvas>
      </TransformComponent>
    </TransformWrapper>
  );
};

export default Canvas;
