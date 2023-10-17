import type { RnvContext } from '../context/types';
import type { ConfigProp, ConfigPropKey } from '../schema/types';
import type { DoResolveFn } from '../system/types';
import type { RnvPlatform } from '../types';

export interface RnvApi {
    isDefault: boolean;
    spinner: RnvApiSpinner;
    prompt: RnvApiPrompt;
    analytics: RnvContextAnalytics;
    // chalk: RnvApiChalk;
    logger: RnvApiLogger;
    fsExistsSync: any;
    fsReadFileSync: any;
    fsReaddirSync: any;
    fsWriteFileSync: any;
    path: any;
    doResolve: DoResolveFn;
    getConfigProp: GetConfigPropFn;
}

export type RnvApiSpinner = (msg: string | { text: string }) => {
    start: RnvApiSpinner;
    fail: RnvApiSpinner;
    succeed: RnvApiSpinner;
    text: string;
};

export type RnvApiPrompt = {
    inquirerPrompt: (options: PromptParams) => Promise<any>;
    generateOptions: (
        inputData: any,
        isMultiChoice?: boolean,
        mapping?: any,
        renderMethod?: PromptRenderFn
    ) => PromptOptions;
    pressAnyKeyToContinue: () => Promise<any>;
    inquirerSeparator: () => any;
};

export type RnvContextAnalytics = {
    captureEvent: (ops: { type: string; platform?: RnvPlatform; template?: string; platforms?: Array<string> }) => void;
    captureException: (e: string | Error, context: { extra: any }) => void;
    teardown: () => Promise<void>;
};

export type RnvApiChalk = {
    white: RnvApiChalkFn;
    green: RnvApiChalkFn;
    red: RnvApiChalkFn;
    yellow: RnvApiChalkFn;
    // default: RnvApiChalkFn;
    gray: RnvApiChalkFn;
    grey: RnvApiChalkFn;
    blue: RnvApiChalkFn;
    cyan: RnvApiChalkFn;
    magenta: RnvApiChalkFn;
    rgb: (red: number, green: number, blue: number) => any;
    bold: RnvApiChalkFn;
};

export type RnvApiChalkFn = ((v: any) => any) & RnvApiChalk;

export type RnvApiLogger = {
    logWelcome: () => void;
    logAndSave: (msg: string, skipLog?: boolean) => void;
    getCurrentCommand: (excludeDollar: boolean) => void;
    logToSummary: (v: string, sanitizePaths?: () => string) => void;
    logRaw: (...args: Array<string>) => void;
    logSummary: (header: string) => void;
    logTask: (task: string, customChalk?: any) => void;
    logInitTask: (task: string, customChalk?: string | ((s: string) => string)) => void;
    logExitTask: (task: string, customChalk?: (s: string) => string) => void;
    logHook: (hook: string, msg?: string) => void;
    logWarning: (msg: string | boolean) => void;
    logInfo: (msg: string) => void;
    logDebug: (...args: Array<any>) => void;
    isInfoEnabled: () => boolean;
    logComplete: (isEnd?: boolean) => void;
    logSuccess: (msg: string) => void;
    logError: (e: Error | string, isEnd?: boolean, skipAnalytics?: boolean) => void;
    logEnd: (code: number) => void;
    logInitialize: () => void;
    logAppInfo: (c: RnvContext) => void;
    printIntoBox: (str: string) => string;
    printArrIntoBox: (arr: Array<string>, prefix?: string) => string;
    printBoxStart: (str: string, str2?: string) => string;
    printBoxEnd: () => string;
    chalk: () => RnvApiChalk;
};

export type PromptOptions = {
    keysAsArray: any;
    valuesAsArray: any;
    keysAsObject: any;
    valuesAsObject: any;
    asString: any;
    optionsAsArray: any;
};

export type PromptParams = {
    // logMessage?: string;
    // warningMessage?: string;
    // message?: string;
    // choices?: any;
    // default?: any;
    // name?: string;
    // type: string;
    // pageSize?: number;
    // validate?: (i: string) => string | boolean;

    name?: string;
    type: string;
    message?: string;
    choices?: Array<{ name: string; value: any } | string>;
    validate?: (i: string) => string | boolean;
    logMessage?: string;
    warningMessage?: string;
    default?: any;
    pageSize?: number;
    loop?: boolean;
};

export type PromptRenderFn = (i: number, obj: any, mapping: any, defaultVal: string) => string;

export type GetConfigPropFn = <T extends ConfigPropKey>(
    c: RnvContext,
    platform: RnvPlatform,
    key: ConfigPropKey,
    defaultVal?: ConfigProp[T]
) => ConfigProp[T];
