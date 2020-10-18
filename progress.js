/*
Use the following to manage progress bars
Functions that update progress will accept the object returned by bindProgress
These functions will call progressInit with one argument indicating the number of steps in the process.
These functions will call progressUpdate when each step is completed.
*/

const bindProgress = (progressInit, progressUpdate) =>{
    return {
        progressInit: progressInit,
        progressUpdate: progressUpdate
    };
};

exports.bindProgress = bindProgress;