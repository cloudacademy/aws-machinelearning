// this is a comment
// 20220128
//
// Changed all his routines which were in the one on load function
// to separate routines.  He created globals, I just moved those
// to what I think is a global namespace.
//
// To further distinguish the functions written by the author from
// existing routines in the AWS-SDK or the google material css
// I renamed all his functions as foo_bar as if it was C code.
//

var myglobals = {
    // video is a variable
    video: true,
    image: true,
    start_camera: true,
    controls: true,
    take_photo_btn: true,
    delete_photo_btn: true,
    download_photo_btn: true,
    error_message: true,
    myApp: true,
    library: true
}

function set_widgets() {

    // References in the myglobals struct/namespace
    myglobals.video = document.querySelector('#camera-stream');
    myglobals.image = document.querySelector('#snap');
    myglobals.start_camera = document.querySelector('#start-camera');
    myglobals.controls = document.querySelector('.controls');
    myglobals.take_photo_btn = document.querySelector('#take-photo');
    myglobals.delete_photo_btn = document.querySelector('#delete-photo');
    myglobals.download_photo_btn = document.querySelector('#download-photo');
    myglobals.error_message = document.querySelector('#error-message');
    myglobals.myApp.rek = document.querySelector('#rek');

    // The getUserMedia interface is used for handling camera input.
    // Some browsers need a prefix so here we're covering all the options
    navigator.getMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

    if (!navigator.getMedia) {
        displayErrorMessage("Your browser doesn't have support for the navigator.getUserMedia interface.");
        return;
    }

    // Request the camera.
    // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    navigator.getMedia({
        // This is a parameter constraint. it can be video and/or audio
        video: true,
    }, // Success Callback
    function(stream) {
        //var video = document.querySelector('#camera-stream');

        // Create an object URL for the video stream and
        // set it as src of our HTLM video element.
        //video.src = window.URL.createObjectURL(stream);

        //updated (and tested) to run on Chrome Version 76.0.3809.132 (Official Build) (64-bit)
        myglobals.video.srcObject = stream;

        // Play the video element to start the stream.
        myglobals.video.play();
        myglobals.video.onplay = function() {
            show_video();
        }
        ;

    }, // Error Callback
    function(err) {
        displayErrorMessage("There was an error with accessing the camera stream: " + err.name, err);
    });
    // SetWidgets.navigator.getMedia
}
// SetWidgets

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
// global event listeners
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

// It appears some items are not present on load, so they
// can not have event listeners added initially.

function set_widgets_event_listeners() {

    console.log('set_widgets_event_listeners')

    // these are equivalent
    // Save for future refrence. why the difference?
    //const TAKE_PHOTO_BTN = document.getElementById('#take-photo');
    //const TAKE_PHOTO_BTN = document.querySelector('#take-photo');

    myglobals.take_photo_btn.addEventListener('click', button=>{

        console.log('take_photo_button event listener')

        button.preventDefault();

        var snap = take_snapshot();

        // Show image.
        myglobals.image.setAttribute('src', snap);
        myglobals.image.classList.add("visible");

        // Enable delete and save buttons
        myglobals.delete_photo_btn.classList.remove("disabled");
        myglobals.download_photo_btn.classList.remove("disabled");

        // Set the href attribute of the download button to the snap url.
        myglobals.download_photo_btn.href = snap;

        // Pause video playback of stream.
        myglobals.video.pause();

    }
    );

    myglobals.delete_photo_btn.addEventListener("click", function(e) {

        e.preventDefault();

        // Hide image.
        myglobals.image.setAttribute('src', "");
        myglobals.image.classList.remove("visible");

        // Disable delete and save buttons
        myglobals.delete_photo_btn.classList.add("disabled");
        myglobals.download_photo_btn.classList.add("disabled");

        // Resume playback of stream.
        myglobals.video.play();

    });

}

function show_video() {
    // Display the video stream and the controls.

    hide_ui();
    myglobals.video.classList.add("visible");
    myglobals.controls.classList.add("visible");
}

function hide_ui() {
    // Helper function for clearing the app UI.

    myglobals.controls.classList.remove("visible");
    myglobals.start_camera.classList.remove("visible");
    myglobals.video.classList.remove("visible");
    snap.classList.remove("visible");
    myglobals.error_message.classList.remove("visible");
}

function start_camera() {
    // Mobile browsers cannot play video without user input,
    // so here we're using a button to start it manually.
    this.start_camera.addEventListener("click", function(e) {

        e.preventDefault();

        // Start video playback manually.
        video.play();
        show_video();

    });

}

function take_snapshot() {
    // Here we're using a trick that involves a hidden canvas element.

    var hidden_canvas = document.querySelector('canvas');
    var context = hidden_canvas.getContext('2d');

    var width = myglobals.video.videoWidth;
    var height = myglobals.video.videoHeight;

    if (width && height) {

        // Setup a canvas with the same dimensions as the video.
        hidden_canvas.width = width;
        hidden_canvas.height = height;

        // Make a copy of the current frame in the video on the canvas.
        context.drawImage(myglobals.video, 0, 0, width, height);

        // Turn the canvas image into a dataURL that can be used as a src for our photo.
        var dataURL = hidden_canvas.toDataURL('image/png');
        var blobData = data_uri_to_blob(dataURL);
        var fileName = "pix." + get_id() + ".png";
        var params = {
            Key: fileName,
            ContentType: 'image/png',
            Body: blobData
        };
        myglobals.myApp.s3.upload(params, function(err, data) {
            console.log(data);
            console.log(err ? 'ERROR!' : 'UPLOADED.');

            var params = {
                Image: {
                    S3Object: {
                        Bucket: myglobals.myApp.albumBucketName,
                        Name: fileName
                    }
                },
                Attributes: ["ALL"]
            };

            var rekognition = new AWS.Rekognition();
            rekognition.detectFaces(params, function(err, data) {
                if (err)
                    console.log(err, err.stack);
                else {
                    rek.innerHTML = myglobals.myApp.library.json.prettyPrint(data);
                }
            });

        });

        return dataURL
    }
}
// take_snapshot

function display_error_message(error_msg, error) {
    error = error || "";
    if (error) {
        console.error(error);
    }

    error_message.innerText = error_msg;

    hideUI();
    error_message.classList.add("visible");
}

function data_uri_to_blob(dataURI) {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)],{
        type: 'image/png'
    });
}

function get_id() {
    var newDate = new Date();
    return '' + parseInt(newDate.getMonth() + 1) + '-' + newDate.getDate() + '-' + newDate.getFullYear() + '-' + newDate.getTime()
}

// this is code not used.  How does it compare to the other
// code in terms of coverage analysis
const sleep = (seconds)=>{
    const waitUntil = new Date().getTime() + seconds * 1000
    while (new Date().getTime() < waitUntil) {// do nothing
    }
}
// sleep














///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
// class
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

class MyApp {

    // These are the class privates?
    albumBucketName;
    bucketRegion;
    identityPoolId;
    s3;

    constructor() {
        console.log('MyApp: constructor()')
        this.albumBucketName = '';
        this.bucketRegion = '';
        this.identityPoolId = '';
        this.s3 = null;
    }

    // json version
    async fetch_myconfig() {
        console.log('MyApp: getJSON()');
        return await fetch('/myconfig').then((response)=>response.json()).then((responseJson)=>{
          this.bucketRegion = responseJson.bucketRegion;
          this.identityPoolId = responseJson.identityPoolId;
          this.albumBucketName = responseJson.albumBucketName;
          this.his_init();
          return responseJson;
        }
        );
    }




    modify_library() {
        if (!this.library) {
            this.library = {};
        }
        myglobals.library = this.library;

        this.library.json = {
            replacer: function(match, pIndent, pKey, pVal, pEnd) {
                var key = '<span class=json-key>';
                var val = '<span class=json-value>';
                var str = '<span class=json-string>';
                var r = pIndent || '';
                if (pKey)
                    r = r + key + pKey.replace(/[": ]/g, '') + '</span>: ';
                if (pVal)
                    r = r + (pVal[0] == '"' ? str : val) + pVal + '</span>';
                return r + (pEnd || '');
            },
            prettyPrint: function(obj) {
                var jsonLine = /^( *)("[\w]+": )?("[^"]*"|[\w.+-]*)?([,[{])?$/mg;
                return JSON.stringify(obj, null, 3).replace(/&/g, '&amp;').replace(/\\"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(jsonLine, myglobals.myApp.library.json.replacer);
            }
        };
    }
    // modify_library

    his_init() {
        console.log('his_doit')

        AWS.config.update({
            region: this.bucketRegion,
            credentials: new AWS.CognitoIdentityCredentials({
                IdentityPoolId: this.identityPoolId
            })
        });

        myglobals.myApp.s3 = new AWS.S3({
            apiVersion: '2006-03-01',
            params: {
                Bucket: this.albumBucketName
            }
        });

        // Call the modify_library() code in this class.
        this.modify_library();

    }
    // hisdoit

    async do_my_init() {
        console.log('MyApp: do_init()')

        var msg = await this.fetch_myconfig();
        set_widgets();
        set_widgets_event_listeners();

    }
    // do_init

    // do_get_config
}
// MyApp

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
// entry point
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', function() {

    const myApp = new MyApp();
    myglobals.myApp = myApp;
    myApp.do_my_init();
});
// document.addEventListener
