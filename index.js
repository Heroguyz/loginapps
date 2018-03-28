firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.

    document.getElementById("user_div").style.display = "block";
    document.getElementById("login_div").style.display = "none";

    var user = firebase.auth().currentUser;
    var photoURL ;

    if(user != null){

      var email_id = user.email;
      //photoURL =user.URL;

      document.getElementById("user_para2").innerHTML ="Welcome User : " + email_id;
      document.getElementById("user_para").innerHTML ='<img class="image--cover" src="'+firebase.auth().currentUser.photoURL+'"/>';

  
      //console.log(url);
      //console.log(downloadURL);
      //console.log(firebase.auth().currentUser);

    }

  } else {
    // No user is signed in.

    document.getElementById("user_div").style.display = "none";
    document.getElementById("login_div").style.display = "block";

  }
});

function login(){

  var userEmail = document.getElementById("email_field").value;
  var userPass = document.getElementById("password_field").value;

  firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    window.alert("Error : " + errorMessage);

    // ...
  });

}

function create() {

  var userEmail = document.getElementById("email_field").value;
  var userPass = document.getElementById("password_field").value;

  firebase.auth().createUserWithEmailAndPassword(userEmail, userPass).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    window.alert("Error : " + errorMessage);

    // ...
  });

}

function logout(){
firebase.auth().signOut();
}


 // firebase bucket name
    // REPLACE WITH THE ONE YOU CREATE
    // ALSO CHECK STORAGE RULES IN FIREBASE CONSOLE
    var fbBucketName = 'images';
    // get elements
    var uploader = document.getElementById('uploader');
    var fileButton = document.getElementById('fileButton');
    // listen for file selection
    fileButton.addEventListener('change', function (e) {
      // what happened
      console.log('file upload event', e);
      // get file
      var file = e.target.files[0];
      // create a storage ref
      var storageRef = firebase.storage().ref(`${fbBucketName}/${file.name}`);
      // upload file
      var uploadTask = storageRef.put(file);
      // The part below is largely copy-pasted from the 'Full Example' section from
      // https://firebase.google.com/docs/storage/web/upload-files
      // update progress bar
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function (snapshot) {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          uploader.value = progress;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log('Upload is paused');
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              console.log('Upload is running');
              break;
          }
        }, function (error) {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break;
            case 'storage/canceled':
              // User canceled the upload
              break;
            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        }, function () {
          // Upload completed successfully, now we can get the download URL
          // save this link somewhere, e.g. put it in an input field
          var postKey = firebase.database().ref('Posts/').push().key;
           
          var downloadURL = uploadTask.snapshot.downloadURL;
          var user = firebase.auth().currentUser;

          user.updateProfile({
           //displayName: Bill Murray,
           photoURL: downloadURL
          });  

          console.log(firebase.auth().currentUser);  

          console.log('downloadURL', downloadURL);
          var updates = {};
          var postData = {

              user: user.uid,
              url: downloadURL
            //caption: $("#imageCaption").val(),

          //console.log(user.uid);
             // console.log(downloadURL);
            
          };
          updates['/Posts/'+postKey] = postData;
          firebase.database().ref().update(updates);
        });
    });

