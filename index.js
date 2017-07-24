$(document).ready(() => {
    $('#uuidButton').click(() => {
	console.log(checkUuidParams());
    });
    $('#locationButton').click(() => {
	console.log(checkLocationParams());
    });
});

const xApiKeyRegex = /\w{40}/;
function checkUuidParams() {
    const xApiKey = $('#xApiKey').val();
    if (!xApiKeyRegex.test(xApiKey)) {
	console.log('Invalid api key');
	return false;
    }
    const endpoint = 'https://p2fub7qrhh.execute-api.us-east-1.amazonaws.com/Prod/getallbeacons';
    $.ajax({
	url: endpoint,
	type: 'GET',
	beforeSend: (xhr) => {xhr.setRequestHeader('x-api-key', xApiKey);},
	success: (response) => {
	    if (!response.errorMessage) {
		updateUuidTable(response);
	    } else {
		console.log(response);
	    }
	}
    });
    
    return true;
}
function updateUuidTable(data) {
    $('#uuidHeading').html('');
    $('#uuidBody').html('');
    
    let headingString = '';
    let appendString = '';
    data.forEach((beacon) => {
	headingString = '<tr>';
	appendString += '<tr>';
	for (let key in beacon) {
	    headingString += '<th>' + key + '</th>';
	    appendString += '<td>' + beacon[key]  + '</td>';
	}
	headingString += '</tr>';
	appendString += '</tr>';
    });
    
    
    $('#uuidHeading').append(headingString);
    $('#uuidBody').append(appendString);
}

const uuidRegex = /\w{8}\-\w{4}\-\w{4}\-\w{4}\-\w{12}/;
function checkLocationParams() {
    const xApiKey = $('#xApiKey').val();
    if (!xApiKeyRegex.test(xApiKey)) {
	console.log('Invalid api key');
	return false;
    }
    const uuid = $('#uuid').val();
    if (!uuidRegex.test(uuid)) {
	console.log('Invalid uuid');
	return false;
    }
    const endpoint = 'https://p2fub7qrhh.execute-api.us-east-1.amazonaws.com/Prod/getbeaconsfromuuid';
    $.ajax({
	url: endpoint,
	type: 'POST',
	data: '{UUID: uuid}',
	dataType: 'json',
	headers: {
	    'x-api-key': xApiKey
	},
	error: (xhr, status, error) => {
	    console.log(xhr);
	    console.log(status);
	    console.log(error);
	},
	success: (response) => {
	    if (!response.errorMessage) {
		updateLocationTable(response);
	    } else {
		console.log(response);
	    }
	}
    });
    
    return true;
}

function updateLocationTable(data) {
    console.log(data);
}
