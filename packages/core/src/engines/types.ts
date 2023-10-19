import { ConfigFileEngine } from '../schema/configFiles/types';
import type { RnvTaskMap } from '../tasks/types';

export type RnvEngine = {
    originalTemplatePlatformsDir?: string;
    platforms: Record<string, RnvEnginePlatform>;
    config: ConfigFileEngine;
    tasks: RnvTaskMap;
    // initializeRuntimeConfig: (c: RnvContext) => void;
    rootPath?: string;
    originalTemplatePlatformProjectDir?: string;
    projectDirName: string;
    runtimeExtraProps: Record<string, string>;
    outputDirName?: string;
    serverDirName: string;
    getAliases?: (alias: any) => any;
    // package: string;
    // ejectPlatform: null;
};

export type RnvEnginePlatform = {
    extensions: Array<string>;
    isWebHosted?: boolean;
    defaultPort: number;
};

export type RnvEngineTemplate = {
    id: string;
    packageName?: string;
};

export type RnvEngineTemplateMap = Record<string, RnvEngineTemplate>;

export type RnvEngineInstallConfig = {
    key: string;
    version?: string;
    engineRootPath?: string;
    configPath?: string;
};
