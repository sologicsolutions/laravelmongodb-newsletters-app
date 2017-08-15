var FileUpload={uploadInProgress:[],waitingToSubmit:false,submitForm:null,location:null,extraVars:[],extraVarsObj:{},init:function(a){a=$.extend({location:null,extraVars:null,formAction:null},a);FileUpload.location=a.location;if(a.extraVars){FileUpload.extraVars=a.extraVars;for(var b in FileUpload.extraVars){var c=FileUpload.extraVars[b];FileUpload.extraVarsObj[c.name]=c.value}}FileUpload.submitForm=$("form#document-upload-form");if(a.formAction){FileUpload.submitForm.attr("action",a.formAction)}FileUpload.submitForm.submit(FileUpload.onDocumentSubmit);$("div.file_upload_container").each(function(k,d){var h,l,e,g,f,m,j;FileUpload.uploadInProgress[k]=false;d=$(d);h=d.find(":file");fileTable=d.find(".files");l=h.attr("name");e=h.attr("service");g=h.attr("primary");f=h.attr("manuscriptType");m=h.attr("acceptFileTypes");m=!m?/.+$/i:new RegExp(".["+m+"]$","i");j=h.attr("maxUploads");j=!j||isNaN(j)?undefined:parseInt(j,10);d.fileupload({url:FileUpload.location+"upload-file",dataType:"json",autoUpload:true,filesContainer:fileTable,uploadTemplateId:"template-upload",downloadTemplateId:"template-download",limitConcurrentUploads:3,paramName:l,formData:function(i){var n,o;n=d.find(":input[name$=DocumentTitle]");if(n.attr("placeholder")!==n.val()){o=n.val()}else{o=""}n.val("");return FileUpload.extraVars.concat([{name:"primary",value:g},{name:"field_name",value:l},{name:"service_type",value:e},{name:"manuscript_type",value:f},{name:"title",value:o}])},acceptFileTypes:m,maxNumberOfFiles:j,getNumberOfFiles:function(){var n=$("#figure_files_container tr.template-upload").length;var i=$("#figure_files_container tr.template-download").length;return(n+i)},progressall:function(o,n){var i=parseInt(n.loaded/n.total*100,10);$("#progress .bar").css("width",i+"%")}}).bind("fileuploadsend",function(i,n){FileUpload.uploadInProgress[k]=true}).bind("fileuploadalways",function(i,n){FileUpload.uploadInProgress[k]=false;if(FileUpload.waitingToSubmit){$("#formSubmitPending").remove();FileUpload.submitForm.submit()}}).bind("fileuploadcompleted",function(i,n){FileUpload.initInstructionHandles(n.context)}).bind("fileuploaddestroy",function(i,n){FileUpload.removeInstructions(n.context);if(!n.context.hasClass("file-upload-error")){FileUpload.removeFile(n.context.find(".file-id").val(),n.context)}})});FileUpload.loadSessionFiles()},initInstructionHandles:function(a){$(":radio.main-instruction",a).click(function(){var b=$(this).closest(".main-doc-instruction-open").nextAll(".main-doc-instructions");if(Number($(this).val())===1){b.slideDown().removeClass("hidden")}else{b.slideUp()}});$(":checkbox.instruction-other",a).click(function(){var b=$(this).closest(".main-doc-instructions").find(".main-doc-instruction-other");if($(this).is(":checked")){b.show("slow").removeClass("hidden")}else{b.slideUp()}})},onDocumentSubmit:function(a){if(Array.indexOf){if(FileUpload.uploadInProgress.indexOf(true)>-1){$("body").append('<div id="formSubmitPending" class="submission-button">Waiting for upload to finish...</div>');FileUpload.waitingToSubmit=true;return false}}return true},loadSessionFiles:function(){$.post(FileUpload.location+"reload-uploaded-files",FileUpload.extraVarsObj,function(e){if(e.success===false){alert(e.message);return}var c,b,f,a;for(c in e.files){if(e.files.hasOwnProperty(c)){var d=new Array();for(b=0;b<e.files[c].length;b++){f=e.files[c][b];a=$(":file[manuscriptType="+c+"]").parents("div.file_upload_container");d.push(f)}a.find(".files").append(tmpl("template-download",{files:d}));a.find(".template-download").toggleClass("in");FileUpload.initInstructionHandles(a)}}})},removeFile:function(b,a){$.post(FileUpload.location+"remove-file",$.extend(FileUpload.extraVarsObj,{file_id:b}),function(c){if(!c.success){alert(c.msg);return}a.remove()},"json")},removeInstructions:function(a){a.next("tr.main-doc-instructions").remove()}};