import type { _PluginPlatformMergedType } from '../zod/configPlugins';
import type { _PlatformsKeysType } from '../zod/shared/configShared';
import type { ConfigRootMerged } from './configRootMerged';

export type RenativeConfigFile = ConfigRootMerged;

export type RenativeConfigBuildScheme = Required<RenativeConfigFile['platforms'][string]>['buildSchemes'][string];

export type RenativeConfigPlugin = RenativeConfigFile['plugins'][string];

export type RenativeConfigPlatform = RenativeConfigFile['platforms'][string];

export type RenativeConfigPluginPlatform = _PluginPlatformMergedType;

export type RenativeWebpackConfig = RenativeConfigFile['plugins'][string]['webpackConfig'];

export type PlatformKey = _PlatformsKeysType;