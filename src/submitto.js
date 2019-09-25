let $ = require('jquery');
let VirtualForm = require('./lib/virtual-form');
let AjaxRequest = require('./lib/ajax-request');


class Submitto{

    constructor()
    {    
        this.SUBMIT_ELEMENTS = ['.submit'];

        this.ajaxCallbacks = Array();
        this.ajaxMiddlewares = Array();

        this._registerEvents();
    }

    registerAjaxCallback(type, callback){
        this.registerFormCallback(null, type, callback);
    }

    registerFormCallback(formId, type, callback){
        this.ajaxCallbacks.push({
            type: type,
            callback: callback,
            formId: formId
        });
        
    }

    registerAjaxMiddleware(middleware){
        this.ajaxMiddlewares.push(middleware);
    }

    fakeSubmit(virtualForm){
        this._sendVirtualForm(virtualForm);
    }

    _registerEvents(){
        this.SUBMIT_ELEMENTS.forEach(element => {
            $(element).off('click');
            $('form input').off('keydown');    
            $(element).click(this._onSubmit.bind(this));
            $('form input').keydown(function(e){
                if(e.keyCode == 13){
                    this._onSubmit(e);
                }
            }.bind(this));
        });
    }

    _onSubmit(e){
        e.preventDefault();
        this._sendForm( $(e.target).closest("form"));
        
    }

    _sendForm(formJQ){
        this.virtualForm = new VirtualForm( formJQ );
        this._sendVirtualForm(this.virtualForm);
    }

    _sendVirtualForm(virtualForm){
        this.ajaxRequest = new AjaxRequest(virtualForm.url, virtualForm.method);

        this.ajaxMiddlewares.forEach( (middleware) => {
            this.ajaxRequest.registerMiddleware(middleware);
        });        

        this.ajaxRequest.registerMiddleware((ajaxObj, data, next) => {  //register it as first request to be executed...
            data = virtualForm.data;
            next(ajaxObj, data);
        });


        this.ajaxCallbacks.forEach( (obj) => {
            if(virtualForm.id === obj.formId || obj.formId === null){
                console.log("ACCEPT: "+virtualForm.id+"-"+obj.formId);
                this.ajaxRequest.registerCallback(obj.type, obj.callback);
            }
        });

        this.ajaxRequest.sendAjax();
    }

}

window.Submitto = new Submitto();
window.VirtualForm = VirtualForm;
window.AjaxRequest = AjaxRequest;
