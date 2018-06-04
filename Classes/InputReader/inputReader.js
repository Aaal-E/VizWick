
/* Mehrdad Farsadyar  (1242624)*/

function makeTreeObj(input){
    var semicolonCounter = 0;//counts the number of semcolon when reading the file from the end
    var scanner = true; // boolean; when "true" then  process any char you read, else ignore the char
    var stack = []; //holds the currently open nodes till processed
    //var nodeObj = {name:null, parent:null, children:[]};
    var rootOfRoot = {name:null, parent:null, children:[]};
    var regex = ",(); ";
    rootOfRoot.name = 'rootOfRoot';
    var node = rootOfRoot;
    var subNode;
    for (var i = input.length-1; i >= 0; i--) {
        if (scanner == true){
            var n = input.charAt(i);
            switch(n) {
                case ')':
                    stack.push(node);
                    node = subNode;
                    break;

                case '(':
                    // '(' => close up the open node
                    node = stack.pop();
                    break;

                case ',':
                    // ',' => ignore
                    break;

                case ';':
                    if (++semicolonCounter > 1) scanner = false;
                    // ';' => ignore
                    break;

                case ' ':
                    // ' ' => ignore
                    break;

                case '\n':
                    // ' ' => ignore
                    break;

                case '\t':
                    // ' ' => ignore
                    break;

                default:
                // assume all other characters are node names
                    subNode = {name:null, parent:null, children:[]};
                    subNode.name = n;
                    var j = i-1;
                    while(regex.indexOf(input[j]) == -1 && j>= 0){ //can be simplified later using regexp
                        subNode.name = input[j] + subNode.name;
                        j--;
                    }
                    i = j+1; //offset by one, as i is decremented at end of the loop
                    subNode.parent = node; //set the parent to point to current open node
                    node.children.push(subNode);
                    break;
               }
        }
        else {
            // => do not read stuff before the unncesseary semicolon
        }

    }
    return rootOfRoot; //.children[0] ||  {name:"missing data", children:[]};
}
