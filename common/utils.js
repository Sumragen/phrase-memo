
function isMessageOfType(name, request){
    /*check message type*/
    var eventKey = 'type';
    return eventKey in request && request[eventKey] == name;
}