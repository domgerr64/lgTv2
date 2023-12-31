import { ConfigFilePlugin } from '../schema/configFiles/types';
import { RenativeConfigPlugin, RenativeConfigPluginPlatform } from '../schema/types';

export type PluginCallback = (plugin: RnvPlugin, pluginPlat: RenativeConfigPluginPlatform, key: string) => void;

export type PluginListResponse = {
    asString: string;
    asArray: PluginListResponseItem[];
    plugins: string[];
    allPlugins: Record<string, PluginListResponseItem>;
    // json?: object;
};

export type PluginListResponseItem = {
    name: string;
    value: string;
    props?: Record<string, string>;
    version?: string;
};

export type RnvPluginScope = {
    npmVersion?: string;
    scope: string;
};

export type RnvPlugin = RenativeConfigPlugin & {
    packageName?: string;
    scope?: string;
    _scopes?: Array<string>;
    _id?: string;
    config?: ConfigFilePlugin;
};
