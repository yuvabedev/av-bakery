const multer = require("multer");
var util = require('util');

var path = require('path');

var filename = path.basename(__filename);

var uploadHandler = null;

const Image_Storage = multer.diskStorage({
    destination: function(request, file, cb) {
        cb(null, './upload/product');
    },
  
    // By default, multer removes file extensions so let's add them back
    filename: function(request, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });

  
const Image_Filter = function(request, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
      request.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  };


  function initializeUploadHandler(fileStorage, filter, fileInput) {
    let upload = multer({ storage: fileStorage, fileFilter: filter }).single(fileInput);
    console.log(util.format("%s: Initialized Fileupload Handler", filename));
    uploadHandler = upload;
    return upload;
  }

  function uploadImage(request, response, callback) {

        uploadHandler(request, response, function(err) {
            if (request.fileValidationError) {
                return response.send(req.fileValidationError);
            }
            else if (!request.file) {
                return response.send('Please select an image to upload');
            }
            else if (err instanceof multer.MulterError) {
                callback(err);
            }
            else if (err) {
                callback(err);
            }
            // Display uploaded image for user validation
            //response.send(`You have uploaded this image: <hr/><img src="${request.file.path}" width="500"><hr /><a href="./">Upload another image</a>`);
            //return;
        });
    }

    module.exports = {
        Image_Storage,
        Image_Filter,
        initializeUploadHandler,
        uploadImage
      };