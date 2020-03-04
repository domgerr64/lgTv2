import resolve from 'resolve';

/**
 * An attempt at drying out filesystem references to [external packages](https://tinyurl.com/mao2dy6).
 *
 * We access external packages for a number of reasons:
 *  - to simply resolve a non-scoped package's (absolute) path on disk. e.g. '/var/project/node_modules/react-native'
 *  - to resolve a scoped package's (absolute) path on disk. e.g. '/var/project/node_modules/@aScope/react-native'
 *  - to resolve an individual file/dir's (absolute) path on disk. e.g. '/var/project/node_modules/react-native/blur/android' (note this is a normally illegal package reference)
 *  - to resolve an individual file (absolute) path on disk by FS relative reference. e.g. '/var/project/node_modules/react-native/relPath'
 *
 * ** Please note that we do not support [subpackage paths](https://tinyurl.com/vub6c7t). All suffixed paths (e.g. 'react-native/SUFFIX_PATH', '@aScope/react-native/SUFFIX_PATH')
 * will be treated as a filepath from root of resolved package (i.e. will ignore subdirectory package.json)
 *
 * @param {*} aPath - package name. e.g. 'file:../rel/path', 'react-native', 'react-native/android', '@react-native-community/masked-view/android'
 * @param {*} mandatory - whether it throws
 * @param {*} options - docs - https://tinyurl.com/r9sfpf7 && {keepSuffix: boolean}
 */
export const doResolve = (aPath, mandatory = true, options = {}) => {
    try {
        if (aPath.startsWith('file:')) {
            return _doResolveFSPath(aPath, options);
        }

        return _doResolveExternalPackage(aPath, options);
    } catch (err) {
        // perhaps do some warning logging here..
        if (mandatory) throw err;
    }
};

export const isScopedPackagePath = aPath => {
    if (aPath.startsWith('@')) {
        if (!aPath.includes('/'))
            throw new Error(
                `Scoped packages must include subpackage portion e.g. '@aScope/subpackage'. Supplied path: ${aPath}`
            );
        return true;
    }
};

const _getPackagePathParts = aPath => {
    let parts = [];
    if (isScopedPackagePath(aPath)) {
        parts = aPath.match(/^([^/]+\/[^/]+)\/(.*)/);
    } else {
        parts = aPath.match(/^([^/]+)\/?(.*)/);
    }
    return parts.slice(1);
};

/**
 * We support path linking using 'file:' protocol (not part of official node resolution alg.)
 */
const _doResolveFSPath = (aPath, options) => {
    const fileRelPath = `${
        options.basedir ? `${options.basedir}/`.replace(/.*\/+$/, '/') : ''
    }${aPath.replace('file:', '')}`;
    if (!fs.existsSync(fileRelPath)) {
        throw new Error(
            `Explicit filepath ${aPath} does not resolve to dir or file`
        );
    }
    return fileRelPath;
};

/**
 * @see 'LOAD_NODE_MODULES' of node resolution alg. - https://tinyurl.com/pgz6f33
 */
const _doResolveExternalPackage = (aPath, options) => {
    const [packageBase, packageSuffix] = _getPackagePathParts(aPath);
    const resolvedPath = resolve.sync(packageBase, {
        packageFilter: (pkg) => {
            if (typeof pkg.main === 'undefined') {
                pkg.main = 'package.json';
            }
            return pkg;
        },
        ...options,
        extensions: ['.js', '.json'].concat(options.extensions ?? [])
    });
    return options.keepSuffix ?? false
        ? `${resolvedPath}/${packageSuffix}`
        : resolvedPath;
};
