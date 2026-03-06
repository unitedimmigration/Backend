const express = require('express')
const multer = require('multer')
const cors = require('cors')
const PDFDocument = require('pdfkit')
const fs = require('fs')

const app = express()

app.use(cors())
app.use(express.json())

const upload = multer({ dest: 'uploads/' })

// Upload images
app.post('/upload', upload.array('files'), (req, res) => {

    res.json({
        message: "Files uploaded successfully",
        files: req.files
    })

})


// Generate Question Paper
app.post('/generate-paper', (req, res) => {

    const difficulty = req.body.difficulty

    let questions = []

    if(difficulty === "easy"){
        questions = [
            "1. Define photosynthesis.",
            "2. What is gravity?",
            "3. Name the planets of solar system."
        ]
    }

    else if(difficulty === "normal"){
        questions = [
            "1. Explain photosynthesis with diagram.",
            "2. Describe the water cycle.",
            "3. Solve: 2x + 5 = 15"
        ]
    }

    else{
        questions = [
            "1. Explain Newton's laws.",
            "2. Describe the carbon cycle.",
            "3. Solve: 3x² + 5x − 2 = 0"
        ]
    }

    res.json({
        title:"AI Generated Question Paper",
        questions:questions
    })

})



// Download PDF
app.post('/download-pdf', (req,res)=>{

    if(!fs.existsSync("papers")){
        fs.mkdirSync("papers")
    }

    const doc = new PDFDocument()

    const filePath = "papers/paper.pdf"

    doc.pipe(fs.createWriteStream(filePath))

    doc.fontSize(20).text("Exam Question Paper",{align:"center"})

    doc.moveDown()

    doc.fontSize(12).text("1. Define photosynthesis.")
    doc.text("2. Explain the water cycle.")
    doc.text("3. What is gravity?")
    doc.text("4. Solve: 2x + 5 = 15")

    doc.end()

    doc.on("finish",()=>{
        res.download(filePath)
    })

})



const PORT = process.env.PORT || 3000

app.listen(PORT, ()=>{
    console.log("Server running on port " + PORT)
})