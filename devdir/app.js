var mongoose = require('mongoose');
var Excel = require('exceljs')

mongoose.connect('mongodb://localhost/csrexpodb');

var participantSchema = mongoose.Schema({
    lastName: String,
    firstName: String,
    middleInitial: String,
    controlNumber: String,
    paid: Boolean,
    entered: Boolean,
    sukli: Number
});

var Participant = mongoose.model('Participant',participantSchema);

var workbook = new Excel.Workbook();
console.log('phase 1');
workbook.xlsx.readFile('./EventReg_Final2.xlsx').then(()=>{
    index = 0;
    var worksheet = workbook.getWorksheet(1);
    worksheet.eachRow(row=>{
        index = index+1;
        if(index==1) return;
        var participant = new Participant({
            lastName: row.getCell(4).value==null?'':row.getCell(4).value.toUpperCase(),
            firstName: row.getCell(2).value==null?'':row.getCell(2).value.toUpperCase(),
            middleInitial: row.getCell(3).value==null?'':row.getCell(3).value.toUpperCase(),
            controlNumber: row.getCell(8).value==null?'':row.getCell(8).value.toUpperCase(),
            paid: row.getCell(12).value >= 80 ? true : false,
            entered: false,
            sukli: row.getCell(13).result
        });
        participant.save((err,participant)=>{
            if(err){
                console.log(err);
            }
            else
                console.log(participant + '');
        });
    });
    console.log(index-1 + ' participants added')
})
