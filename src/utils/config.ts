import { resolve } from 'path';

/**
 * 撤回文件保存位置
 */
export const FilePath = resolve(process.env.ROOT_DIR || '', 'files');
