// Function to get ID by name from the syllabus object
function getID(name) {
    if (!syllabus) return "syllabus not found";
    for (let unit in syllabus) {
        let item = syllabus[unit].items.find(item => item.name === name);
        if (item) {
            return item.id;
        }
    }
    return null; // Name not found
}

// Function to get name by ID from the syllabus object
function getName(id) {
    if (!syllabus) return "syllabus not found";
    for (let unit in syllabus) {
        let item = syllabus[unit].items.find(item => item.id === id);
        if (item) {
            return item.name;
        }
    }
    return null; // ID not found
}

function snippet(link,callback){
    $.ajax({
        url: `../dep/html/${link}`,
        method: 'GET',
        success: function(data) {
            typeof callback === 'function' && callback(data);
            typeof callback === 'string' && $(callback).html(data);
        },
        error: function() {
            console.log('Failed to load the header.');
        }
    });
}