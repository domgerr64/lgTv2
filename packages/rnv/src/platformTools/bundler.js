import axios from 'axios';
import ora from 'ora';

import Config from '../config';

export const isBundlerRunning = async (c) => {
    try {
        const { data } = await axios.get(`http://127.0.0.1:${c.runtime.port}/index.ios.bundle`);
        if (data.includes('__BUNDLE_START_TIME__')) return true;
        return false;
    } catch {
        return false;
    }
};

const poll = (fn, timeout = 10000, interval = 1000) => {
    const endTime = Number(new Date()) + timeout;

    const spinner = ora('Waiting for bundler to finish...').start();
    const checkCondition = async (resolve, reject) => {
        try {
            const result = await fn();
            if (result) {
                spinner.succeed();
                resolve();
            } else if (Number(new Date()) < endTime) {
                setTimeout(checkCondition, interval, resolve, reject);
            } else {
                spinner.fail('Can\'t connect to bundler. Try restarting it.');
                reject();
            }
        } catch (e) {
            spinner.fail('Can\'t connect to bundler. Try restarting it.');
            reject(e);
        }
    };

    return new Promise(checkCondition);
};

export const waitForBundler = async c => poll(() => isBundlerRunning(c));
