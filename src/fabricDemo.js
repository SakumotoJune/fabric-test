import React, { useEffect, useState, useRef, useCallback } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { fabric } from "fabric";
import "./demo.css";
import CropLayer from "./cropLayer";
// const backUrl = "//biu-hk.dwstatic.com/sky/20211021/o1vEtzCIp0q3fyPS.png";
// const backAlphaUrl = "//biu-hk.dwstatic.com/sky/20211021/IMDu5E6woFe7V5kF.png";
const alphaUrl =
  "https://biu-hk.dwstatic.com/sky/20211110/yQp6Iu0F3muVBB1K.png";
const img1 =
  "https://fashionline-cn.oss-cn-shenzhen.aliyuncs.com/user/3306868428/NytFkDsBRl3714727388591783mrCHUsiExj";
const img2 =
  "https://fashionline-cn.oss-cn-shenzhen.aliyuncs.com/user/3306868428/NSQBExUeRN3666554485741945HrktWBEiBE";

var previousAngle;

const Demo = () => {
  // let canv, alphaImg;
  // const canv = useRef()
  const [canv, setCanv] = useState();
  const [alphaImg, setAlpha] = useState();
  const [cropVis, setCropVis] = useState(false);
  const [clipObj, setClipObj] = useState();
  const [clipParams, setClipParams] = useState();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setCanv(
      new fabric.Canvas("canv", {
        height: 800,
        width: 800,
        backgroundColor: "pink",
        centeredRotation: true,
        preserveObjectStacking: true,
        selection: false, // 禁止组选择
      })
    );
    // init();
  }, []);

  useEffect(() => {
    if (canv) {
      new fabric.Image.fromURL(alphaUrl, (img) => {
        img.set({
          top: 0,
          left: 0,
          selectable: false,
          hoverCursor: "default",
          evented: false,
          hasControls: false,
          perPixelTargetFind: false,
          absolutePositioned: true,
        });
        img.scaleToWidth(800);
        canv.add(img).renderAll();
        setAlpha(img);
        // alphaImg = img;
      });
    }
  }, [canv]);

  const toPattern = (
    img,
    sourceImg,
    pattern = "repeat",
    offsetX = 0,
    offsetY = 0,
    px = 0,
    py = 0
  ) => {
    const patternSourceCanvas = new fabric.StaticCanvas();
    // patternSourceImg = sourceImg;
    sourceImg.set("top", py);
    sourceImg.set("left", px / 2);
    patternSourceCanvas.add(sourceImg);
    img.patternSourceCanvas = patternSourceCanvas;
    img.patternSourceImg = sourceImg;
    patternSourceCanvas.renderAll();
    patternSourceCanvas
      .setDimensions({
        width: img.getScaledWidth() + px,
        height: img.getScaledHeight() + py,
      })
      .renderAll();
    return new fabric.Pattern({
      source: patternSourceCanvas.getElement(),
      repeat: pattern,
      offsetX: offsetX - px / 2,
      offsetY: offsetY - py,
    });
  };

  const addImage = () => {
    new fabric.Image.fromURL(
      img1,
      (img) => {
        img.scaleToWidth(200);
        img.set({
          // width: 2048, // 原图中裁剪长宽
          // height: 2048,
          // cropX: 2048,
          // cropY: 100,
          // originX: "center",
          // originY: "center",
          left: canv.width / 2,
          top: canv.height / 2,
          clipPath: alphaImg,
          selectable: true,
        });
        // img.rotate(45);
        img.url = img1;
        img.naturalWidth = img.width;
        img.naturalHeight = img.height;
        canv.add(img).renderAll();
      }
      // {
      //   crossOrigin: "anonymous",
      // }
    );
  };

  const addImage2 = () => {
    new fabric.Image.fromURL(img2, (img) => {
      img.scaleToWidth(200);
      img.set({
        clipPath: alphaImg,
        selectable: true,
      });
      canv.add(img).renderAll();
    });
  };

  //
  const addText = () => {
    // const start = (Math.PI / 180) * 45;
    // const end = (Math.PI / 180) * 45;
    const isLarge = 1; // 是否是钝角
    const startPoint = {
      x: 100,
      y: 100,
    };
    const endPoint = {
      x: 300,
      y: 100,
    };
    const r = 100;
    var arc1 = new fabric.Path(
      `M ${startPoint.x} ${startPoint.y} A ${r} ${r} 0 ${isLarge} 1 ${endPoint.x} ${endPoint.y}`,
      {
        stroke: "#000",
        fill: "",
      }
    );
    const circle = new fabric.Circle({
      fill: "",
      stroke: "black",
      radius: 100,
      startAngle: 0,
      endAngle: 45,
    });
    const text = new fabric.Text("Hello world", {
      fontSize: 50,
      left: arc1.left,
      top: arc1.top,
      lineHeight: 1,
      textAlign: "center",
      originX: "left",
      fontFamily: "Helvetica",
      fontWeight: "bold",
      statefullCache: true,
      // scaleX: 0.4,
      // scaleY: 0.4,
      // shadow: "rgba(0,0,0,0.2) 10px 0 0",
      clipPath: alphaImg,
      path: arc1,
      // padding: 10, // 文字offset
      // pathStartOffset: -50,
      // pathSide: "left",
      charSpacing: -50,
      borderColor: "#4b50f1",
    });
    text.on({
      scaling: () => {
        // console.log("*****", text.toObject());
      },
    });
    canv.add(text).renderAll();
  };

  const addText2 = () => {
    const text = new fabric.Text("Hello world", {
      fontSize: 100,
      left: 0,
      top: 0,
      lineHeight: 1,
      originX: "left",
      fontFamily: "Helvetica",
      fontWeight: "bold",
      statefullCache: true,
      // scaleX: 0.4,
      // scaleY: 0.4,
      clipPath: alphaImg,
      // pathStartOffset: 50,
    });
    text.on({
      scaling: () => {
        console.log("*****", text.toObject());
      },
    });
    canv.add(text).renderAll();
  };

  const shuipingfanzhuan = () => {
    const obj = canv.getActiveObject();
    const { scaleX, patternSourceImg, patternSourceCanvas } = obj;
    obj.set("scaleX", -1 * scaleX).setCoords();
    if (patternSourceImg && patternSourceCanvas) {
      patternSourceImg.set("scaleX", -1 * scaleX).setCoords();
      patternSourceCanvas.renderAll();
    }
    canv.renderAll();
  };

  const shuzhifanzhuan = () => {
    const obj = canv.getActiveObject();
    const { scaleY, patternSourceImg, patternSourceCanvas } = obj;
    obj.set("scaleY", -1 * scaleY).setCoords();
    if (patternSourceImg && patternSourceCanvas) {
      patternSourceImg.set("scaleY", -1 * scaleY).setCoords();
      patternSourceCanvas.renderAll();
    }
    canv.renderAll();
  };

  const rotate = () => {
    const activeObj = canv.getActiveObject();
    activeObj.rotate(30);
    canv.renderAll();
  };

  const clip = () => {
    setCropVis(true);
    const activeObj = canv.getActiveObject();
    // console.log(activeObj.toObject());
    // setCropImg(activeObj.url);
    // setCropStyle({
    //   top: `${activeObj.top}px`,
    //   left: `${activeObj.left}px`,
    //   width: `${activeObj.getScaledWidth()}px`,
    //   height: `${activeObj.getScaledHeight()}px`,
    // });
    setClipObj(activeObj);
    activeObj.selectable = false;
    activeObj.evented = false;
    canv.renderAll();
  };

  const confirm = () => {
    setCropVis(false);
    const { width, height, cropX, cropY, top, left } = clipParams;
    console.log("******", clipParams);
    clipObj.width = width; // cWidth
    clipObj.height = height; // cHeight
    clipObj.cropX = cropX; // cx
    clipObj.cropY = cropY; // cy
    clipObj.top = top; // dx
    clipObj.left = left; // dy
    clipObj.selectable = true;
    clipObj.evented = true;
    canv.renderAll();
  };

  // const rotateObj = (obj, angleRadian, px, py) => {
  //   const ty = py - obj.getScaledHeight() / 2;
  //   const tx = px - obj.getScaledWidth() / 2;

  // }

  const createPatternRect = (targetObj) => {
    const { patternSourceImg, patternRect } = targetObj;
    const imgHeight = targetObj.getScaledHeight();
    const imgWidth = targetObj.getScaledWidth();
    const groups = [];
    // const patterns = [];
    const rectWidth =
      Math.max(targetObj.left, canv.width - targetObj.left - imgWidth) * 2 +
      imgWidth;
    const rectHeight =
      Math.max(targetObj.top, canv.height - targetObj.top - imgHeight) * 2 +
      imgHeight;
    if (!patternSourceImg && !patternRect) {
      targetObj.clone((cloned) => {
        cloned.left = 0;
        cloned.top = 0;
        cloned.angle = 0;
        cloned.clipPath = null;
        // cloned.originX = "left";
        // cloned.originY = "top";
        // 差位的使用这种
        // for (
        //   let i = 0;
        //   i <= Math.ceil((rectHeight - imgHeight) / 2 / imgHeight);
        //   i++
        // ) {
        //   const pattern = toPattern(
        //     targetObj,
        //     cloned,
        //     "repeat-x",
        //     targetObj.left + (imgWidth / 2) * i,
        //     // activeObj.top
        //     0
        //   );
        //   groups.push(
        //     new fabric.Rect({
        //       top: targetObj.top + imgHeight * i,
        //       width: rectWidth,
        //       height: imgHeight,
        //       fill: pattern,
        //     })
        //   );
        // }
        // for (
        //   let i = 1;
        //   i <= Math.ceil((rectHeight - imgHeight) / 2 / imgHeight);
        //   i++
        // ) {
        //   const pattern = toPattern(
        //     targetObj,
        //     cloned,
        //     "repeat-x",
        //     targetObj.left - (imgWidth / 2) * i,
        //     // activeObj.top
        //     0
        //   );
        //   groups.push(
        //     new fabric.Rect({
        //       top: targetObj.top - imgHeight * i,
        //       width: rectWidth,
        //       height: imgHeight,
        //       fill: pattern,
        //     })
        //   );
        // }
        const pattern = toPattern(
          targetObj,
          cloned,
          "repeat-x",
          targetObj.left,
          targetObj.top
        );
        groups.push(
          new fabric.Rect({
            width: rectWidth,
            height: rectHeight,
            fill: pattern,
            stroke: "red",
            // top: targetObj.top,
            // left: targetObj.left,
          })
        );
        const rect = new fabric.Group([...groups], {
          clipPath: alphaImg,
          originX: "center",
          originY: "center",
        });
        const childCenterPoint = rect.getCenterPoint();
        const rotationPoint = new fabric.Point(
          childCenterPoint.x,
          childCenterPoint.y
        );
        const originRotationPoint = new fabric.Point(
          targetObj.left + imgWidth / 2,
          targetObj.top + imgHeight / 2
        );
        const angle = fabric.util.degreesToRadians(targetObj.angle);
        const newCoords = fabric.util.rotatePoint(
          rotationPoint,
          originRotationPoint,
          angle
        );
        rect
          .set({
            left: newCoords.x,
            top: newCoords.y,
            // angle: targetObj.angle,
          })
          .setCoords();
        console.log("****", rect.getCenterPoint());
        targetObj.patternSourceImg = cloned;
        targetObj.patternRect = rect;
        // console.log("******", rect, targetObj.toJSON());
        canv.add(rect);
        rect.sendBackwards();
        canv.renderAll();
      });
    } else {
      // for (
      //   let i = 0;
      //   i <= Math.ceil((rectHeight - imgHeight) / 2 / imgHeight);
      //   i++
      // ) {
      //   const pattern = toPattern(
      //     targetObj,
      //     patternSourceImg,
      //     "repeat-x",
      //     targetObj.left + (imgWidth / 2) * i,
      //     // activeObj.top
      //     0
      //   );
      //   groups.push(
      //     new fabric.Rect({
      //       top: targetObj.top + imgHeight * i,
      //       width: rectWidth,
      //       height: imgHeight,
      //       fill: pattern,
      //     })
      //   );
      // }
      // for (
      //   let i = 1;
      //   i <= Math.ceil((rectHeight - imgHeight) / 2 / imgHeight);
      //   i++
      // ) {
      //   const pattern = toPattern(
      //     targetObj,
      //     patternSourceImg,
      //     "repeat-x",
      //     targetObj.left - (imgWidth / 2) * i,
      //     // activeObj.top
      //     0
      //   );
      //   groups.push(
      //     new fabric.Rect({
      //       top: targetObj.top - imgHeight * i,
      //       width: rectWidth,
      //       height: imgHeight,
      //       fill: pattern,
      //     })
      //   );
      // }
      const pattern = toPattern(
        targetObj,
        patternSourceImg,
        "repeat-x",
        targetObj.left,
        targetObj.top
      );
      groups.push(
        new fabric.Rect({
          width: rectWidth,
          height: rectHeight,
          fill: pattern,
        })
      );
      const rect = new fabric.Group([...groups], {
        clipPath: alphaImg,
        width: rectWidth,
        originX: "center",
        originY: "center",
        // selectable: false,
      });
      canv.remove(patternRect);
      canv.add(rect);
      targetObj.patternRect = rect;
      rect.sendBackwards();
      canv.renderAll();
    }
  };

  const rotateWithPoint = (mainBox, childBox) => {
    var childCenterPoint = childBox.getCenterPoint();
    var rotationPoint = new fabric.Point(
      childCenterPoint.x,
      childCenterPoint.y
    );
    let originRotationPoint = new fabric.Point(mainBox.left, mainBox.top);
    console.log("****", mainBox.get("angle"));
    if (!previousAngle) {
      previousAngle = mainBox.get("angle");
    }
    let angle = fabric.util.degreesToRadians(
      mainBox.get("angle") - previousAngle
    );
    previousAngle = mainBox.get("angle");

    let newCoords = fabric.util.rotatePoint(
      rotationPoint,
      originRotationPoint,
      angle
    );
    childBox
      .set({ left: newCoords.x, top: newCoords.y, angle: mainBox.get("angle") })
      .setCoords();
  };

  // 旋转和差位
  const pattern = () => {
    const activeObj = canv.getActiveObject();
    createPatternRect(activeObj);
    activeObj.on({
      moving: () => {
        // activeObj.activePattern.offsetX = activeObj.left;
        // activeObj.activePattern.offsetY = activeObj.top;
        // activeObj.patternRect.left =
        //   activeObj.left - activeObj.getScaledWidth() / 2;
        // activeObj.patternRect.top = activeObj.top;
        createPatternRect(activeObj);
        canv.renderAll();
      },
      scaling: () => {
        activeObj.patternSourceImg.scaleToWidth(activeObj.getScaledWidth());
        // activeObj.patternSourceCanvas.setDimensions({
        //   width: activeObj.getScaledWidth(),
        //   height: activeObj.getScaledHeight(),
        // });
        // activeObj.activePattern.offsetX = activeObj.left;
        // activeObj.activePattern.offsetY = activeObj.top;
        // activeObj.activePattern.rotate(activeObj.angle)
        createPatternRect(activeObj);
        canv.renderAll();
      },
      rotating: () => {
        rotateWithPoint(activeObj, activeObj.patternRect);
        // activeObj.patternSourceImg.rotate(activeObj.angle);
        // activeObj.patternRect.rotate(activeObj.angle);
        // activeObj.patternSourceImg.rotate(activeObj.angle);
        // activeObj.patternSourceCanvas.renderAll();
        // activeObj.patternRect.angle = activeObj.angle;
        // activeObj.patternRect.left = activeObj.left;
        // activeObj.patternRect.top = activeObj.top;
        // canv.renderAll();
      },
    });
  };

  const onClip = useCallback((params) => {
    setClipParams(params);
  }, []);

  return (
    <div>
      <h1>FabricJS React Sample</h1>
      <button onClick={addImage}>Add Image</button>
      <button onClick={addImage2}>Add Image2</button>
      <button onClick={addText}>Add Text</button>
      <button onClick={addText2}>Add Text2</button>
      <button onClick={rotate}>rotate</button>
      <button onClick={shuipingfanzhuan}>shuipingfanzhuan</button>
      <button onClick={shuzhifanzhuan}>shuzhifanzhuan</button>
      <button onClick={clip}>clip</button>
      <button onClick={confirm}>confirm</button>
      <button onClick={pattern}>pattern</button>
      <div className="container">
        <canvas
          id="canv"
          width={800}
          height={800}
          style={{ width: "800px", height: "800px", border: "1px solid #000" }}
        ></canvas>
        {cropVis ? (
          <CropLayer
            clipObj={clipObj.toObject(["naturalWidth", "naturalHeight"])}
            onClip={onClip}
          ></CropLayer>
        ) : null}
      </div>
      {/* <canvas id="static-canvas" width={500} height={500}></canvas> */}
      {/* <canvas id="canvas2"></canvas> */}
    </div>
  );
};
export default Demo;
