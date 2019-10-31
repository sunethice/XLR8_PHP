$(document).ready(function() {
    if($(location).attr("href").indexOf('id=') > 0){
        id = $(location).attr("href").substring($(location).attr("href").indexOf('id=')+3);
        getComponents(id);
    }
    else{
        getComponents();
    }

    categoriesObj = {};
    function getComponents(pCompID){
        obj = {'id':pCompID};
        $.post({
            url: 'server/component/getComponents.php',
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
            drawComponentTblBody(compTable, respData.obj);
            var compTable = $('#component_table').DataTable({
                autoWidth:false, 
            });
            bindEvents();
            console.log(respData.message);
        }
        else{
            console.log(respData.message);
        }
    }

    function drawComponentTblBody(table, data){
        var table_body = '';
        statusLbl = {
            0:'<span class="badge badge-pill badge-success">Completed</span>',
            1:'<span class="badge badge-pill badge-warning">In progress</span>',
            2:'<span class="badge badge-pill badge-info">Waiting for feedback</span>',
        }
        $.each(data,function(inx,val){
            table_body += '<tr id="' + inx + '">';
            table_body += '<td>' + val.component_id + '</td>' +
                          '<td id="'+ val.component_id +'_comp_weight">' + val.weight + '</td>' +
                          '<td id="'+ val.component_id +'_comp_cost">' + val.cost + '</td>' +
                          '<td>' + val.description + '</td>' +
                          '<td>' + statusLbl[val.completion_status] + '</td>' +
                          '<td>' + val.type_name + '</td>' +
                          '<td><span class="table-edit"><button  id="'+ val.component_id +'_edit" role="edit" class="btn btn-info btn-rounded btn-sm buttonEdit">Edit</button></span></td>' +
                          '<td><span class="table-remove"><button id="'+ val.component_id +'_delete" role="delete" type="button" class="btn btn-danger btn-rounded btn-sm my-0">Remove</button></span></td>' +
                          '<td><button id="'+ val.component_id +'_notes" role="notes" type="button" class="btn btn-warning btn-rounded btn-sm my-0"><i class="fa fa-commenting-o"></i></button></td>';
            table_body += '</tr>';
        });
        $('tbody','#component_table').html(table_body);
        $('#component_table').off( "partsChanged");
        $('#component_table').on( "partsChanged", function( event, compID, pWeight, pCost ) {
            $("#"+compID+"_comp_weight").text(pWeight);
            $("#"+compID+"_comp_cost").text(pCost);
        });
    }

    function bindEvents(){
        $("#AddComponent").click(function(event){addEditComponent()});
        $("[role='edit']").click(function(event){
            event.stopPropagation();
            addEditComponent(event)
        });
        $("[role='delete']").click(function(event){
            event.stopPropagation();
            $('#modal-btn-yes').unbind('click');
            $('#modal-btn-yes').click(function(){
                deleteComponent(event);
                $("#mi-modal").modal('hide');
            });
            $('#modal-btn-no').unbind('click');
            $('#modal-btn-no').click(function(){
                $("#mi-modal").modal('hide');
            });
            $("#ok").hide();
            $("#yes-no").show();
            $("#mi-modal-body","#mi-modal").html("Do you really want to delete this component?");
            $("#mi-modal").modal('show');
        });
        $('[role="notes"]').click(function(event){
            event.stopPropagation();
            componentNotes(event)
        });
        $('tr[role="row"]').click(function(){ rowClick(this.id)})
    }

    function addEditComponent(event){
        if(event == undefined)
            document.location.href = 'add_edit_components.html';
        else{
            editID = event.target.id.substring(0,event.target.id.indexOf('_edit'));
            document.location.href = 'add_edit_components.html?id='+editID;
        }
    }

    function deleteComponent(event){
        deleteID = event.target.id.substring(0,event.target.id.indexOf('_delete'));
        $.post({
            url: 'server/component/deleteComponent.php',
            async: true,
            data: {'id': deleteID},
            dataType: 'json',
            success: onDeleteResponse,
            error: onDeleteResponse,
            cache: false
        });
    }

    function componentNotes(event){
        event.stopPropagation();
        
        parentID = $(event.target).parent().attr('id');
        compID = "";
        if(parentID != undefined){
            compID = parentID.substring(0,parentID.indexOf('_notes'));
        }else{
            compID = $(event.target).attr('id').substring(0,$(event.target).attr('id').indexOf('_notes'));
        }
        obj = {}
        obj.cAction = "GET_COMPONENT_NOTES";
        obj.cCompID = compID;
        $.post({
            url: 'server/component/componentPartsHandler.php',
            async: true,
            data: obj,
            dataType: 'json',
            success: onNotesResponse,
            error: onNotesResponse,
            cache: false
        });
    }

    function onDeleteResponse(respData){
        if(respData.success){
            $('#'+respData.obj.compID,'#component_table').remove();
            
        }
        else{
            console.log(respData.message);
        }
    }

    function onNotesResponse(respData){
        table_body = 
            '<div id="UcInfo">' +
                '<div id="slideBody" class="TPopBodyWrap FullHeight">' +
                    '<div id="NoResultWrp" class="TUCNoDataWrap">' +
                        '<div id="Icon" class="TUCNoDataImg msg"></div>' +
                        '<div id="" class="TUCNoDataTxt">' +
                            '<span id="Title1" class="TUCNoDataTxt1 TFont4 TFCol4" lng="918878be">No notes to display</span>' +
                            '<span id="Title2" class="TUCNoDataTxt2 TFont2 TFCol10" lng="a251c4e3">Create your first note.</span>' +
                        '</div>' +
                    '</div>'
                '</div>' +
            '</div>'; 
        $('#notesModalLabel','#notesModal').text(compID +' - Notes');
        $('#modalBody','#notesModal').html(table_body);
        $('#modalFooter','#notesModal').html(
            '<div class="type_msg">' +
                '<div class="input_msg_write">' +
                    '<input id="noteText" type="text" class="write_msg" placeholder="Type a message">' +
                    '<button id="addNote" class="msg_send_btn" type="button"><i class="fa fa-paper-plane-o" aria-hidden="true"></i></button>' +
                '</div>' +
            '</div>'
        );
        if(respData.success){
            notesBody = drawNotesBody(respData.obj);
            $('#slideBody','#notesModal').html(notesBody);            
        }
        else{
            console.log(respData.message);
        }
        $("#addNote").click(function(){
            var noteTxt = $("#noteText").val();
            addComponentNote(compID,noteTxt);
        });
        $("#notesModal").modal('show');
    }

    function drawNotesBody(pData){
        modalBody = '';
        if(pData != null){
            $.each(pData,function(inx,val){
                modalBody += '<div class="card note">' +
                                '<div class="card-body danger">' +
                                    '<h6 class="card-subtitle mb-2 text-muted text-left">~'+val.user_id+'~</h6>' +
                                    '<p class="card-text float-left">'+val.condition_status+'</p>' +
                                '</div>' +
                            '</div>';
            });
        }
        return modalBody;
    }

    function addComponentNote(compID,noteTxt){
        obj = {}
        obj.cAction = "ADD_COMPONENT_NOTES";
        obj.cCompID = compID;
        obj.cNote = noteTxt;
        $.post({
            url: 'server/component/componentPartsHandler.php',
            async: true,
            data: obj,
            dataType: 'json',
            success: onCompNoteAddResponse,
            error: onCompNoteAddResponse,
            cache: false
        });
    }

    function onCompNoteAddResponse(respData){
        if(respData.success){
            card = drawNotesBody(respData.obj);
            if($('.card','#slideBody').length > 0){
                $('#slideBody','#notesModal').append(card);
            }
            else{
                $('#slideBody','#notesModal').html(card);
            }
        }
        else{
            alert(respData.message);
        }
    }

    function rowClick(clickdRowID){
        if($('#'+clickdRowID+"_wrap").length){
            $('#'+clickdRowID+"_wrap").remove();
            return;
        }
        else{
            $("[role='partsWrap']").remove();
            cpRequestComParts(clickdRowID);
        }
    }

    function cpRequestComParts(clickdRowID){
        obj = {}
        obj.cAction = "GET_COMPONENT_PARTS";
        obj.cCompID = clickdRowID;
        $.post({
            url: 'server/component/componentPartsHandler.php',
            async: true,
            data: obj,
            dataType: 'json',
            success: onComPartsResponse,
            error: onComPartsResponse,
            cache: false
        });
    }

    function onComPartsResponse(respData){
        var requestedID = respData.request;
        if($('#'+requestedID+"_wrap").length){
            $('#'+requestedID+"_wrap").remove();
        }
        $('#'+requestedID).after(
            '<tr id="' + requestedID + '_wrap" style="background-color: #ebebeb; max-height:300px !important;display:none;" role="partsWrap">' +
                '<td colspan="9">' +
                    '<div id="UcInfo">' +
                        '<div id="" class="TPopHdrWrap">' +
                            '<div id="" class="TPopHdrMain">' +
                                '<div id="popTitle" class="TPopHdrTxt TFont6" lng="Dash1">Parts</div>' +
                                '<div id="popClose" class="TPopAdd">'+
                                    '<button id="' + requestedID + '_Add_Part" class="btn btn-info btn-sm buttonEdit">Add Part</button>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                        '<div id="slideBody" class="TPopBodyWrap FullHeight">' +
                            '<div id="NoResultWrp" class="TUCNoDataWrap">' +
                                '<div id="Icon" class="TUCNoDataImg"></div>' +
                                '<div id="" class="TUCNoDataTxt">' +
                                    '<span id="Title1" class="TUCNoDataTxt1 TFont4 TFCol4" lng="918878be">No parts to display</span>' +
                                    '<span id="Title2" class="TUCNoDataTxt2 TFont2 TFCol10" lng="a251c4e3">Add your first part.</span>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</td>' +
            '</tr>');
        $("#"+requestedID + "_wrap").slideDown("slow");
        $("#"+requestedID+"_Add_Part").click(function(event){
            addPartClick(requestedID);
        })
        if(respData.success){
            if(Object.keys(respData.obj).length){
                var tableBody = "";
                var totWeight = 0;
                var totCost = 0;
                $.each(respData.obj, function(inx,val){
                    tableBody += '<tr>' +
                                    '<td>'+ val.part_id +'</td>' +
                                    '<td>'+ val.part_name +'</td>' +
                                    '<td id="'+ val.part_id +'_part_weight">'+ val.weight +'</td>' +
                                    '<td id="'+ val.part_id +'_part_cost">'+ val.cost +'</td>' +
                                    '<td>'+ val.description +'</td>' +
                                    '<td>'+ val.vendor_reference +'</td>' +
                                    '<td id="'+ val.part_id +'_part_qty">'+ val.qty +'</td>' +
                                    '<td>'+ val.date +'</td>' +
                                    '<td><span class="table-remove"><button id="'+ val.part_id +'_delete" role="delete_part" type="button" class="btn btn-danger btn-rounded my-0 custom">Remove</button></span></td>' +
                                '</tr>';
                    totWeight += parseInt(val.weight);
                    totCost += parseInt(val.cost);
                });
                $('#component_table').trigger("partsChanged", [ requestedID, totWeight, totCost ] );
                var tableHtml = 
                    '<table id="compPartsTable" class="table custom">' +
                        '<thead>' +
                            '<tr>' +
                                '<th scope="col">Part ID</th>' +
                                '<th scope="col">Part Name</th>' +
                                '<th scope="col">Weight</th>' +
                                '<th scope="col">Cost</th>' +
                                '<th scope="col">Description</th>' +
                                '<th scope="col">Reference</th>' +
                                '<th scope="col">Qty</th>' +
                                '<th scope="col">Date</th>' +
                                '<th scope="col">Delete</th>' +
                            '</tr>' +
                        '</thead>' +
                            tableBody
                        '<tbody>' +
                        '</tbody>' +
                    '</table>';
                $('#slideBody',"#"+requestedID+"_wrap").html(tableHtml);
                $('#compPartsTable').DataTable({
                    scrollY: 200,
                    paging: true,
                    fixedHeader: true,
                    select:false,
                    info: false,
                    searching: false,
                    "dom": 't<"bottom"lp>',
                    "initComplete": function(settings, json) {
                        $('.dataTables_length').addClass('dataTables_custom');
                    }
                });
                $('[role="delete_part"').click({pCompID: requestedID},function(event){
                    partID = this.id.substring(0, this.id.indexOf('_delete'));
                    removePartClick(partID,event.data.pCompID);
                })
            }
            console.log(respData.message);
        }
        else{
            console.log(respData.message);
        }
    }

    function addPartClick(clickdRowID){
        resetAddPartModalElements(clickdRowID);
        obj = {}
        obj.cAction = "GET_PART_CATEGORIES";
        $.post({
            url: 'server/component/componentPartsHandler.php',
            async: true,
            data: obj,
            dataType: 'json',
            success: onCategoryResponse,
            error: onCategoryResponse,
            cache: false
        });
    }

    function onCategoryResponse(respData){
        if(respData.success){
            categoriesObj = respData.obj;
            var selectedCat1 = "",selectedCat2 = "",selectedCat3 = "";
            $("#searchBtn").click(function(){ serachParts(selectedCat1,selectedCat2,selectedCat3); });
            $.each(categoriesObj["1"], function( index, value ) {                
                $("#cate_1").append("<option id='"+index+"' value='" + value.category_name + "'>" + value.category_name + "</option>");
            });
            $("#cate_1").change(function () {
                selectedCat1 = $(this).children(":selected").attr("id");
                $("#cate_2").html('<option selected>Select a category</option>');
                $.each(categoriesObj["2"], function( index, value ) { 
                    if(value.parent == selectedCat1) 
                        $("#cate_2").append("<option id='"+index+"' value='" + value.category_name + "'>" + value.category_name + "</option>")
                });  
                $("#cate_2").change(function () {
                    selectedCat2 = $(this).children(":selected").attr("id");
                    $("#cate_3").html('<option selected>Select a category</option>');
                    $.each(categoriesObj["3"], function( index, value ) { 
                        if(value.parent == selectedCat2) 
                            $("#cate_3").append("<option id='"+index+"' value='" + value.category_name + "'>" + value.category_name + "</option>")
                    });  
                    $("#cate_3").change(function () {
                        selectedCat3 = $(this).children(":selected").attr("id");
                    });
                });
            });
        }
        else{

        }
    }

    function resetAddPartModalElements(pCompID){
        $('#AddPartsModal').attr('comp_to_update',pCompID);
        $('#add_parts_table').DataTable().destroy();
        $('tbody','#add_parts_table').html("");
        $("#cate_1").html('<option selected>Select a category</option>');
        $("#cate_2").html('<option selected>Select a category</option>');
        $("#cate_3").html('<option selected>Select a category</option>');
        $('#AddPartsModal').modal('show');
        $('#AddPartsModal').off('hidden.bs.modal');
        $('#AddPartsModal').on('hidden.bs.modal', function () {
            cpRequestComParts(pCompID);
        })
    }

    function removePartClick(pPartID,pCompID){
        partQty = $("#"+pPartID+"_part_qty").text();
        partWeight = $("#"+pPartID+"_part_weight").text();
        partCost  = $("#"+pPartID+"_part_cost").text();
        if(partQty > 1){
            modalBody = "<div>"+
                            "<label>Select the Quantity to delete:</label>"+
                            generateQtyDropDown(partQty,pPartID+"_del") +
                        "</div>";
            $("#ok").show();
            $("#yes-no").hide();
            $("#mi-modal-body","#mi-modal").html(modalBody);
            $('#modal-btn-ok').unbind('click');
            $('#modal-btn-ok').click(function(){
                delQty = $("#"+pPartID+"_del_qty").children(":selected").val();
                deletePart(pPartID,pCompID,delQty,partWeight,partCost,(partQty == delQty?"true":"false"));
                $("#mi-modal").modal('hide');
                $("#ok").hide();
                $("#yes-no").show();
            });
        }
        else{
            $("#ok").hide();
            $("#yes-no").show();
            $("#mi-modal-body","#mi-modal").html("Do you really want to remove this part?");
            $('#modal-btn-yes').unbind('click');
            $('#modal-btn-yes').click(function(){
                deletePart(pPartID,pCompID,partQty,partWeight,partCost,"true");
                $("#mi-modal").modal('hide');
            });
            $('#modal-btn-no').unbind('click');
            $('#modal-btn-no').click(function(){
                $("#mi-modal").modal('hide');
            });
        }
        $("#mi-modal").modal('show');
    }

    function deletePart(pPartID,pCompID,pQty,pWeight,pCost,pIsAllQty){
        obj = {}
        obj.cAction = "REMOVE_COMPONENT_PART";
        obj.cPartID = pPartID;
        obj.cQty = pQty;
        obj.cWeight = pWeight;
        obj.cCost  = pCost;
        obj.cCompID = pCompID;
        obj.cIsAllQty = pIsAllQty;
        $.post({
            url: 'server/component/componentPartsHandler.php',
            async: true,
            data: obj,
            dataType: 'json',
            success: onDeletePartResponse,
            error: onDeletePartResponse,
            cache: false
        });
    }

    function deleteAllPart(pCompID){
        obj = {}
        obj.cAction = "REMOVE_ALL_COMPONENT_PARTS";
        obj.cCompID = pCompID;
        $.post({
            url: 'server/component/componentPartsHandler.php',
            async: true,
            data: obj,
            dataType: 'json',
            success: onDeletePartResponse,
            error: onDeletePartResponse,
            cache: false
        });
    }

    function onDeletePartResponse(respData){
        if(respData.success){
            cpRequestComParts(respData.request);
            console.log(respData.message);
        }
        else{
            console.log(respData.message);
        }
    }

    function serachParts(pSelectedCat1,pSelectedCat2,pSelectedCat3){
        if(pSelectedCat1 != "",pSelectedCat2 != "",pSelectedCat3 != ""){
            obj = {}
            obj.cAction = "GET_PARTS_FOR_SELECTED_CATEGORIES";
            obj.cat1 = pSelectedCat1;
            obj.cat2 = pSelectedCat2;
            obj.cat3 = pSelectedCat3;
            $.post({
                url: 'server/component/componentPartsHandler.php',
                async: true,
                data: obj,
                dataType: 'json',
                success: onSearchResponse,
                error: onSearchResponse,
                cache: false
            });
        }else{
            alert("Please select all categories")
        }
    }

    function onSearchResponse(respData){
        if(respData.success){
            var table_body = '';
            $.each(respData.obj,function(inx,val){
                table_body += '<tr id="' + val.part_id + '">';
                table_body += '<td>' + val.part_name + '</td>' +
                              '<td id="' + val.part_id + '_weight">' + val.weight + '</td>' +
                              '<td id="' + val.part_id + '_cost">' + val.cost + '</td>' +
                              '<td>' + val.description + '</td>' +
                              '<td id="' + val.part_id + '_qtyDrop">' + generateQtyDropDown(val.available_qty,val.part_id) + '</td>' + 
                              '<td>' +
                                '<span class="table-edit">' +
                                    '<button  id="'+ val.part_id +'_Add" role="AddPart" class="btn btn-info btn-rounded btn-sm"'+ (val.available_qty == 0? "disabled":"") +'>Add</button>' +
                                '</span>' +
                              '</td>';
                table_body += '</tr>';
            });
            $('tbody','#add_parts_table').html(table_body);
            
            $("[role='qty']").prop('selectedIndex', 0);
            if($.fn.dataTable.isDataTable("#add_parts_table")){
                $('#add_parts_table').DataTable().destroy();
                $('tbody','#add_parts_table').html("");
            }
            $('#add_parts_table').DataTable({
                searching: false,
                info: false,
                fixedHeader: true,
                "dom": 'rt<"bottom"flp>'
            });
            $("[role='AddPart']").click(function(event){
                partID = this.id.substring(0, this.id.indexOf('_Add'));
                addPartToComponent(partID);
            })
        }
        else{
            if($.fn.dataTable.isDataTable("#add_parts_table")){
                $('#add_parts_table').DataTable().destroy();
                $('tbody','#add_parts_table').html("");
            }
        }
    }

    function generateQtyDropDown(Qty,rowID){
        var dropHtml = "";
        if(Qty > 0){
            dropHtml = '<select id="'+ rowID +'_qty" available_qty="'+ Qty +'" class="browser-default custom-select" role="qty">'+
                       '<option selected>Select a category</option>';
            for(var i = 1;i <= Qty; i++){
                dropHtml += '<option>' + i + '</option>';
            }
            dropHtml += '</select>';
        }
        else{
            dropHtml = "0";
        }
        return dropHtml;
    }

    function addPartToComponent(pPartID){
        obj = {}
        obj.cAction = "ADD_COMPONENT_PARTS";
        obj.cCompID = $('#AddPartsModal').attr('comp_to_update');;
        obj.cPartID = pPartID;
        obj.cAvlQty = $("#"+pPartID+"_qty").children(":selected").val();
        obj.cTotQty = $("#"+pPartID+"_qty").attr('available_qty');
        obj.cItemWeight = $("#"+pPartID+"_weight").text();
        obj.cItemCost = $("#"+pPartID+"_cost").text();
        $.post({
            url: 'server/component/componentPartsHandler.php',
            async: true,
            data: obj,
            dataType: 'json',
            success: onAddPartResponse,
            error: onAddPartResponse,
            cache: false
        });
    }

    function onAddPartResponse(respData){
        if(respData.success){
            console.log(respData.message);
            qtyAvl = parseInt($("#"+respData.requestPartID+"_qty").attr('available_qty')) - parseInt($("#"+respData.requestPartID+"_qty").children(":selected").val());
            $( "#"+respData.requestPartID+"_qtyDrop" ).html(generateQtyDropDown(qtyAvl,respData.requestPartID));
        }
        else{
            console.log(respData.message);
        }
    }
});





