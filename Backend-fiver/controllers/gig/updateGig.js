const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const Gig = require('../../models/Gig');
const User = require('../../models/User');

const supabase = createClient(process.env.PROJ_API, process.env.PROJ_KEY);

const getContentType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    case '.mp4':
      return 'video/mp4';
    case '.mov':
      return 'video/quicktime';
    case '.avi':
      return 'video/x-msvideo';
    default:
      return 'application/octet-stream'; 
  }
};

const uploadFile = async (filePath, fileName) => {
  try {
    const file = fs.readFileSync(filePath);
    const contentType = getContentType(filePath);
    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(fileName, file, { contentType });

    if (error) {
      throw error;
    }
    const { data: response, error: urlError } = supabase
      .storage
      .from('uploads')
      .getPublicUrl(fileName);
    if (urlError) {
      throw urlError;
    }

    return response.publicUrl;
  } catch (err) {
    console.error('Error uploading file to Supabase:', err.message);
    return null;
  }
};

const updateGig = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const { id } = req.params;

    const gig = await Gig.findByPk(id);
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    const imageFile = req.file || (req.files && req.files.image ? req.files.image[0] : null);
    const imagePath = imageFile ? imageFile.path : null;
    const imageFileName = imageFile ? imageFile.filename : null;
    const imageUrl = imagePath && imageFileName ? await uploadFile(imagePath, imageFileName) : gig.image;

    const videoFile = req.files && req.files.video ? req.files.video[0] : null;
    const videoPath = videoFile ? videoFile.path : null;
    const videoFileName = videoFile ? videoFile.filename : null;
    const videoUrl = videoPath && videoFileName ? await uploadFile(videoPath, videoFileName) : gig.video;

    gig.title = title || gig.title;
    gig.description = description || gig.description;
    gig.category = category || gig.category;
    gig.image = imageUrl || gig.image;
    gig.video = videoUrl || gig.video;

    await gig.save();

    return res.status(200).json({ message: 'Gig updated successfully'});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = updateGig;
