const express = require('express');
const app = express();
const Post = require('./api/models/posts');
var multer = require('multer');
const postsData = new Post();
var storage = multer.diskStorage({
    destination: function (req, file, cb)
 {
     cb(null, "./uploads")
 },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${getExt(file.mimetype)}`)
    }
})


const getExt = (mimetype) => {
    switch(mimetype){
        case "image/png":
            return '.png';
        case "image/jpeg":
            return '.jpg';
    }
}

var upload = multer({ storage: storage });



app.use(express.json())

app.use((req,res,next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    next();
})

app.use('/uploads', express.static('uploads'))

app.get("/", (req,res) => {
    res.status(200).send('hello')
})

app.get("/api/posts", (req,res) => {

    res.status(200).send(postsData.get())
});

app.get("/api/posts/:post_id", (req,res) => {
    const postId = req.params.post_id;
    const foundPost = postsData.getIndividualBlog(postId)
    if(foundPost) {
        res.status(200).send(foundPost)
    } else {
        res.status(404).send("not found")
    }
})

app.post("/api/posts", upload.single("post-image"), (req, res) => {
    const newPost = {
        "id": `${Date.now()}`,
        "title": req.body.title ,
        "content": req.body.content ,
        "post_image": req.file.path,
        "added_date": `${Date.now()}`
    }
    postsData.add(newPost)
    res.status(201).send(newPost);
})

app.listen(3000, ()=> console.log('listening on port 3000'))