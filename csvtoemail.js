const fs = require('fs');
const csv = require('csv-parser');
const exceljs = require('exceljs');

const outputFile = `./outputFile${Date.now()}.xlsx`;
const rowspersheet = 700000;

async function processCsv(inputFile){
    const workbook = new exceljs.Workbook();
    let sheetIndex = 1
    let sheet = workbook.addWorksheet(`Sheet${sheetIndex}`);
    let rowCount = 0;
    let headersAdded = false;

    const writeSheet = (row) =>{
        if(!headersAdded){
            sheet.addRow(Object.keys(row));            
            headersAdded = true;
        }
        rowCount++;
        sheet.addRow(Object.values(row));

    if(rowCount > rowspersheet){
        console.log(`Row limit reached. Creating new sheet.`);
        sheetIndex++;
        sheet = workbook.addWorksheet(`Sheet${sheetIndex}`);
        rowCount = 0;
        headersAdded = false;
    }
};

const readStream = fs.createReadStream(inputFile).pipe(csv());

readStream.on('data', (row)=>{
    writeSheet(row);
})
.on('end', async()=>{
    console.log('CSV file processed successfully.');
    try {
        await workbook.xlsx.writeFile(outputFile);
        console.log(`Excel file created successfully at ${outputFile}`);
    } catch (err) {
        console.error(`Error writing Excel file: ${err.message}`);
    }
})
.on('error', (err)=>{
    console.error(`Error processing CSV file: ${err.message}`);
})
};

processCsv('./large_file.csv');



