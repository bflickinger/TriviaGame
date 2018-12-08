$(document).ready();
    $.backstretch([
        "assets/images/cerberus.jpg",
        "assets/images/myths09.jpg",
        "assets/images/norse1.jpg",
        "assets/images/posideon.jpg",
        "assets/images/sirens.jpg",
        "assets/images/statues.jpg"
    ], {duration: 5000, fade: 750});

$(document).ready(function(){
    $("#countdown").hide();
    $("#start").on("click", trivia.initGame);
    $(document).on("click" , ".option", trivia.guessChecker);
});
    
var trivia = {
    queryURL: "https://opentdb.com/api.php?amount=30&category=20&type=multiple",
    incorrect: 0,
    correct: 0,
    unanswered: 0,
    currentQuestion: 0,
    timer: 20,
    timerEnabled: false,
    timerId: "",
    tQuestion: [],
    tChoices: [],
    tAnswer: [],

    getQuestions: function(){
        $.ajax({
            url: this.queryURL,
            method: "GET"
            }).then(function(response) {
                console.log(response);
                $.each(response.results, function(index){
                    trivia.tQuestion[index] = response.results[index].question;
                    trivia.tAnswer[index] = response.results[index].correct_answer;
                    trivia.tChoices[index] = response.results[index].incorrect_answers;
                    trivia.tChoices[index].push(response.results[index].correct_answer);
                    trivia.tChoices[index].sort(() => Math.random() - 0.5);
                    // console.log(trivia.tChoices[index]);
                });
        });
    },
    initGame: function(){
        trivia.currentQuestion = 0;
        trivia.correct = 0;
        trivia.incorrect = 0;
        trivia.unanswered = 0;
        clearInterval(this.timerId);
        $("#game").show();
        $("#results").html("");
        $("#timer").text(trivia.timer);
        $("#start").hide();
        $("#countdown").show();
        trivia.getQuestions();
        trivia.askQuestion();
        
    },
    askQuestion : function(){
        trivia.timer = 10;
        $("#timer").removeClass("last-seconds");
        $("#timer").text(trivia.timer);
        if(!trivia.timerEnabled){
            trivia.timerId = setInterval(trivia.timerRunning, 1000);
        }
        $("#question").text("Get Ready!");
        setTimeout(function(){
            $("#question").text(trivia.tQuestion[trivia.currentQuestion]);
            console.log(trivia.tQuestion[0]);
            $.each(trivia.tChoices[trivia.currentQuestion], function(index, key){
                $("#options").append($("<div><button class='option btn btn-info btn-lg'>"+key+"</button></div>"));
            });
        }, 2000);
        
    },
    timerRunning : function(){
        if(trivia.timer > -1 && trivia.currentQuestion < Object.keys(trivia.tQuestion).length){
        $("#timer").text(trivia.timer);
        trivia.timer--;
            if(trivia.timer === 4){
                $("#timer").addClass("last-seconds");
            }
        }
        else if(trivia.timer === -1){
            trivia.unanswered++;
            trivia.result = false;
            clearInterval(trivia.timerId);
            resultId = setTimeout(trivia.guessResult, 2000);
            $("#results").html('<h3>Out of time! The answer was '+ trivia.tAnswer[trivia.currentQuestion] +'</h3>');
        }
        else if(trivia.currentQuestion === Object.keys(trivia.tQuestion).length){
            $("#results")
            .html("<h3>Results</h3>"+
            "<p>Correct: "+ trivia.correct +"</p>"+
            "<p>Incorrect: "+ trivia.incorrect +"</p>"+
            "<p>Unaswered: "+ trivia.unanswered +"</p>"+
            "<p>Why not try again?</p>");
            $("#game").hide();
            $("#start").show();
        }
        
    },
    guessChecker : function() {
        if($(this).text() === trivia.tAnswer[trivia.currentQuestion]){
            $(this).addClass("btn-success").removeClass("btn-info");
            trivia.correct++;
            clearInterval(trivia.timerId);
            resultId = setTimeout(trivia.guessResult, 1000);
            $("#results").html("<h3>Correct Answer!</h3>");
        }
        else{
            $(this).addClass("btn-danger").removeClass("btn-info");
            trivia.incorrect++;
            clearInterval(trivia.timerId);
            resultId = setTimeout(trivia.guessResult, 1500);
            $("#results").html("<h3>Incorrect! "+ trivia.tAnswer[trivia.currentQuestion] +"</h3>");
        }
        
    },
    guessResult : function(){
        trivia.currentQuestion++;
        $(".option").remove();
        $("#results h3").remove();
        trivia.askQuestion();
    }
    
}   
