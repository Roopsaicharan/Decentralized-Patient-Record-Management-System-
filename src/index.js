const express = require("express")
const path = require("path")

const bodyParser = require('body-parser');
const app = express()
// const hbs = require("hbs")
const { LogInCollection, Patient } = require("./mongo"); // Corrected import

const port = process.env.PORT || 3000
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));  // Parse form data (urlencoded)
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }))

const tempelatePath = path.join(__dirname, '../tempelates')
const publicPath = path.join(__dirname, '../Public')
console.log(publicPath);

app.set('view engine', 'hbs')
app.set('views', tempelatePath)
app.use(express.static(publicPath))

const { Web3 } = require('web3');
const PatientRecordsJSON = require('../build/contracts/PatientRecords.json'); // Adjust the path if needed

const web3 = new Web3('http://127.0.0.1:7545'); // Replace with your blockchain provider
const contractAddress = '0xFBC3a81F6aBfD962C0c0a89479c2cCDF1E68aaC7'; // Update with your contract address
const patientContract = new web3.eth.Contract(PatientRecordsJSON.abi, contractAddress);
const privateKey = '0xf2a64d12648abf3e553ab4d45dbeba22806bb372a66a59bcf486e2ca95e98d33'; // Replace with your actual private key
const account = web3.eth.accounts.privateKeyToAccount(privateKey);

// Set the default account for transactions
web3.eth.defaultAccount = account.address;


// hbs.registerPartials(partialPath)


app.get('/signup', (req, res) => {
    res.render('signup')
})
app.get('/', (req, res) => {
    res.render('login')
})



app.get('/home', (req, res) => {
    res.render('home')
})

app.post('/signup', async (req, res) => {
    
    // const data = new LogInCollection({
    //     name: req.body.name,
    //     password: req.body.password
    // })
    // await data.save()

    const data = {
        name: req.body.name,
        password: req.body.password
    }

    const checking = await LogInCollection.findOne({ name: req.body.name })

   try{
    if (checking.name === req.body.name && checking.password===req.body.password) {
        res.send("user details already exists")
    }
    else{
        await LogInCollection.insertMany([data])
    }
   }
   catch{
    res.send("wrong inputs")
   }

    res.status(201).render("home", {
        naming: req.body.name
    })
})


app.post('/login', async (req, res) => {

    try {
        const check = await LogInCollection.findOne({ name: req.body.name })

        if (check.password === req.body.password) {
            res.status(201).render("home", { naming: `${req.body.password}+${req.body.name}` })
        }

        else {
            res.send("incorrect password")
        }


    } 
    
    catch (e) {

        res.send("wrong details")
        

    }


})

app.get('/feature0', (req, res) => {
    res.render('feature0', { title: "Accurate Diseases Prediction" });
  });

  app.post('/feature0', async (req, res) => {
    const { name, age, gender, patient_id, record_id, Disease } = req.body;

    const data = {
        name,
        age,
        gender,
        patient_id,
        record_id,
        Disease,
    };

    try {
        const existingPatient = await Patient.findOne({ patient_id });

        if (existingPatient) {
            return res.json({ success: false, message: "Patient details already exist" });
        }

        // Save to MongoDB
        const patient = new Patient(data);
        await patient.save();

        res.json({ success: true, message: "Patient data saved to MongoDB" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error in saving patient data" });
    }
});





app.get('/feature1', (req, res) => {
    res.render('feature1', { title: "Accurate Diseases Prediction" });
  });

  
app.get('/feature2', (req, res) => {
    res.render('feature2', { title: "Accurate Diseases Prediction" });
  });

app.get('/feature3', (req, res) => {
    res.render('feature1', { title: "Accurate Diseases Prediction" });
  });
  // Feature 3 - Patient report upload and file hashing
app.get('/feature4', (req, res) => {
    res.render('feature4', { title: "Patient Report Upload" });
  });

  app.get('/feature4/blockchain/:doctorId', async (req, res) => {
    try {
        const { Doctor_id } = req.params;
        const patients = await getPatientsByDoctorFromBlockchain(Doctor_id);

        if (!patients || !Array.isArray(patients) || patients.length === 0) {
            return res.json({ success: false, message: "No patients found for this doctor" });
        }

        res.json({ success: true, patients });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error fetching data from Blockchain" });
    }
});

app.post('/feature4/blockchain', async (req, res) => {
    const { Doctor_id } = req.body; // Get the Doctor_id from the request body
    console.log("Doctor_Id:", Doctor_id); // Log the Doctor_Id

    try {
        const patients = await getPatientsByDoctorFromBlockchain(Doctor_id);

        if (!patients || !Array.isArray(patients) || patients.length === 0) {
            return res.json({ success: false, message: "No patients found for this doctor" });
        }

        res.json({ success: true, patients });
    } catch (error) {
        console.error("Error fetching patients:", error);
        res.status(500).json({ success: false, message: "Error fetching data from Blockchain" });
    }
});

  app.get('/feature5', (req, res) => {
    res.render('feature5', { title: "Patient Report Upload" });
  });

  app.post('/feature5', async (req, res) => {
    try {
        const { patient_id, Doctor_id } = req.body;

        const patient = await Patient.findOne({ patient_id });

        if (!patient) {
            return res.status(404).render('feature5', { message: "Patient not found" });
        }

        if (patient.Doctor_id === Doctor_id) {
            return res.status(400).render('feature5', { message: "Doctor already assigned to this patient" });
        }

        // Update the patient with the Doctor_id
        patient.Doctor_id = Doctor_id;
        await patient.save();

        res.status(200).render('feature5', { message: "Doctor assigned to patient successfully" });

        // After updating the Doctor_id in MongoDB, save the patient data to the blockchain
        await addPatientToBlockchain(patient);
        
    } catch (error) {
        console.error("Error:", error);
        res.status(500).render('feature5', { message: "An error occurred while assigning the doctor to the patient" });
    }
});



async function addPatientToBlockchain(patient) {
    const { name, age, gender, patient_id, record_id, Disease, Doctor_id } = patient;

    try {
        // Ensure all necessary data is available
        if (!name || !age || !gender || !patient_id || !record_id || !Disease || !Doctor_id) {
            throw new Error('Missing required patient data');
        }

        // Sign the transaction with the private key
        const signedTransaction = await web3.eth.accounts.signTransaction(
            {
                to: contractAddress, // Target contract address
                data: patientContract.methods.addPatient(name, age, gender, patient_id, record_id, Disease, Doctor_id).encodeABI(),
                gas: 2000000, // Gas limit
            },
            privateKey // Your private key
        );

        // Send the signed transaction
        const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
        
        console.log('Transaction result:', receipt);
    } catch (error) {
        console.error('Error while adding patient to blockchain:', error);
    }
}




async function getPatientsByDoctorFromBlockchain(Doctor_Id) {
    console.log("Doctor_Id:", Doctor_Id); // Log the Doctor_Id
    if (Doctor_Id === undefined || Doctor_Id === null) {
        throw new Error("Doctor_Id is undefined or null");
    }
    try {
        return await patientContract.methods.getPatientsByDoctor(Doctor_Id).call({ gas: 3000000 });
    } catch (error) {
        console.error("Error fetching patients from blockchain:", error);
        throw error; // Rethrow the error for further handling
    }
}   



app.listen(port, () => {
    console.log('port connected');
})