import ExcelJS from 'exceljs'

export async function updateCellvalueWithMatch(name: string, filePath:string, updateValue:string) {
    let cellUpdated = false;
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath).then(function () {
        const workSheet = workbook.getWorksheet("Sheet1");
        workSheet?.eachRow((row) => {
            row.eachCell((cell) => {
                if (cell.value?.toString() === name) {
                    cell.value = updateValue;
                    cellUpdated = true;
                }
            })
        });
        if (cellUpdated) {
            workbook.xlsx.writeFile(filePath)
        }
    })
}
//updqate KIVI Price with 350
export async function updateAnotherCell(name: string, filePath: string) {
    let cellUpdated = false;
    const workbook = new ExcelJS.Workbook();
    let priceColumnNumber: number = -1
    let rowOfMatch: number = -1
    await workbook.xlsx.readFile(filePath).then(function () {
        const workSheet = workbook.getWorksheet("Sheet1");
        workSheet?.getRow(1).eachCell((cell, cellNumber) => {
            if (cell.value === 'price') {
                priceColumnNumber = cellNumber;
            }
        })
        workSheet?.eachRow((row, rowNumber) => {
            row.eachCell((cell) => {
                if (cell.value?.toString() === name) {
                    rowOfMatch = rowNumber;
                    cellUpdated = true
                }
            })
        });
        if (cellUpdated) {
            const cellMatch = workSheet?.getCell(rowOfMatch, priceColumnNumber)
            console.log(cellMatch!.value)
            cellMatch!.value = 5000;
            workbook.xlsx.writeFile(filePath)
        }
        console.log(rowOfMatch, priceColumnNumber)
    })
}
