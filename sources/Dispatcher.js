'use strict';

function dispatch(argv, jobs) {
    if (!argv || !argv.hasOwnProperty('_'))
        throw new Error('No command given!');
    let command = argv._[0];
    if (!jobs || !jobs.hasOwnProperty(command))
        throw new Error('Unrecognized command: ' + command);
    jobs[command].run();
}

module.exports = {
    dispatch: dispatch
};