const express = require('express');
const hbs = require('hbs');
const app = express();

app.set('view engine', 'hbs');
app.use(express.json());       
app.use(express.urlencoded({extended: true}));  // so we can get the data passed from the form
app.use(express.static(__dirname));

const fs = require('fs');


app.get('/', (req, res) => {
	res.render('login')
})

app.post('/bankActions', (request, response) => {
	const txtAccountName = request.body.txtAccountName;
	const txtAccountNumber = request.body.txtAccountNumber;
	const radioBalance = request.body.radioBalance;
	const radioDeposit = request.body.radioDeposit;
	const radioWithdrawal = request.body.radioWithdrawal;
	// get all the other radio buttons!
	
	if(radioBalance !== undefined){
		// loop over the accounts.json, get the balance (if account # doesnt exist, send an error msg)
		let validAccountNumber = false;
		fs.readFile('./views/accounts.json', 'utf8', (error, data) => {
			let accounts = JSON.parse(data);
			let keys = Object.keys(accounts);
			for(var i = 0; i < keys.length; i++){
				let account = keys[i];
				if(account == txtAccountNumber){
					validAccountNumber = true;
					let account_type = accounts[account]["accountType"];
					let account_balance = accounts[account]["accountBalance"];
					response.render('balance', {username: txtAccountName, account_number: txtAccountNumber, account_type: account_type, account_balance: account_balance})
				}
			}
			if(!validAccountNumber){
				response.render('webbank', {baStatus: "Invalid Account Number", username: txtAccountName });
			}
		});
	}
	if(radioDeposit !== undefined){
		let validAccountNumber = false;
                fs.readFile('./views/accounts.json', 'utf8', (error, data) => {
                        let accounts = JSON.parse(data);
                        let keys = Object.keys(accounts);
                        for(var i = 0; i < keys.length; i++){
                                let account = keys[i];
                                if(account == txtAccountNumber){
                                        response.render('deposit', {username: txtAccountName, account_number: txtAccountNumber })
                                }
                        }
                        if(!validAccountNumber){
                                response.render('webbank', {baStatus: "Invalid Account Number", username: txtAccountName });
                        }
                });
	}
	if(radioWithdrawal !== undefined){
		let validAccountNumber = false;
                fs.readFile('./views/accounts.json', 'utf8', (error, data) => {
                        let accounts = JSON.parse(data);
                        let keys = Object.keys(accounts);
                        for(var i = 0; i < keys.length; i++){
                                let account = keys[i];
                                if(account == txtAccountNumber){
                                        response.render('withdrawal.hbs', {username: txtAccountName, account_number: txtAccountNumber })
                                }
                        }
                        if(!validAccountNumber){
                                response.render('webbank', {baStatus: "Invalid Account Number", username: txtAccountName });
                        }
                });
	}

})

app.post('/login', (request, response) => {
	const txtUserName = request.body.txtUserName;
	const txtPassword = request.body.txtPassword;
	let validUser = false;
	let validPW = false;
	// loop over the user.json and check if txtUserName is valid, and if pw is correct
	fs.readFile('./views/user.json', 'utf8', (error, data) => {
		let users = (JSON.parse(data));
		let keys = Object.keys(users);
		for(var i = 0; i < keys.length; i++){
			let key = keys[i]; // username!!!!, users[key] is the pw!!!!
			if(key == txtUserName){
				validUser = true;
			}
			if(users[key] == txtPassword){
				validPW = true;
			}
		}
		if(!validUser){
			response.render('login', {status: "Not a registered username"})
			return false;
		}
		if(!validPW){
			response.render('login', {status: "Invalid password"})
			return false;
		}
		// did we get the pw right?
		response.render('webbank', {username: txtUserName, baStatus: ""})
	});

})

app.get('/webbank', (req, res) => {
	if(!req.params.username){
		res.render('login');
		return false;
	}
	res.render('webbank', {baStatus: ""});
})

app.listen(3000, () => { console.log("SUCCESS!"); });
