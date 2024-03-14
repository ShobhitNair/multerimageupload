const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const dotenv = require('dotenv')
const UserModel = require('./models/User')

const filePath = __filename;
const dirName = path.dirname(filePath);
const app = express();
const PORT = process.env.PORT || 3001
app.use(cors())
dotenv.config();
app.use(express.json())
// app.use(express.static('public'))
app.use("/Images", express.static(path.join(dirName, "public/Images")));



const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null, 'public/Images')
    },
    filename:(req,file,cb)=>{
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({
    storage: storage
})

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const result = await UserModel.create({ image: req.file.filename });
        res.json(result);
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.get('/getImage', (req,res)=>{
    UserModel.find()
    .then(users =>res.json(users))
    .catch(err => res.json(err))
})

app.use(express.static(path.resolve(dirName,"client","build")));
app.get('/',(req,res)=>{
  res.sendFile(path.resolve(dirName,"client","build","index.html"))
  
})

mongoose.connect(process.env.MONGO_URL,{
}).then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
}).catch((error) => console.log(`${error} did not connect`));
