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
        if((!note || note =='<p><br></p>') && id === 'sem3en') note = `<p><strong>Unit- 1 Concept of Macro Economics: </strong></p><p class="ql-indent-1">• Meaning, Scope, Types, Importance and Limitations</p><p class="ql-indent-1">• Interrelations between </p><p class="ql-indent-1">micro and macro economics</p><p class="ql-indent-1">• Circular Flow of Income</p><p class="ql-indent-1">• Concept of :</p><p class="ql-indent-2">_ National Income</p><p class="ql-indent-2">_ Gross Domestic Product (GDP)</p><p class="ql-indent-2">_ Net Domestic Product (NDP)</p><p class="ql-indent-2">_ Gross National Product (GNP)</p><p class="ql-indent-2">_ Net National Product (NNP)</p><p class="ql-indent-2">_ National Income Accounting</p><p class="ql-indent-2">_ National Income</p><p class="ql-indent-2">_ Economic Welfare</p><p class="ql-indent-2"><br></p><p><strong>Unit- 2 Determination of Income and Employment:</strong></p><p class="ql-indent-1">• Classical Theory of Employment</p><p class="ql-indent-2">_ Say's Theory, Piqou's Theory, Keynesian Theory</p><p class="ql-indent-1">• Effective demand, Imperfect Employment, Aggregate demand and </p><p class="ql-indent-1">Aggregate supply</p><p><br></p><p><strong>Unit- 3 Consumption Function:</strong></p><p class="ql-indent-1">• Meaning, Assumption </p><p class="ql-indent-1">• Nature and Factors Influencing;</p><p class="ql-indent-2">_ Concepts of MPS, APS, MPC and APC</p><p class="ql-indent-1">• Psychological Law of Consumption;</p><p class="ql-indent-2">_ Paradox of Thrift</p><p class="ql-indent-1">• Income-consumption relationship;</p><p class="ql-indent-2">_ absolute and relative income hypothesis</p><p><br></p><p><strong>Unit- 4 Investment Function:</strong></p><p class="ql-indent-1">• Meaning and Types</p><p class="ql-indent-1">• Investment and Interest Rate</p><p class="ql-indent-1">• Marginal Efficiency of Capital (MEC);</p><p class="ql-indent-2">_ Theory of Multiplier and Accelerator</p><p><br></p><p><strong>Unit- 5 Trade cycle:</strong></p><p class="ql-indent-1">• Meaning, Definitions, Causes, Consequences, Effects and Measures</p><p class="ql-indent-1"><em>*Inflation and Deflation:</em></p><p class="ql-indent-1">• Inflation;</p><p class="ql-indent-2">_ Types, Stages, Causes and Effects</p><p class="ql-indent-1">• How to Check Inflation</p><p class="ql-indent-1">• Demand-pull and Cost-Push inflation</p><p class="ql-indent-1">• Inflation and Unemployment [Phillips Curve]</p><p class="ql-indent-1">• Deflation;</p><p class="ql-indent-2">_ Causes, Consequences, Effects, and Measures</p>`;
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