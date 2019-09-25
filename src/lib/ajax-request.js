let $ = require('jquery');

class AjaxRequest{

    constructor(baseUrl = '/', method = 'GET')
    {
        this.BASE_URL = baseUrl;
        this.METHOD = method;

        this.callbacksSuccess = Array();
        this.callbacksError = Array();   
        this.callbacksComplete = Array();

        this.currentMiddleware = 0;
        this.middlewares = Array();

        this.ajaxObj = {
            url: this.BASE_URL,
            headers:{
                Accept: "application/json",
                Authorization: 'Bearer '+$('meta[name=api_token]').attr("content")
            },
            method: this.METHOD,
            data: {}, 
            success: this._callbackSuccess.bind(this),
            error: this._callbackError.bind(this),
            complete: this._callbackComplete.bind(this)
        };

        this.registerMiddleware(this._invokeAjax);
    }

    registerCallback(type, callback){
        switch (type) {
            case "success":
                this.callbacksSuccess.push(callback);
                break;
            case "error":
                this.callbacksError.push(callback);
                break;
            case "complete":
                this.callbacksComplete.push(callback);
                break;
            default:
                return false;
                break;
        }
    }

    registerMiddleware(callback){
        this.middlewares.reverse();
        this.middlewares.push(callback);
        this.middlewares.reverse();
    }

    sendAjax(){
        this.middlewares[0]( this.ajaxObj , {}, this._invokeMiddleware.bind(this));
    }

    _invokeMiddleware(ajaxObj, data){
        if((this.middlewares.length - 1) == (this.currentMiddleware))return;
        this.currentMiddleware++;
        this.middlewares[this.currentMiddleware](ajaxObj, data, this._invokeMiddleware.bind(this));
    }

    _invokeAjax(ajaxObj, data){
        ajaxObj.data = Object.assign(ajaxObj.data, data);
        return $.ajax(ajaxObj);
    }

    _callbackSuccess(data, textStatus, jqXHR){
        this.callbacksSuccess.forEach(callback => {
            callback(data, textStatus, jqXHR);
        });        
    }

    _callbackError(jqXHR, textStatus, errorThrown){
        this.callbacksError.forEach(callback => {
            callback(jqXHR, textStatus, errorThrown);
        });
    }
    
    _callbackComplete(jqXHR, textStatus){
        this.callbacksComplete.forEach(callback => {
            callback(jqXHR, textStatus);
        });
    }

}

module.exports = AjaxRequest;