var express = require('express');
var mongoose = require('mongoose');

var app = express();
mongoose.connect('mongodb://localhost/csrexpodb');

var participantSchema = mongoose.Schema({
    lastName: String,
    firstName: String,
    middleInitial: String,
    controlNumber: String,
    paid: Boolean,
    entered: Boolean
});

console.log('Started');

var Participant = mongoose.model('participants', participantSchema);
app.get('/controlnumbers/:controlNumber',(req,res)=>{
    participant = Participant.find({controlNumber: new RegExp(req.params.controlNumber,"i")},
        (error,response)=>{
            if(error) console.log(error)
            else{
                res.send(response);
            }
        }
    )
});

var currentParticipantPUP;
var currentParticipantNonPUP;
var enteredCount;

app.get('/names/:fullName',(req,res)=>{
    participant = Participant.find(
        {$or:
            [
                {lastName: new RegExp(req.params.fullName,"i")},
                {firstName: new RegExp(req.params.fullName,"i")}
            ]
        },
        (error,response)=>{
            if(error) console.log(error)
            else{
                res.send(response);
            }
        }
    )
});


app.get('/restart',(req,res)=>{
    Participant.updateMany({}, {entered:false}, (err,response)=>{
        if(err) console.log(err)
        else console.log('Restarted');
    })
})

app.put('/participants/:id',(req,res)=>{
    console.log('PUT entered');
    participant = Participant.findByIdAndUpdate(req.params.id,{entered: true}, (err,response)=>{
        if(err) console.log(err)
    });

    Participant.findById(req.params.id, (err,response)=>{
        //if(String(response.controlNumber).substring(0,3) == 'CSR'){
            currentParticipantNonPUP = response;
            currentPaticipantPUP = response;
            console.log('ENTERED: ' + response.lastName + ', ' + response.firstName + ' (Non-PUP)');
        //}
        //else{
            currentParticipantPUP = response;
            console.log('ENTERED: ' + response.lastName + ', ' + response.firstName + ' (PUP)');
        //}
    })

    Participant.count({entered: true}, (err,response)=>{
        enteredCount = response;
    });
})

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/pup',(req,res)=>{
    res.send({
        participant: currentParticipantPUP,
        count: enteredCount
    });
})

app.get('/nonpup',(req,res)=>{
    res.send({
        participant: currentParticipantNonPUP,
        count: enteredCount
    });
})

app.get('/entered', (req,res)=>{
    participants = Participant.find({entered:true},(err,response)=>{
        res.send(response);
    });
});

app.listen(3000);