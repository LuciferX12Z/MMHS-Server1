const cloudinary = require("cloudinary").v2;

async function uploadToCloudinary(imageToBeUploaded) {
  const imagesToBeUploaded = imageToBeUploaded?.fileList?.filter(
    (image) => image?.name
  );
  let imagesToNotBeUploaded = [];
  for (i = 0; i < imageToBeUploaded?.fileList?.length; i++) {
    if (imageToBeUploaded?.fileList[i]?.url) {
      imagesToNotBeUploaded.push({
        url: imageToBeUploaded?.fileList[i]?.url,
        public_id: imageToBeUploaded?.fileList[i]?.public_id,
      });
    }
  }

  let images = [];
  for (let i = 0; i < imagesToBeUploaded?.length; i++) {
    const img = await cloudinary.uploader
      .upload(imagesToBeUploaded[i]?.image?.image, (error, result) => {
        return result.secure_url;
      })
      .then((value) =>
        images.push({
          url: value.secure_url,
          public_id: value.public_id,
        })
      );
    // .then((value) => images.push(value.secure_url));
  }
  return [...images, ...imagesToNotBeUploaded];
}

module.exports = uploadToCloudinary;
