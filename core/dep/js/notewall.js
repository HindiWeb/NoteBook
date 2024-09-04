$(document).ready(function() {
    document.addEventListener('syLoaded',function(){


    // Initialize Quill editor for each notice board
    // $('.notewall').each(function() {
    //     var $noticeBoard = $(this);
    //     var quill = new Quill($noticeBoard.find('.editor')[0], {
    //         theme: 'snow',
    //         readOnly: true // Initially make it read-only
    //     });

    //     // Sample notice text
    //     topic = $noticeBoard.closest('.topic').data('id');
    //     note = 'j'//getNote(topic) || "Welcome! write a note or save links about <strong>" + getName(topic) + '.</strong>';
    //     quill.clipboard.dangerouslyPasteHTML(note);

    //     // Toggle edit mode
    //     $noticeBoard.find('.editBtn').on('click', function() {
    //         quill.enable(true); // Enable editing
    //         $noticeBoard.find('.ql-toolbar').show(); // Show toolbar
    //         $noticeBoard.find('.editBtn').hide(); // Hide edit button
    //         $noticeBoard.find('.saveBtn').show(); // Show save button
    //     });

    //     // Save the edited content
    //     $noticeBoard.find('.saveBtn').on('click', function() {
    //         quill.enable(false); // Disable editing
    //         $noticeBoard.find('.ql-toolbar').hide(); //  toolbar
    //         $noticeBoard.find('.editBtn').show(); // Show edit button
    //         $noticeBoard.find('.saveBtn').hide(); // Hide save button
    //         // You can save the content to a database here
    //         var content = quill.root.innerHTML;
    //         console.log("Saved content: ", content);
    //     });
    // });

    window.prepaireNotewall  = function(id){
        $.ajax({
            url : serverUrl + 'phps/note.php',
            type : 'POST',
            data :{action : 'get',id},
            dataType: 'json',
            xhrFields: {
                withCredentials: true // Important to include cookies in the request
            },
            error:(e)=>{
                hwPanel('Network Error!','Failed to connect.')
                if (loggingOn) console.log('Notewall Error :',e);
            },
            success : (data)=> {
                if (loggingOn) console.log(data);
                addQuill(id,data.note);
            }
        })

    }

    function addQuill(id,note){
        if(!note) note = "Welcome! write a note or save links about <strong>" + getName(id) + '.</strong>';
        var $noticeBoard = $('#'+id+' .notewall');
        var quill = new Quill($noticeBoard.find('.editor')[0], {
            theme: 'snow',
            readOnly: true // Initially make it read-only
        });

        // Sample notice text
        topic = $noticeBoard.closest('.topic');
        $(topic).find('.editBtn').show();

        // note = 'j'//getNote(topic) || "Welcome! write a note or save links about <strong>" + getName(topic) + '.</strong>';
        quill.clipboard.dangerouslyPasteHTML(note);

        // Toggle edit mode
        $noticeBoard.find('.editBtn').on('click', function() {
            quill.enable(true); // Enable editing
            $noticeBoard.find('.ql-toolbar').show(); // Show toolbar
            $noticeBoard.find('.editBtn').hide(); // Hide edit button
            $noticeBoard.find('.saveBtn').show(); // Show save button
        });

        // Save the edited content
        $noticeBoard.find('.saveBtn').on('click', function() {
            quill.enable(false); // Disable editing
            $noticeBoard.find('.ql-toolbar').hide(); //  toolbar
            $noticeBoard.find('.editBtn').show(); // Show edit button
            $noticeBoard.find('.saveBtn').hide(); // Hide save button
            // You can save the content to a database here
            var content = quill.root.innerHTML;
            saveNote(id,content);
            console.log(id +'; '+"Saved content: " , content);
        });

    }

    function saveNote(id,content){
        $.ajax({
            url : serverUrl + 'phps/note.php',
            type : 'POST',
            data :{action : 'set',id,note : content},
            dataType: 'json',
            xhrFields: {
                withCredentials: true // Important to include cookies in the request
            },
            error:(e)=>{
                hwPanel('failed!',`Failed to save notes for <small><i>${getName(id)}.</i></small> try again.<br><code><br>${e.responseText}</code>
                `)
                if (loggingOn) console.log('Notewall Error :',e);
                $('#'+id).find('.saveBtn').show();
            },
            success : (data)=> {
                if (loggingOn) console.log(data);
            }
        })
    }


    })
});