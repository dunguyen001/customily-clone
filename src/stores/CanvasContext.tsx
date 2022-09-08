import Konva from "konva";
import React from "react";

export const ACTIONS = {
  RESET: "RESET",
  RENDER_STAGE: "RENDER_STAGE",
  UPLOAD_ASSET: "UPLOAD_ASSET",
  HIDE_SELECTION_RECTANGLE: "HIDE_SELECTION_RECTANGLE"
};

interface CanvasState {
  stage?: Konva.Stage;
  layer?: Konva.Layer;
  transformer?: Konva.Transformer;
  isUploadAsset?: boolean;
  selectionRectangle?: Konva.Rect;
}

export const canvasInitialState: CanvasState = {
  stage: undefined,
  layer: undefined,
  transformer: undefined,
  selectionRectangle: undefined,
  isUploadAsset: false,
};

export const CanvasReducer = (state: CanvasState, action: any) => {
  const { payload } = action;
  switch (action.type) {
    case ACTIONS.RENDER_STAGE: {
      if (!state?.stage) {
        const stage = new Konva.Stage(payload);
        state.stage = stage;
        state.layer = new Konva.Layer();
        state.stage?.add(state.layer);
        const tr = (state.transformer = new Konva.Transformer({
          keepRatio: true,
        }));
        state.layer?.add(tr);

        state.selectionRectangle = new Konva.Rect({
          fill: "rgba(0,0,255,0.5)",
          visible: false,
          name: "selection"
        });
        state.layer?.add(state.selectionRectangle);

        stageListeners(state);
      }
      return {
        ...state
      };
    }
    case ACTIONS.UPLOAD_ASSET: {
      state.isUploadAsset = true;
      const asset = createAsset(payload);
      state.layer?.add(asset);
      state.isUploadAsset = false;
      return {
        ...state
      };
    }
    case ACTIONS.RESET: {
      return canvasInitialState;
    }
    // case ACTIONS.HIDE_SELECTION_RECTANGLE:
    //   state.selectionRectangle?.visible()
    default:
      return state;
  }
};

const createAsset = (payload: any) => {
  const { buffer, name, width, height, x, y, id } = payload;
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
    id,
  });
};

const stageListeners = ({ stage, selectionRectangle, transformer }: CanvasState) => {
  if (!stage || !selectionRectangle || !transformer) {
    return;
  }
  let x1: any, y1: any, x2: any, y2: any;
  stage?.on("mousedown touchstart", (e: any) => {
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

  stage?.on("mousemove touchmove", (e: any) => {
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

  stage?.on("mouseup touchend", (e: any) => {
    if (!selectionRectangle.visible()) {
      return;
    }
    e.evt.preventDefault();
    setTimeout(() => {
      selectionRectangle.visible(false);
    });

    var shapes = stage.find(".asset");
    var box = selectionRectangle.getClientRect();
    var selected = shapes.filter((shape: any) =>
      Konva.Util.haveIntersection(box, shape.getClientRect())
    );
    transformer.nodes(selected);
  });

  stage?.on("click tap", function (e: any) {
    if (!e.target.hasName("asset")) {
      return;
    }
    if (selectionRectangle.visible()) {
      return;
    }
    if (e.target === stage) {
      transformer.nodes([]);
      return;
    }
    const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
    const isSelected = transformer.nodes().indexOf(e.target) >= 0;
    if (!metaPressed && !isSelected) {
      transformer.nodes([e.target]);
    } else if (metaPressed && isSelected) {
      const nodes = transformer.nodes().slice();
      nodes.splice(nodes.indexOf(e.target), 1);
      transformer.nodes(nodes);
    } else if (metaPressed && !isSelected) {
      // add the node into selection
      const nodes = transformer.nodes().concat([e.target]);
      transformer.nodes(nodes);
    }
  });
};

export const CanvasContext = React.createContext<any>({});
