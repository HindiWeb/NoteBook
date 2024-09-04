$(document).ready(function() {

$('body').on('click','.item-control-btn',function(){
    $('.ic-outer').removeClass('active');
    // $('.notewall').slideUp();
    $(this).closest('.item-control').find('.ic-outer').addClass('active');
});

$('body').on('click','.level-up',function(){
    topic = $(this).closest('.topic')
    id = topic.data('id');
    cl = Number(topic.attr('data-level')) || 0;
    nl = function (cl){if(cl>=4){return 0}else{return cl+1}}
    nl = nl(cl);
    if (loggingOn) console.log(id,cl,' -> ',nl);
    saveProgress(id,nl);
})
$('body').on('click','.note.btn',function(){
    topic = $(this).closest('.topic')
    $('.notewall').removeClass('active');
    $(topic).find('.notewall').addClass('active').slideUp(1).slideDown(300);
    // $(topic).find('.editBtn').show();
    $('.ic-outer').removeClass('active');
    topicID = topic.data('id')
    prepaireNotewall(topicID);
})


})