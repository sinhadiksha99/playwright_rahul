import ExcelJS from 'exceljs'

async function excelTestDemo() {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile("/Users/dikshasinha/Downloads/excelDemo.xlsx").then(function () {
        const workSheet = workbook.getWorksheet("Sheet1");
        workSheet?.eachRow((row, rowNumber) => {
            row.eachCell((cell, cellNumber) => {
                console.log(cell.value)
            })
        });
    })
}

async function verifyValuePresent(name: string) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile("/Users/dikshasinha/Downloads/excelDemo.xlsx").then(function () {
        const workSheet = workbook.getWorksheet("Sheet1");
        console.log(workSheet?.getCell(3,2).value)
        workSheet?.eachRow((row, rowNumber) => {
            row.eachCell((cell, cellNumber) => {
                if(cell.value?.toString() === name){
                    console.log(rowNumber,cellNumber);
                }
            })
        });
    })
}

async function updateCellValue() {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile("/Users/dikshasinha/Downloads/excelDemo.xlsx").then(function(){
        const workSheet = workbook.getWorksheet("Sheet1");
        const cell = workSheet?.getCell(3,2);
        cell!.value = "Iphone";
        workbook.xlsx.writeFile("/Users/dikshasinha/Downloads/excelDemo.xlsx")
    })
}

let cellUpdated = false;
async function updateCellvalueWithMatch(name: string) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile("/Users/dikshasinha/Downloads/excelDemo.xlsx").then(function () {
        const workSheet = workbook.getWorksheet("Sheet1");
        workSheet?.eachRow((row, rowNumber) => {
            row.eachCell((cell, cellNumber) => {
                if(cell.value?.toString() === name){
                    cell.value = "SamsungNew";
                    cellUpdated = true;
                }
            })
        });
        if(cellUpdated){
            workbook.xlsx.writeFile("/Users/dikshasinha/Downloads/excelDemo.xlsx")
        }
    })
}
// excelTestDemo()
// verifyValuePresent("Apple");
// updateCellValue();
updateCellvalueWithMatch("Banana")