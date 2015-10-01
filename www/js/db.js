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