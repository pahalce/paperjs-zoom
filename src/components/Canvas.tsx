import paper from "paper";
import { useEffect, useRef } from "react";

function initGraph() {
  //Add Image
  const raster = new paper.Raster(
    "https://cdn.pixabay.com/photo/2014/06/23/20/58/nature-reserve-375609_960_720.jpg"
  );
  raster.scale(0.5);
  raster.opacity = 0.75;
  raster.position = paper.view.center; //

  //Add Points randomly sized and randomly colored
  for (let i = 0; i < 1000; i++) {
    addRandomPoint();
  }
}

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
  const x = Math.random() * paper.view.size.width;
  const y = Math.random() * paper.view.size.height;

  new paper.Path.Circle({
    center: new paper.Point(x, y),
    radius: radius,
    fillColor: randomFillColor,
  });
}

const Canvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    addEventListener("load", handleOnLoad);
    addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      removeEventListener("wheel", handleWheel);
      removeEventListener("load", handleOnLoad);
    };
  }, []);

  const handleOnLoad = () => {
    if (canvasRef.current === null) {
      return;
    }
    paper.setup(canvasRef.current);
    initGraph();
  };

  const handleWheel = (event: WheelEvent) => {
    event.preventDefault();
    let newZoom = paper.view.zoom;
    const oldZoom = paper.view.zoom;

    if (event.deltaY > 0) {
      newZoom = paper.view.zoom * 0.95;
    } else {
      newZoom = paper.view.zoom * 1.05;
    }

    const beta = oldZoom / newZoom;

    const mousePosition = new paper.Point(event.offsetX, event.offsetY);

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
    <canvas
      ref={canvasRef}
      className="w-full bg-blue-200 border border-black"
    ></canvas>
  );
};

export default Canvas;
