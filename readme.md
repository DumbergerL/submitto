# Submitto

## Form Attributes
* `method` - POST / GET / PUT / DELETE
* `action` - Endpoint URL
* `reload` - Reload after success callback

## Parsing Form
* takes the `name`-Attribute for key in json object
* takes the `value`-Attribute for value in json object


## Submitto Before Send Handler


## AjaxRequest
**Example Code**
```
var Ajax = new AjaxRequest('http://localhost:8000/api/songs');

Ajax.registerMiddleware(
    function(ajaxObj, data, next){
        console.log("m1 before");
        next(ajaxObj, data);
        console.log(data);
        
    }
);

Ajax.registerMiddleware(
    function(ajaxObj, data, next){
        console.log("m2 before");
        console.log(data);
        next(ajaxObj, data);
        console.log("m2 after");
        console.log(data);
    }
);

Ajax.registerCallback('success', (data,textStatus, jqXHR) => {
    console.log("Succes1"+textStatus);
});
Ajax.registerCallback('error', (jqXHR, textStatus, errorThrown) => {
    console.log("rrr+"+textStatus);
});

Ajax.invokeAjax();
```