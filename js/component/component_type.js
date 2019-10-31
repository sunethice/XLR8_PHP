$(document).ready(function() {
    
    $('#AddCompTypeBtn').click(function(e, data){
        addComponentType(data);
    });

    function addComponentType(data){
        var componentTypeName = $('#compTypeName').val();
        obj = {};
        obj.componentType = componentTypeName;
        $.post({
            url: 'server/component/addComponentType.php',
            async: true,
            data: obj,
            dataType: 'json',
            success: onResponse,
            error:onResponse,
            cache: false
        });
    }

    function onResponse(respData){
        if(respData.success){
            location.reload();
            console.log(respData.message);
        }
        else{
            console.log(respData.message);
        }
    }
});
