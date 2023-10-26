import path from 'path';
import {
    executeAsync,
    getAppFolder,
    getConfigProp,
    getEntryFile,
    generateEnvVars,
    isSystemWin,
    chalk,
    logTask,
    logInfo,
    logSuccess,
    ANDROID_WEAR,
    RnvContext,
    DEFAULTS,
    RnvPlatform,
} from '@rnv/core';

export const packageReactNativeAndroid = async (c: RnvContext) => {
    logTask('packageAndroid');
    const { platform } = c;

    if (!c.platform) return;

    const bundleAssets = getConfigProp(c, platform, 'bundleAssets', false) === true;

    if (!bundleAssets && platform !== ANDROID_WEAR) {
        logInfo(`bundleAssets in scheme ${chalk().white(c.runtime.scheme)} marked false. SKIPPING PACKAGING...`);
        return true;
    }

    const outputFile = getEntryFile(c, platform);

    const appFolder = getAppFolder(c);
    let reactNative = c.runtime.runtimeExtraProps?.reactNativePackageName || 'react-native';

    if (isSystemWin) {
        reactNative = path.normalize(`${process.cwd()}/node_modules/.bin/react-native.cmd`);
    }

    logInfo('ANDROID PACKAGE STARTING...');

    try {
        let cmd = `${reactNative} bundle --platform android --dev false --assets-dest ${path.join(
            appFolder,
            'app',
            'src',
            'main',
            'res'
        )} --entry-file ${c.buildConfig.platforms?.[c.platform]?.entryFile}.js --bundle-output ${path.join(
            appFolder,
            'app',
            'src',
            'main',
            'assets',
            `${outputFile}.bundle`
        )} --config=metro.config.js`;

        if (getConfigProp(c, c.platform, 'enableSourceMaps', false)) {
            cmd += ` --sourcemap-output ${path.join(
                appFolder,
                'app',
                'src',
                'main',
                'assets',
                `${outputFile}.bundle.map`
            )}`;
        }
        await executeAsync(c, cmd, { env: { ...generateEnvVars(c) } });

        logInfo('ANDROID PACKAGE FINISHED');
        return true;
    } catch (e) {
        logInfo('ANDROID PACKAGE FAILED');
        return Promise.reject(e);
    }
};

export const runReactNativeAndroid = async (
    c: RnvContext,
    platform: RnvPlatform,
    device: { udid?: string } | undefined
) => {
    logTask('_runGradleApp');

    const signingConfig = getConfigProp(c, platform, 'signingConfig', 'Debug');
    const appFolder = getAppFolder(c);

    const udid = device?.udid;

    let command = `npx react-native run-android --mode=${signingConfig} --no-packager`;

    if (udid) {
        command += ` --deviceId=${udid}`;
    }

    return executeAsync(c, command, {
        env: {
            RCT_METRO_PORT: c.runtime.port,
            ...generateEnvVars(c, undefined, undefined, { exludeEnvKeys: ['RNV_EXTENSIONS'] }),
        },
        cwd: appFolder,
        //This is required to make rn cli logs visible in rnv executed terminal
        interactive: true,
        stdio: 'inherit',
        printableEnvKeys: ['RNV_REACT_NATIVE_PATH', 'RNV_APP_ID', 'RNV_PROJECT_ROOT', 'RNV_APP_BUILD_DIR'],
    });
};

export const buildAndroid = async (c: RnvContext) => {
    logTask('buildAndroid');
    const { platform } = c;

    const appFolder = getAppFolder(c);
    const signingConfig = getConfigProp(c, platform, 'signingConfig') || DEFAULTS.signingConfig;

    const outputAab = getConfigProp(c, platform, 'aab', false);
    // shortcircuit devices logic since aabs can't be installed on a device
    if (outputAab) return runReactNativeAndroid(c, platform, {});

    const extraGradleParams = getConfigProp(c, platform, 'extraGradleParams', '');

    let command = `npx react-native build-android --mode=${signingConfig} --no-packager`;

    if (extraGradleParams) {
        command += ` --extra-params ${extraGradleParams}`;
    }

    await executeAsync(c, command, { cwd: appFolder });

    logSuccess(
        `Your APK is located in ${chalk().cyan(
            path.join(appFolder, `app/build/outputs/apk/${signingConfig.toLowerCase()}`)
        )} .`
    );
    return true;
};