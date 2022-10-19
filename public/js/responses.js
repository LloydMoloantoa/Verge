function getBotResponse(input) {


    // Simple responses
    if (input == "hello") {
        return "Hello there!";
    } else if (input == "goodbye") {
        return "Talk to you later!";
    } else if (input == "hi") {
        return "Hello there! If you have an issues send a comment or Suggestion in the Suggestion section.";
    } else if (input == "Yes" || "yes") {
        return "Select the answer on the answers from the multiple choice questions. if you are ready to begin type Ok";
    }
    else {
        return "Try asking something else!";
    }

    
}