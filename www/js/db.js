var request = indexedDB.open("mobilediary", 1);

request.onupgradeneeded = function(){
	var db = event.target.result;
	
	// Subjects table
	if(!db.objectStoreNames.contains("subjects")){
		var os = db.createObjectStore("subjects", {keyPath: "id", autoIncrement: true});

		os.createIndex("title", "title", {unique:false});
	}
	
	// Entries table
	if(!db.objectStoreNames.contains("entries")){
		var os = db.createObjectStore("entries", {keyPath: "id", autoIncrement: true});

		os.createIndex("title", "title", {unique:false});
		os.createIndex("subject", "subject", {unique:false});
		os.createIndex("date", "date", {unique:false});
		os.createIndex("body", "body", {unique:false});
	}
	
}

request.onsuccess = function(event){
	console.log('Database opened successfully');
	
	db = event.target.result;
	
	// Get all subjects
	getSubjects();
	
	mobileDiary.onPageInit('index', function(page){
		getSubjects();
	});
	
	mobileDiary.onPageInit('new-entry', function(page){
		getSubjectList();
	});
	
	mobileDiary.onPageInit('new-entry', function(page){
		// Get Formatted Current Date
   		Date.prototype.toDateInputValue = (function() {
	        var local = new Date(this);
	        local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
	        return local.toJSON().slice(0,10);
	    });
	});
}

request.onerror = function(event){
	console.log('Error, Database not opened');
}

function addSubject(){
	var title = $('#title').val();
	var transaction = db.transaction(["subjects"],"readwrite");
	var store = transaction.objectStore("subjects");

	//Define Store
	var subject= {
		title: title
	}

	// Perform the subject add
	var request = store.add(subject);

	//Success
	request.onsuccess = function(event){
		console.log('Subject Added!');
	}

	//Fail
	request.onerror = function(event){
		console.log('There Was An Error!');
	}
}

function getSubjects(){
	console.log('Getting subjects');
	
	var transaction = db.transaction(["subjects"],"readonly");
	
	var store = transaction.objectStore("subjects");
	
	var index = store.index("title");
	
	var output = '';
	
	index.openCursor().onsuccess = function(event){
		var cursor = event.target.result;
		
		if(cursor){
			output += '<li><a href="entries.html" class="item-link">'+
                      '<div class="item-content">'+
                        '<div class="item-inner"> '+
                         '<div class="item-title">'+cursor.value.title+'</div>'+
                        '</div>'+
                      '</div></a></li>';
            cursor.continue();
		}
		$('#subjectList').html(output);
	}
}


// Get a list of subject for the entry form
function getSubjectList(current){
	var transaction = db.transaction(["subjects"],"readonly");
	var store = transaction.objectStore("subjects");
	var index = store.index("title");
	
	var output = '';
	index.openCursor().onsuccess = function(event) {
		var cursor = event.target.result;
		if(cursor) {	
			if(cursor.value.id == current){
				output += '<option value="'+cursor.value.id+'" selected>'+cursor.value.title+'</option>';
			} else {
            	output += '<option value="'+cursor.value.id+'">'+cursor.value.title+'</option>';
        	}
			cursor.continue();
		}
		$("#subjectSelect").html(output);
	}
}

// Add an entry
function addEntry(){
	var title 	= $('#title').val();
	var subject = $('#subjectSelect').val();
	var date 	= $('#datePicker').val();
	var body 	= $('#body').val();

	var transaction = db.transaction(["entries"],"readwrite");

	var store = transaction.objectStore("entries");

	//Define Store
	var entry= {
		title: title,
		subject: subject,
		date: date,
		body:body
	}

	// Perfomr the add
	var request = store.add(entry);

	//Success
	request.onsuccess = function(event){
		console.log('Entry Added!');
	}

	//Fail
	request.onerror = function(event){
		console.log('There Was An Error!');
	}
}

// Display entries
function getEntries(subjectId){
	mobileDiary.onPageInit('entries', function (page) {
		getSubjectTitle(subjectId);
   		var transaction = db.transaction(["entries"],"readonly");
		var store = transaction.objectStore("entries");
		var index = store.index("title");

		var output = '';
		index.openCursor().onsuccess = function(event){
			var cursor = event.target.result;
			if(cursor){
				if(cursor.value.subject == subjectId){
				output += '<li><a onclick="getEntry('+cursor.value.id+')" href="entry.html" class="item-link">'+
	                      '<div class="item-content">'+
	                        '<div class="item-inner"> '+
	                         '<div class="item-title">'+cursor.value.title+'</div>'+
	                        '</div>'+
	                      '</div></a></li>';
	            }
	            cursor.continue();
			}
			$('#entryList').html(output);
		}
	});
}
