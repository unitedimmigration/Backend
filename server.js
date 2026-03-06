const express = require('express')
const multer = require('multer')
const cors = require('cors')
const PDFDocument = require('pdfkit')
const fs = require('fs')

const app = express()
app.use(cors())
app.use(express.json())

const upload = multer({ dest: 'uploads/' })

app.post('/upload', upload.array('files'), (req, res) => {
    res.json({message: "Files uploaded successfully", files: req.files})
})

app.post('/generate-paper', (req, res) => {
    const questions = [
        "1. Define photosynthesis.",
        "2. Explain the water cycle.",
        "3. What is gravity?",
        "4. Solve: 2x + 5 = 15",
        "5. Draw and label a plant cell."
    ]

    res.json({
        paper:{
            title:"AI Generated Question Paper",
            questions:questions
        }
    })
})

app.post('/download-pdf', (req,res)=>{
    const doc = new PDFDocument()
    const filePath = "papers/paper.pdf"
    doc.pipe(fs.createWriteStream(filePath))

    doc.fontSize(20).text("Exam Question Paper", {align:"center"})
    doc.moveDown()

    doc.fontSize(12).text("1. Define photosynthesis.")
    doc.text("2. Explain the water cycle.")
    doc.text("3. What is gravity?")

    doc.end()

    doc.on("finish",()=>{
        res.download(filePath)
    })
})

app.listen(3000, ()=>{
    console.log("Server running on port 3000")
})