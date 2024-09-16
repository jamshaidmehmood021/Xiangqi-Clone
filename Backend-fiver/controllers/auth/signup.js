const bcrypt = require('bcrypt');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
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

const signup = async (req, res) => {
  const { name, email, password, role } = req.body;
  const profilePicturePath = req.file ? req.file.path : null; 

  if (!name || !email || !password || !role) {
    return res.status(400).json({
      message: 'Name, email, password, and role are required!',
      error: true,
    });
  }

  try {
    const key = parseInt(process.env.KEY || '', 10);
    if (!key) {
      console.error('Key is required!');
      process.exit(1);
    }
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists', error: true });
    }

    const hash = await bcrypt.genSalt(key);
    const encryptedPassword = await bcrypt.hash(password, hash);


    const profilePictureUrl = profilePicturePath
      ? await uploadFile(profilePicturePath, req.file.filename)
      : 'default.jpg';

    const user = await User.create({
      name,
      email,
      password: encryptedPassword,
      role,
      profilePicture: profilePictureUrl,
    });

    return res.status(200).json({ message: 'User added successfully.', error: false });
  } catch (e) {
    console.error('SignUp Error', e);
    return res.status(500).json({ message: 'Internal Server Error', error: true });
  }
};

module.exports = signup;
