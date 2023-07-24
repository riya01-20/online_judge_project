const express = require('express');
const connectToMongo = require('./db.js');
const cors = require('cors');
const {generateFile} = require('./generateFile');
const { executeCpp } = require('./executeCpp');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const port = 5000;

connectToMongo();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/auth', require('./routes/auth'));

app.use('/api/notes', require('./routes/notes'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})

// app.get('/',(req,res)=>{
//     res.json({online:"compiler"});
// });

app.post('/run',async(req,res)=>{

    //default language is cpp
    const{language = 'cpp',code}=req.body;
    // if code is empty # error;
    if(code=== undefined){
        return res.status(400).json({success: false,error: "Code not found"}); 
    }
    try {
        const filePath = await generateFile(language,code);
        const output = await executeCpp(filePath);
        return res.json({filePath, output});
    } catch (err) {
        return res.status(500).json({err});
    }
});
// app.listen(5000,()=>{
//     console.log("listening on port 5000");
// }); 