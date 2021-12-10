import React, {
  useRef,
  useState,
  useCallback,
  // useMemo,
  useEffect,
} from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import "./demo.css";

const CropLayer = ({ clipObj, onClip }) => {
  const { src } = clipObj;
  const imgRef = useRef();
  const [crop, setCrop] = useState({});
  const [completedCrop, setCompletedCrop] = useState();
  const [cropStyle, setCropStyle] = useState();

  // const cropStyle = useMemo(() => {
  //   if (imgRef.current) {
  //     return {
  //       top: `${clipObj.top - clipObj.cropX}px`,
  //       left: `${clipObj.left - clipObj.cropY}px`,
  //       width: `${clipObj.scaleX * imgRef.current.naturalWidth}px`,
  //       height: `${clipObj.scaleY * imgRef.current.naturalHeight}px`,
  //     };
  //   }
  //   return {};
  // }, [clipObj]);

  // const init = useCallback(
  //   (img) => {
  //     // if (!imgRef.current) return;
  //     // const img = imgRef.current;
  //     console.log("******", img.naturalHeight, img.naturalWidth);
  //     setCropStyle({
  //       top: `${clipObj.top - clipObj.cropX}px`,
  //       left: `${clipObj.left - clipObj.cropY}px`,
  //       width: `${clipObj.scaleX * img.naturalWidth}px`,
  //       height: `${clipObj.scaleY * img.naturalHeight}px`,
  //     });
  //   },
  //   [clipObj]
  // );

  useEffect(() => {
    console.log("crop layer init");
  }, []);

  const onLoad = useCallback(
    (img) => {
      imgRef.current = img;
      // init(img);
      console.log("******", clipObj, img.naturalHeight, img.naturalWidth);
      const scaleX = img.naturalWidth / img.width;
      const scaleY = img.naturalHeight / img.height;
      setCropStyle({
        top: `${clipObj.top - clipObj.cropX * clipObj.scaleX}px`,
        left: `${clipObj.left - clipObj.cropY * clipObj.scaleY}px`,
        width: `${clipObj.scaleX * img.naturalWidth}px`,
        height: `${clipObj.scaleY * img.naturalHeight}px`,
      });
      setCrop({
        x: clipObj.cropX / scaleX,
        y: clipObj.cropY / scaleY,
        width: clipObj.width / scaleX,
        height: clipObj.height / scaleY,
      });
    },
    [clipObj]
  );

  useEffect(() => {
    if (!completedCrop || !imgRef.current) {
      return;
    }
    const image = imgRef.current;
    const crop = completedCrop;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    // console.log("******", completedCrop);
    onClip({
      width: crop.width * scaleX,
      height: crop.height * scaleY,
      cropX: crop.x * scaleX,
      cropY: crop.y * scaleY,
      left: clipObj.left + crop.x,
      top: clipObj.top + crop.y,
    });
    // console.log("******", completedCrop);
  }, [completedCrop]);

  return (
    <div className="crop-container" style={cropStyle}>
      <ReactCrop
        src={src}
        crop={crop}
        onChange={(c) => setCrop(c)}
        onComplete={(c) => setCompletedCrop(c)}
        onImageLoaded={onLoad}
      ></ReactCrop>
    </div>
  );
};
export default CropLayer;
