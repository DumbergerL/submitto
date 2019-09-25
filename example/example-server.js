let express = require('express');

let app = express();

class ExampleServer{

    constructor(){

        app.use(express.static(__dirname+'/www'));
        app.use('/js/submitto.min.js', express.static(__dirname+'/../dist/submitto.min.js'));

        app.use(express.json());                        
        app.use(express.urlencoded({ extended: true }));

        app.get('/', this.getStartpage.bind(this));
        app.get('/api/articles', this.getArticles.bind(this));
        
        
        app.listen(3000, function () {
            console.log('\Example-Server started and listening to port 3000!');
        });

    }

    getStartpage(req, res){
        res.send('<script>location.href = "index.html";</script>');
    }


    getArticles(req, res){
        var responseObj = [
            {
                name: "Apfel",
                price: 2.1
            },
            {
                name: "Birne",
                price: 0.9
            }
        ]
        res.send( responseObj );
    }
}

var theServer = new ExampleServer();