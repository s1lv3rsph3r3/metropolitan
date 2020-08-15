const { BRC487 } = require('@s1lv3rsph3r3/central');
const path = require('path');

// Application modules configuration file
const applicationModulesConfig = require(BRC487.commute('config.applicationModules'));

const absolutePathToBaseProject = BRC487.getAbsolutePathToBaseProject();

module.exports = (function start() {

    const alias = (dirName) => {

        let currentPath = path.resolve(dirName);
        let currentBasename = path.basename(path.resolve(dirName));

        // first lets see if we need to search at all
        if(currentBasename === applicationModulesConfig.baseDir){
            throw (new Error('Cannot resolve a module alias.'));
        }

        let hasReachedBaseProj = false;
        let hasReachedRoot = false;

        while (!hasReachedRoot) {
            let temporaryPath = path.resolve(currentPath, '..');
            let temporaryBaseName = path.basename(path.resolve(temporaryPath));
            if (temporaryPath !== currentPath) {

                if(temporaryBaseName === applicationModulesConfig.baseDir){
                    // Stop looping
                    hasReachedRoot = true;

                    // return the currentBaseName
                    return currentBasename;
                }

                // reassign the baseNames and paths
                currentBasename = temporaryBaseName;
                currentPath = temporaryPath;
            } else {
                // Reached the furthest up possible
                hasReachedRoot = true;
            }
        }
    };

    return {
        alias,
    };
}());
