$(document).ready(function() {
    window.serverUrl = 'https://neetiindia.org/wp-content/plugins/HindiWeb/protrac/core/';
    // Function to handle AJAX responses
    function handleResponse(response) {
        response = JSON.stringify(response)
        const result = JSON.parse(response);
        if (result.status === 'login') {
            // alert('Action successful');
            getProgress()
            if (result.status === 'login'||result.message === 'active') {
                $('#login-form').hide();
                $('#logged-in-section').show();
                $('.username').text(result.username);
            }
        } else if (result.status === 'error') {
            alert(result.message);
        } else if (result.status === 'logged_out') {
            alert('Session expired. Please log in again.');
            $('#login-form').show();
            $('#logged-in-section').hide();
        } else if (result.status === 'not_logged_in') {
            $('#login-form').show();
            $('#logged-in-section').hide();
        }
    }

    // Function to perform AJAX POST requests using jQuery
    function ajaxPost(action, data) {
        return $.ajax({
            url: serverUrl+'phps/auth.php',
            type: 'POST',
            data: { action, ...data },
            dataType: 'json',
            xhrFields: {
                withCredentials: true // Important to include cookies in the request
            },
            error:(e)=>{
                hwPanel('Network Error!','Failed to connect.')
            }
            
        });
    }

    // Function to check if the user is logged in
    function checkSession() {
        ajaxPost('check_session', {}).done(handleResponse);
    }

    // Handle login form submission
    $('#login-form').on('submit', function(e) {
        e.preventDefault();
        const username = $('#username').val();
        const password = $('#password').val();
        ajaxPost('login', { username, password }).done(handleResponse);
    });

    // Handle logout button click
    $('#logout-btn').on('click', function() {
        ajaxPost('logout', {}).done(handleResponse);
    });

    // Initial session check on page load
    checkSession();

    // Check session periodically every 10 minutes
    setInterval(checkSession, 600000); // 10 minutes

    window.saveProgress = function (id,level) {
        // popup('wait...');
        $.ajax({
            url : serverUrl + 'phps/note.php',
            type : 'POST',
            data :{action : 'save_progress',id,level},
            dataType: 'json',
            xhrFields: {
                withCredentials: true // Important to include cookies in the request
            },
            error:(e)=>{
                hwPanel('failed!',`Failed to save progress.<br> <code><br>${e.responseText}</code>
                `)
                if (loggingOn) console.log('Error :',e);
            },
            success : (data)=> {
                if (loggingOn) console.log(data); 
                $('#'+id).attr('data-level',level);      
            }
        })
    }

    getProgress  = function(){
        $.ajax({
            url : serverUrl + 'phps/note.php',
            type : 'POST',
            data :{action : 'progress',id : 'All'},
            dataType: 'json',
            xhrFields: {
                withCredentials: true // Important to include cookies in the request
            },
            error:(e)=>{
                hwPanel('failed!',`Failed to get progress.<br> <code><br>${e.responseText}</code>
                `)
                if (loggingOn) console.log('Error :',e);
            },
            success : (data)=> {
                if (loggingOn) console.log(data.data);
                var leveltable = data.data;
                $('.topic').each(function() {
                    // Get the data-id attribute of the element
                    const dataId = $(this).data('id');
                
                    // Find the corresponding item in the leveltable
                    const levelInfo = leveltable.find(entry => entry.item == dataId);

                    // Set the data-level attribute based on the leveltable, or 0 if not found
                    if (levelInfo) {
                        $(this).attr('data-level', levelInfo.level);
                    } else {
                        $(this).attr('data-level', 0);
                    }
                });                

            }
        })
    }
});
