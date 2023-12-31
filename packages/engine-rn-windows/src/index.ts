import { RnvEngine, generateEngineTasks, generateEngineExtensions } from '@rnv/core';
import { withRNVMetro } from './adapters/metroAdapter';
import { withRNVBabel } from './adapters/babelAdapter';
//@ts-ignore
import CNF from '../renative.engine.json';
import taskRnvBuild from './tasks/task.rnv.build';
import taskRnvConfigure from './tasks/task.rnv.configure';
import taskRnvDebug from './tasks/task.rnv.debug';
import taskRnvDeploy from './tasks/task.rnv.deploy';
import taskRnvExport from './tasks/task.rnv.export';
import taskRnvPackage from './tasks/task.rnv.package';
import taskRnvRun from './tasks/task.rnv.run';
import taskRnvStart from './tasks/task.rnv.start';
import { withRNVRNConfig } from "@rnv/sdk-react-native";

const Engine: RnvEngine = {
    // initializeRuntimeConfig: (c) => Context.initializeConfig(c),
    tasks: generateEngineTasks([
        taskRnvRun,
        taskRnvPackage,
        taskRnvBuild,
        taskRnvConfigure,
        taskRnvStart,
        taskRnvExport,
        taskRnvDeploy,
        taskRnvDebug,
    ]),
    config: CNF,
    projectDirName: '',
    runtimeExtraProps: {},
    serverDirName: '',
    platforms: {
        windows: {
            defaultPort: 8092,
            extensions: generateEngineExtensions(['windows.desktop', 'windows', 'win', 'desktop'], CNF),
        },
        xbox: {
            defaultPort: 8099,
            // What works on windows will work on xbox, but it needs to be scaled as for TVs
            extensions: generateEngineExtensions(['xbox', 'windows', 'win', 'tv', 'desktop'], CNF),
        },
    },
};

// Backward compatibility
const withRNV = withRNVMetro;

export { withRNV, withRNVMetro, withRNVBabel, withRNVRNConfig };

export default Engine;
