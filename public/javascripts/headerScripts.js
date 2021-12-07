document.querySelector('.menu-burger').addEventListener('click', function(){
    document.querySelector('#headerRightPart nav').classList.toggle('open');
});
document.querySelector('#not-chose').addEventListener('click', function(){
    let lang = this.textContent.toLowerCase();
    var request = new XMLHttpRequest();
    request.open('POST','/set_lang', true);
    request.setRequestHeader("Content-Type", "application/json");
    request.onreadystatechange = function(){
        if (request.readyState === 4 && request.status === 200){
            window.location.reload();
        }
    }
    request.send(JSON.stringify({lang}));
}, {once: true});

$(function() {

    var pathname_url = window.location.pathname;
    var href_url = window.location.href;
  
    $(".navigation li").each(function () {
  
      var link = $(this).find("a").attr("href");
  
      if(pathname_url == link || href_url == link) {
  
        $(this).addClass("active");
  
      }
  
    });
  
  });
