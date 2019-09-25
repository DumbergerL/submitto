let $ = require('jquery');

class VirtualForm{

    constructor(formJQ)
    {

        this.formJQ = formJQ ? formJQ : $('<form action="/"></form>');
        this.id = formJQ.attr('id') ? formJQ.attr('id') : null;
        this.data = {};

        this.parseFormAttributes();
        this.parseFormValues();
    }


    parseFormAttributes(){
        this.url = this.formJQ.attr('action');
        this.method = this.formJQ.attr('method') ? this.formJQ.attr('method') : 'GET';
        this.reload = this.formJQ.attr('reload') ? true : false;
    }

    parseFormValues(){
        var inputElements = this.formJQ.find(":input");

        inputElements.each( (index,element) => {
            var value = $(element).val();
            var name = $(element).attr("name");

            if(value === null || value === "")return;          
            if($(element).attr('type') === 'checkbox')value = $(element).is(':checked') ? 1 : 0;
            
            this.data[name] = value;
        });
    }

    clearForm(){
        this.formJQ.find(':input').not(':button, :submit, :reset, :hidden, :checkbox, :radio').val('');       
    }

}

module.exports = VirtualForm;