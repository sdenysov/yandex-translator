'use strict';
const apiKey = 'trnsl.1.1.20160509T202610Z.debc35a9979d7f99.45cb2d4468c993f78dd8f9be935d109d07cc5123';
let $translateForm = $('#translate-form');
$translateForm.submit(function(event) {
    event.preventDefault();
    console.log($translateForm.serialize());
    $.ajax({
        url: `https://translate.yandex.net/api/v1.5/tr.json/translate?lang=en-ru&key=${apiKey}`,
        type: 'POST',
        data: $translateForm.serialize(),
        success: function(data){
            $('#translate-answer').html(data.text[0]);
        }
    });
});
