export type ExecOptions = {
    interactive?: boolean;
    silent?: boolean;
    stdio?: 'pipe' | 'inherit' | 'ignore';
    shell?: boolean;
    localDir?: string;
    preferLocal?: boolean;
    all?: boolean;
    maxErrorLength?: number;
    mono?: boolean;
    rawCommand?: {
        args: Array<string>;
    };
    privateParams?: Array<string>;
    env?: NodeJS.Process['env'];
    ignoreErrors?: boolean;
    detached?: boolean;
    cwd?: string;
    timeout?: number;
};

export type ResolveOptions = {
    basedir?: string;
    forceForwardPaths?: boolean;
    extensions?: Array<string>;
    keepSuffix?: boolean;
};

export type ExecCallback = (isError: boolean) => void;

export type ExecCallback2 = (result: any, isError: boolean) => void;

export type AnalyticsApi = {
    captureException: (e: string | Error, context: { extra: any }) => void;
    teardown: () => Promise<void>;
};

export type OverridesOptions = Array<{
    pattern: string;
    override: string;
}>;

export type TimestampPathsConfig = {
    timestamp: Array<string>;
    paths: Array<string>;
};

export type RnvCLI = Record<string, object>;

export type FileUtilsPropConfig = {
    props: Record<string, string>;
    configProps?: Record<string, string>;
    runtimeProps?: Record<string, any>;
    files?: Record<string, any>;
};

export type FileUtilsUpdateConfig = {
    androidSdk: string;
    tizenSdk: string;
    webosSdk: string;
};