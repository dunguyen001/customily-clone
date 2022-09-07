import Konva from "konva";
import { Callback, Emitter } from "./Emitter";

export const ACTIONS = {
  RENDER_STAGE: "RENDER_STAGE",
  UPLOAD_ASSET: "UPLOAD_ASSET",
};

interface CanvasState {
  stage?: Konva.Stage;
  layer?: Konva.Layer;
  transformer?: Konva.Transformer;
  assets?: any[];
}

class Canvas extends Emitter {
  initialState: CanvasState = {};

  constructor() {
    super();
    this.reset();
    this.addListeners();
  }

  reset() {
    this.initialState = {
      assets: [],
      stage: undefined,
    };
  }

  addListeners() {
    this.subscribe(ACTIONS.UPLOAD_ASSET, (payload: any) => {
      const asset = this.createAsset(payload);
      this.initialState.layer?.add(asset);
      this.initialState.assets?.push(asset);
      this.dispatch(
        this.getClientEvent(ACTIONS.UPLOAD_ASSET),
        this.initialState
      );
    });

    this.subscribe(ACTIONS.RENDER_STAGE, (payload: any) => {
      const stage = new Konva.Stage(payload);
      this.initialState.stage = stage;
      this.initialState.layer = new Konva.Layer();
      this.initialState.stage?.add(this.initialState.layer);
      const tr = 
      this.initialState.transformer = new Konva.Transformer({
        keepRatio: true,
      });
      this.initialState.layer?.add(tr);
      this.dispatch(
        this.getClientEvent(ACTIONS.RENDER_STAGE),
        this.initialState
      );
    });
  }

  subscribeEvent(event: string, callback: Callback) {
    return this.subscribe(this.getClientEvent(event), callback);
  }

  stageListeners() {
    var selectionRectangle = new Konva.Rect({
      fill: "rgba(0,0,255,0.5)",
      visible: false,
    });
    this.initialState.layer?.add(selectionRectangle);

    let x1: any, y1: any, x2: any, y2: any;
    const stage = this.initialState.stage;
    stage?.on("mousedown touchstart", (e) => {
      // do nothing if we mousedown on any shape
      if (e.target !== stage) {
        return;
      }
      e.evt.preventDefault();
      x1 = stage.getPointerPosition()?.x;
      y1 = stage.getPointerPosition()?.y;
      x2 = stage.getPointerPosition()?.x;
      y2 = stage.getPointerPosition()?.y;

      selectionRectangle.visible(true);
      selectionRectangle.width(0);
      selectionRectangle.height(0);
    });

    stage?.on("mousemove touchmove", (e) => {
      // do nothing if we didn't start selection
      if (!selectionRectangle.visible()) {
        return;
      }
      e.evt.preventDefault();
      x2 = stage.getPointerPosition()?.x;
      y2 = stage.getPointerPosition()?.y;

      selectionRectangle.setAttrs({
        x: Math.min(x1, x2),
        y: Math.min(y1, y2),
        width: Math.abs(x2 - x1),
        height: Math.abs(y2 - y1),
      });
    });

    stage?.on("mouseup touchend", (e) => {
      if (!selectionRectangle.visible()) {
        return;
      }
      e.evt.preventDefault();
      setTimeout(() => {
        selectionRectangle.visible(false);
      });

      var shapes = stage.find(".asset");
      var box = selectionRectangle.getClientRect();
      var selected = shapes.filter((shape) =>
        Konva.Util.haveIntersection(box, shape.getClientRect())
      );
      tr.nodes(selected);
    });

    stage?.on("click tap", function (e) {
      if (!e.target.hasName("asset")) {
        return;
      }
      if (selectionRectangle.visible()) {
        return;
      }
      if (e.target === stage) {
        tr.nodes([]);
        return;
      }
      const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
      const isSelected = tr.nodes().indexOf(e.target) >= 0;
      if (!metaPressed && !isSelected) {
        tr.nodes([e.target]);
      } else if (metaPressed && isSelected) {
        const nodes = tr.nodes().slice();
        nodes.splice(nodes.indexOf(e.target), 1);
        tr.nodes(nodes);
      } else if (metaPressed && !isSelected) {
        // add the node into selection
        const nodes = tr.nodes().concat([e.target]);
        tr.nodes(nodes);
      }
    });
  }

  createAsset = (payload: any) => {
    const { buffer, name, width, height, x, y } = payload;
    const imageObj1 = new Image();
    imageObj1.src = buffer;
    return new Konva.Image({
      image: imageObj1,
      name,
      width,
      height,
      x,
      y,
      draggable: true,
    });
  };
}

const canvasStore = new Canvas();
(<any>window).canvasStore = canvasStore;
export default canvasStore;
