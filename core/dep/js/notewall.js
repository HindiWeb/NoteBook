$(document).ready(function() {
    document.addEventListener('syLoaded',function(){



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
        var $notewall = $('#'+id+' .notewall');

        if(id=='sem3en'){
            var quill = new Quill($notewall.find('.editor')[0], {
                theme: 'snow',
                readOnly: true, // Initially make it read-only
                modules: {
                    toolbar: [
                        [{ 'header': [1, 2, 3, 4, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        // [{ 'color': [] }, { 'background': [] }],
                        ['link',],//'image'
                        ['blockquote', ],//'code-block'
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        [{ 'indent': '-1'}, { 'indent': '+1' }],
                        ['clean']
                    ]
                }

            });
        } else {
            var quill = new Quill($notewall.find('.editor')[0], {
                theme: 'snow',
                readOnly: true // Initially make it read-only
            });
        }

        // Sample notice text
        topic = $notewall.closest('.topic');
        $(topic).find('.editBtn').show();

        // note = 'j'//getNote(topic) || "Welcome! write a note or save links about <strong>" + getName(topic) + '.</strong>';
        quill.clipboard.dangerouslyPasteHTML(note);

        // Toggle edit mode
        $notewall.find('.editBtn').on('click', function() {
            quill.enable(true); // Enable editing
            $notewall.find('.ql-toolbar').show(); // Show toolbar
            $notewall.find('.editBtn').hide(); // Hide edit button
            $notewall.find('.saveBtn').show(); // Show save button
        });

        // Save the edited content
        $notewall.find('.saveBtn').on('click', function() {
            quill.enable(false); // Disable editing
            $notewall.find('.ql-toolbar').hide(); //  toolbar
            $notewall.find('.editBtn').show(); // Show edit button
            $notewall.find('.saveBtn').hide(); // Hide save button
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