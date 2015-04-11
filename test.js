var nlp = require('nlp_compromise')
console.log(nlp.pos("Tony Hawk walked quickly to the store.").sentences[0].tokens[0].pos);
// ["NN","VBD","RB","TO","DT","NN"]

// console.log(nlp.pos("the obviously good swim"));
//["DT", "RB", "JJ", "NN"]