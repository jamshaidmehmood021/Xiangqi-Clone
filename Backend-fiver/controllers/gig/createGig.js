const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const Gig = require('../../models/Gig');
const User = require('../../models/User');

const supabase = createClient(process.env.PROJ_API, process.env.PROJ_KEY);

const uploadFile = async (filePath, fileName) => {
    try {
      const file = fs.readFileSync(filePath);
      const { data, error } = await supabase.storage
        .from('uploads') 
        .upload(fileName, file,{contentType: 'image/jpeg',}); 
  
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

const createGig = async (req, res) => {
  try {
    const { title, category, userId } = req.body;

    const image = req.file ? req.file.path : null; 
    const video = req.files && req.files.video ? req.files.video[0].path : null; 

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const imageUrl = image ? await uploadFile(image, req.file.filename) : null;
    const videoUrl = video ? await uploadFile(video, req.files.video[0].filename) : null;

    const gig = await Gig.create({
      title,
      category,
      image: imageUrl, 
      video: videoUrl,
      userId,
    });

    return res.status(201).json({ message: 'Gig created successfully', gig });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = createGig;
