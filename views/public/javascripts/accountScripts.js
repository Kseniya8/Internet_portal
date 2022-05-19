window.onload = function(){
    $('#achive-info img').bind('click', ShowPhoto);
    
    $('#user-info-content>div').each(function(i, item){
        if(!item.childElementCount) {
            item.previousElementSibling.remove();
            item.remove();
    }});
    
    $('.graduate').each(function(i, item){
        if (!item.childElementCount) item.remove();
    });

    let sapr = $('#education-info-sapr')[0];
    let another = $('#education-info-another')[0];
    if (!sapr.childElementCount && !another.childElementCount){
        $('#education-info')[0].remove();
        $('#education-header')[0].remove();
    }
    
    $('.multiple-questions').each(function(i, item){
        if (item.textContent == '; ') item.parentNode.remove();
        else {
            let str = item.textContent;
            item.textContent = str.substring(0, str.length - 2) + '.';
        }
    });

    function ShowPhoto(event){
        $('#modal-show-img').find('img').attr('src', event.target.src);
        $('#modal-show-img').modal();
    }
}