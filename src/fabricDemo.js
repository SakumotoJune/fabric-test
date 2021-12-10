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

const Demo = () => {
  // let canv, alphaImg;
  // const canv = useRef()
  const [canv, setCanv] = useState();
  const [alphaImg, setAlpha] = useState();
  const [cropVis, setCropVis] = useState(false);
  const [clipObj, setClipObj] = useState();
  const [clipParams, setClipParams] = useState();
  // let patternSourceCanvas;
  // let patternSourceImg;
  // let activePattern;

  // const init = () => {
  //   new fabric.Image.fromURL(alphaUrl, (img) => {
  //     img.set({
  //       top: 0,
  //       left: 0,
  //       selectable: false,
  //       hoverCursor: "default",
  //       evented: false,
  //       hasControls: false,
  //       perPixelTargetFind: false,
  //       absolutePositioned: true,
  //     });
  //     img.scaleToWidth(800);
  //     canv.add(img).renderAll();
  //     setAlpha(img);
  //     // alphaImg = img;
  //   });
  // };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setCanv(
      new fabric.Canvas("canv", {
        height: 800,
        width: 800,
        backgroundColor: "pink",
        centeredRotation: true,
        preserveObjectStacking: true,
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

  const toPattern = (img, sourceImg) => {
    const patternSourceCanvas = new fabric.StaticCanvas();
    // patternSourceImg = sourceImg;
    patternSourceCanvas.add(sourceImg);
    img.patternSourceCanvas = patternSourceCanvas;
    img.patternSourceImg = sourceImg;
    patternSourceCanvas.renderAll();
    patternSourceCanvas
      .setDimensions({
        width: img.getScaledWidth(),
        height: img.getScaledHeight(),
      })
      .renderAll();
    return new fabric.Pattern({
      source: patternSourceCanvas.getElement(),
      repeat: "repeat",
      offsetX: img.left,
      offsetY: img.top,
    });
  };

  const addImage = () => {
    new fabric.Image.fromURL(img1, (img) => {
      img.scaleToWidth(200);
      img.set({
        // width: 2048, // 原图中裁剪长宽
        // height: 2048,
        // cropX: 2048,
        // cropY: 100,
        clipPath: alphaImg,
        selectable: true,
      });
      img.url = img1;
      canv.add(img).renderAll();
    });
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

  const addText = () => {
    const text = new fabric.Text("Hello world", {
      fontSize: 250,
      left: 0,
      top: 0,
      lineHeight: 1,
      originX: "left",
      fontFamily: "Helvetica",
      fontWeight: "bold",
      statefullCache: true,
      scaleX: 0.4,
      scaleY: 0.4,
      clipPath: alphaImg,
    });
    canv.add(text).renderAll();
  };

  const shuipingfanzhuan = () => {
    const obj = canv.getActiveObject();
    const { scaleX } = obj;
    obj.set("scaleX", -1 * scaleX).setCoords();
    canv.renderAll();
  };

  const shuzhifanzhuan = () => {
    const obj = canv.getActiveObject();
    const { scaleY } = obj;
    obj.set("scaleY", -1 * scaleY).setCoords();
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
    clipObj.width = width;
    clipObj.height = height;
    clipObj.cropX = cropX;
    clipObj.cropY = cropY;
    clipObj.top = top;
    clipObj.left = left;
    clipObj.selectable = true;
    clipObj.evented = true;
    canv.renderAll();
  };

  const pattern = () => {
    const activeObj = canv.getActiveObject();
    // let cloneObj;
    activeObj.clone((cloned) => {
      cloned.clipPath = null;
      // cloned.scaleToWidth(200);
      // cloneObj = cloned;
      cloned.left = 0;
      cloned.top = 0;
      const pattern = toPattern(activeObj, cloned);
      // activePattern = pattern;
      const rect = new fabric.Rect({
        width: canv.width,
        height: canv.height,
        fill: pattern,
        selectable: false,
        clipPath: alphaImg,
      });
      // activeObj.patternSource = cloneObj;
      activeObj.activePattern = pattern;
      activeObj.patternRect = rect;
      canv.add(rect);
      rect.sendBackwards();
      // canv.sendToBack(rect);
      // canv.sendToBack(alphaImg);
      canv.renderAll();
    });
    activeObj.on({
      moving: () => {
        activeObj.activePattern.offsetX = activeObj.left;
        activeObj.activePattern.offsetY = activeObj.top;
        canv.renderAll();
      },
      scaling: () => {
        activeObj.patternSourceImg.scaleToWidth(activeObj.getScaledWidth());
        activeObj.patternSourceCanvas.setDimensions({
          width: activeObj.getScaledWidth(),
          height: activeObj.getScaledHeight(),
        });
        activeObj.activePattern.offsetX = activeObj.left;
        activeObj.activePattern.offsetY = activeObj.top;
        canv.renderAll();
      },
    });
  };

  const onClip = useCallback((params) => {
    setClipParams(params);
  }, []);

  // const onClipComplate = (params) => {
  //   const { width, height, cropX, cropY } = params;
  //   console.log("******", params);
  //   clipObj.width = width;
  //   clipObj.height = height;
  //   clipObj.cropX = cropX;
  //   clipObj.cropY = cropY;
  //   canv.renderAll();
  // };

  return (
    <div>
      <h1>FabricJS React Sample</h1>
      <button onClick={addImage}>Add Image</button>
      <button onClick={addImage2}>Add Image2</button>
      <button onClick={addText}>Add Text</button>
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
          <CropLayer clipObj={clipObj.toObject()} onClip={onClip}></CropLayer>
        ) : null}
      </div>
      {/* <canvas id="static-canvas" width={500} height={500}></canvas> */}
      {/* <canvas id="canvas2"></canvas> */}
    </div>
  );
};
export default Demo;
