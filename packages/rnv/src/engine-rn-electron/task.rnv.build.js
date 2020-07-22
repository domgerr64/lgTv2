import { logTask } from '../core/systemManager/logger';
import {
    MACOS,
    WINDOWS,
    TASK_BUILD, TASK_PACKAGE,
} from '../core/constants';
import { logErrorPlatform } from '../core/platformManager';
import { buildElectron } from '../sdk-electron';
import { executeTask } from '../core/engineManager';

export const taskRnvBuild = async (c, parentTask, originTask) => {
    logTask('taskRnvBuild', `parent:${parentTask}`);
    const { platform } = c;

    await executeTask(c, TASK_PACKAGE, TASK_BUILD, originTask);
    switch (platform) {
        case MACOS:
        case WINDOWS:
            await buildElectron(c);
            return;
        default:
            logErrorPlatform(c);
    }
};

export default {
    description: '',
    fn: taskRnvBuild,
    task: 'build',
    params: [],
    platforms: [
        MACOS,
        WINDOWS,
    ],
};