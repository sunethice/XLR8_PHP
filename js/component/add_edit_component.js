$(document).ready(function() {
    drawComponentTypeOptions();
    var id = '';
    if($(location).attr("href").indexOf('=') > 0){
        id = $(location).attr("href").substring($(location).attr("href").indexOf('=')+1);
        getComponent(id);
    }
    
    $('#AddCompBtn').click(function(e, data){
        addComponent();
    });

    var compStatus = {
        0: "Completed",
        1: "Under Construction",
        2: "Waiting for Feedback"
    }

    function addComponent(){
        var componentTypeID = $('#componentTypes').children(":selected").attr("id");
        var componentDescription = $('#componentDesc').val();
        var componentCompletionStatus = $('#componentStatus').children(":selected").attr("id");       

        obj = {};
        if(id != ''){
            obj.componentID = id;
        }
        obj.componentTypeID = componentTypeID;
        obj.componentDescription = componentDescription;
        obj.componentComplStatus = componentCompletionStatus;

        $.post({
            url: 'server/component/addComponent.php',
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
            alert(respData.message);
        }
        else{
            alert(respData.message);
        }
    }

    function drawComponentTypeOptions(){
        $.post({
            url: 'server/component/getComponentType.php',
            async: true,
            data: {},
            dataType: 'json',
            success: onGetCompTypesResponse,
            error:onGetCompTypesResponse,
            cache: false
        });
    }
    
    function onGetCompTypesResponse(respData){
        if(respData.success){
            console.log(respData.message);
            $.each(respData.obj, function( index, value ) {                
                $("#componentTypes").append("<option id='"+index+"' value='" + value + "'>" + value + "</option>")
            });
        }
        else{
            alert(respData.message);
        }
    }

    function getComponent(compID){
        $.post({
            url: 'server/component/getComponents.php',
            async: true,
            data: {'id':compID},
            dataType: 'json',
            success: onGetCompResponse,
            error:onGetCompResponse,
            cache: false
        });
    }

    function onGetCompResponse(respData){
        if(respData.success){
            $.each(respData.obj,function(inx,val){
                //$('#componentName').val(val.type_name);
                $('#componentTypes').val(val.type_name);
                $('#componentDesc').val(val.description);
                $('#componentStatus').val(compStatus[val.completion_status]);
            });
        }
        else{
            alert(respData.message);
        }
    }
});
