const ModuleRouteStore = (function(){
    const data = {};
    let key = null;

    // Item is a Route
    function add(verb, item){
        if(key === null || key === undefined){
            throw (new Error('Cannot add an item when the key is undefined'));
        }
        // if the data is null or undefined then we initialise a new array and push
        if(data[key] === null || data[key] === undefined){
            data[key] = {
                "get": [],
                "post": [],
                "put": [],
                "delete": []
            };
        }
        data[key][verb].push(item);
    }

    function get(){
        return data;
    }

    function next(k){
        if(k === null || k === undefined){
            throw (new Error('Cannot call next on null or undefined'));
        }
        key = k;
    }

    function currentKey(){
        return key;
    }

    return {
        add,
        get,
        next,
        currentKey,
    };
}());

module.exports = ModuleRouteStore;

// // We only need to store a list of all routes according to their verb
// // Each route will hold the correct
// const exampleObj = {
//     "default": {
//         "get": [],
//         "post": [],
//         "put": [],
//         "delete": []
//     },
//     "anotherModule": {
//         "get": [],
//         "post": [],
//         "put": [],
//         "delete": []
//     }
// }
