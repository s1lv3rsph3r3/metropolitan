const path = require('path');
const basePath = path.resolve();

// Application modules configuration file
const applicationModulesConfigPath = path.resolve(basePath, 'config/application-modules.json');
const applicationModulesConfig = require(applicationModulesConfigPath);

const absolutePathToBaseProject = basePath;

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
