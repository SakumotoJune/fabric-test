import React, { useEffect } from "react";
import { fabric } from "fabric";
// const backUrl = "//biu-hk.dwstatic.com/sky/20211021/o1vEtzCIp0q3fyPS.png";
// const backAlphaUrl = "//biu-hk.dwstatic.com/sky/20211021/IMDu5E6woFe7V5kF.png";
const alphaUrl =
  "https://biu-hk.dwstatic.com/sky/20211110/yQp6Iu0F3muVBB1K.png";
const img1 =
  "https://fashionline-cn.oss-cn-shenzhen.aliyuncs.com/user/3306868428/NytFkDsBRl3714727388591783mrCHUsiExj";
const img2 =
  "https://fashionline-cn.oss-cn-shenzhen.aliyuncs.com/user/3306868428/NSQBExUeRN3666554485741945HrktWBEiBE";

const Demo = () => {
  let canv, alphaImg;

  const init = () => {
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
      alphaImg = img;
    });
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    canv = new fabric.Canvas("canv", {
      height: 800,
      width: 800,
      backgroundColor: "pink",
      centeredRotation: true,
      preserveObjectStacking: true,
    });
    init();
  }, []);

  const addImage = () => {
    new fabric.Image.fromURL(img1, (img) => {
      img.set({
        // width: 100,
        // height: 100,
        // width: 2048, // 原图中裁剪长宽
        // height: 2048,
        // clipPath: alphaImg,
        selectable: true,
      });
      img.scaleToWidth(200);
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

  const clip = () => {};

  const confirm = () => {};

  const toPattern = (img) => {
    const patternSourceCanvas = new fabric.StaticCanvas();
    console.log("********", img.getScaledWidth(), img.getScaledHeight());
    patternSourceCanvas.add(img);
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
    });
  };

  const pattern = () => {
    const activeObj = canv.getActiveObject();
    const pattern = toPattern(activeObj);
    const rect = new fabric.Rect({
      width: canv.width,
      height: canv.height,
      fill: pattern,
      selectable: false,
      clipPath: alphaImg,
    });
    canv.add(rect);
    canv.sendToBack(rect);
    canv.sendToBack(alphaImg);
    canv.renderAll();
  };

  return (
    <div>
      <h1>FabricJS React Sample</h1>
      <button onClick={addImage}>Add Image</button>
      <button onClick={addText}>Add Text</button>
      <button onClick={rotate}>rotate</button>
      <button onClick={shuipingfanzhuan}>shuipingfanzhuan</button>
      <button onClick={shuzhifanzhuan}>shuzhifanzhuan</button>
      <button onClick={clip}>clip</button>
      <button onClick={confirm}>confirm</button>
      <button onClick={pattern}>pattern</button>
      <canvas
        id="canv"
        width={800}
        height={800}
        style={{ width: "800px", height: "800px", border: "1px solid #000" }}
      ></canvas>
      {/* <canvas id="static-canvas" width={500} height={500}></canvas> */}
      {/* <canvas id="canvas2"></canvas> */}
    </div>
  );
};
export default Demo;
