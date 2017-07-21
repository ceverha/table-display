$(document).ready(() => {
    $('#tableName').change( function(){
	checkParams();
    });
    $('#awsKey').change( function(){
	checkParams();
    });
    $('#awsSecretKey').change( function(){
	checkParams();
    });
    $('#primaryKey').change( function(){
	checkParams();
    });
});

const tableNameRegex = /[\w_\-\.]{3,255}/;
const awsKeyRegex = /[A-Z0-9]{20}/;
const awsSecretKeyRegex = /\w{40}/;

function checkParams() {
    const tableName = $('#tableName').val();
    const awsKey = $('#awsKey').val();
    const awsSecretKey = $('#awsSecretKey').val();
    const primaryKey = $('#primaryKey').val();
    if (!tableNameRegex.test(tableName)) {
	console.log('Invalid table name');
	return false;
    }
    if (!awsKeyRegex.test(awsKey)) {
	console.log('Invalid access key');
	return false;
    }
    if (!awsSecretKeyRegex.test(awsSecretKey)) {
	console.log('Invalid secret key');
	return false;
    }
    // we're all good, try to build a config account
    try {
	var creds = new AWS.Credentials(awsKey, awsSecretKey, null);
    } catch(err) {
	console.log(err);
	return false;
    }
    console.log(creds);
    return updateTable(creds, tableName, primaryKey);
}

function updateTable(creds, tableName, primaryKey) {
    AWS.config.update({
	region: 'us-east-1',
	sslEnabled: false,
	credentials: creds
	// logger: process.stdout
    });
    $('#tableHeading').html('');
    $('#tableBody').html('');
    $('#pageTitle').html(tableName);
    
    var DB = new AWS.DynamoDB();

    if (primaryKey !== '') {
	// display the one value with this primary key
	const params = {
	    TableName: tableName,
	    Key: {
		'Food': {
		    'S': primaryKey
		}
	    }
	};
	return DB.getItem(params).promise()
	    .then((response) => {
		let headingString = '<tr>';
		let appendString = '<tr>';
		for (let key in response.Item) {
		    headingString += '<th>' + key + '</th>';
		    appendString += '<td>' + response.Item[key].S  + '</td>';
		}
		headingString += '</tr>';
		appendString += '</tr>';
		$('#tableHeading').append(headingString);
		$('#tableBody').append(appendString);
	    });
    } else {
	// display the entire table
	const params = {
	    TableName: tableName
	};
	return DB.scan(params).promise()
	    .then((response) => {
		let appendString = '';
		let headingString = '';
		response.Items.forEach((item) => {
		    headingString = '<tr>';
		    appendString += '<tr>';
		    for (let key in item) {
			headingString += '<th>' + key + '</th>';
			appendString += '<td>' + item[key].S  + '</td>';
		    }
		    headingString += '</tr>';
		    appendString += '</tr>';
		});
		$('#tableHeading').append(headingString);
		$('#tableBody').append(appendString);
	    });
    }
}
