'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { CldImage, getCldImageUrl } from 'next-cloudinary';
import {
  dataUrl,
  debounce,
  getImageSize,
  download,
  AspectRatioKey,
} from '@/lib/utils';
import { PlaceholderValue } from 'next/dist/shared/lib/get-img-props';
import { aspectRatioOptions } from '@/constants';

const TransformedImage = ({
  image,
  type,
  title,
  transformationConfig,
  isTransforming,
  setIsTransforming,
  hasDownload = false,
}: TransformedImageProps) => {
  const downloadHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    // TODO: figure out how to get the aspect ratio from the transformed image
    const imageSize = aspectRatioOptions[image.aspectRatio as AspectRatioKey];

    e.preventDefault();
    const url = getCldImageUrl({
      width: imageSize.width, // image?.width,
      height: imageSize.height,
      src: image?.publicId,
      ...transformationConfig,
    });

    // no WH:              res.cloudinary.com/drqzbwrjf/image/upload/f_auto/q_auto/v1/photo-studio/qgrm6v1g7e4hhhkvuvm8?_a=BAVCcWBy0
    // aspect ratio size : res.cloudinary.com/drqzbwrjf/image/upload/b_gen_fill,ar_1000:1334,c_pad/c_limit,w_1000/f_auto/q_auto/v1/photo-studio/cbljvrchbeodp83t1iw5?_a=BAVCcWBy0
    //original size:       res.cloudinary.com/drqzbwrjf/image/upload/b_gen_fill,ar_1200:1600,c_pad/c_limit,w_1200/f_auto/q_auto/v1/photo-studio/qgrm6v1g7e4hhhkvuvm8?_a=BAVCcWBy0
    //transformed          res.cloudinary.com/drqzbwrjf/image/upload/b_gen_fill,ar_2885:1920,c_pad/c_limit,w_2885/f_auto/q_auto/v1/photo-studio/qgrm6v1g7e4hhhkvuvm8?_a=BAVCcWBy0
    // ar_2885:1920  w_2885

    download(url, title);
  };
  const [isImageReady, setIsImageReady] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex-between">
        <h3 className="h3-bold text-dark-600">Transformed</h3>

        {hasDownload && (
          <button className="download-btn" onClick={downloadHandler}>
            <Image
              src="/assets/icons/download.svg"
              alt="Download"
              width={24}
              height={24}
              className="pb-[6px]"
            />
          </button>
        )}
      </div>

      {image?.publicId && transformationConfig ? (
        <div className="relative">
          <CldImage
            width={getImageSize(type, image, 'width')}
            height={getImageSize(type, image, 'height')}
            src={image?.publicId}
            alt={image.title}
            sizes={'(max-width: 767px) 100vw, 50vw'}
            placeholder={dataUrl as PlaceholderValue}
            className="transformed-image"
            onLoad={() => {
              setIsTransforming && setIsTransforming(false);
              setIsImageReady(true);
            }}
            onError={() => {
              debounce(() => {
                setIsTransforming && setIsTransforming(false);
              }, 8000)();
            }}
            {...transformationConfig}
          />

          {isTransforming && !isImageReady && (
            <div className="transforming-loader">
              <Image
                src="/assets/icons/spinner.svg"
                width={50}
                height={50}
                alt="spinner"
              />
              <p className="text-white/80">Please wait...</p>
            </div>
          )}
        </div>
      ) : (
        <div className="transformed-placeholder">Transformed Image</div>
      )}
    </div>
  );
};

export default TransformedImage;
