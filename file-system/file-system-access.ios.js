import { encoding as textEncoding } from '../text';
import { iOSNativeHelper } from '../utils';
// TODO: Implement all the APIs receiving callback using async blocks
// TODO: Check whether we need try/catch blocks for the iOS implementation
export class FileSystemAccess {
    constructor() {
        this.readText = this.readTextSync.bind(this);
        this.read = this.readSync.bind(this);
        this.writeText = this.writeTextSync.bind(this);
        this.write = this.writeSync.bind(this);
    }
    getLastModified(path) {
        const fileManager = NSFileManager.defaultManager;
        const attributes = fileManager.attributesOfItemAtPathError(path);
        if (attributes) {
            return attributes.objectForKey('NSFileModificationDate');
        }
        else {
            return new Date();
        }
    }
    getFileSize(path) {
        const fileManager = NSFileManager.defaultManager;
        const attributes = fileManager.attributesOfItemAtPathError(path);
        if (attributes) {
            return attributes.objectForKey('NSFileSize');
        }
        else {
            return 0;
        }
    }
    getParent(path, onError) {
        try {
            const fileManager = NSFileManager.defaultManager;
            const nsString = NSString.stringWithString(path);
            const parentPath = nsString.stringByDeletingLastPathComponent;
            const name = fileManager.displayNameAtPath(parentPath);
            return {
                path: parentPath.toString(),
                name: name,
            };
        }
        catch (exception) {
            if (onError) {
                onError(exception);
            }
            return undefined;
        }
    }
    getFile(path, onError) {
        try {
            const fileManager = NSFileManager.defaultManager;
            const exists = fileManager.fileExistsAtPath(path);
            if (!exists) {
                const parentPath = this.getParent(path, onError).path;
                if (!fileManager.createDirectoryAtPathWithIntermediateDirectoriesAttributesError(parentPath, true, null) || !fileManager.createFileAtPathContentsAttributes(path, null, null)) {
                    if (onError) {
                        onError(new Error("Failed to create file at path '" + path + "'"));
                    }
                    return undefined;
                }
            }
            const fileName = fileManager.displayNameAtPath(path);
            return {
                path: path,
                name: fileName,
                extension: this.getFileExtension(path),
            };
        }
        catch (exception) {
            if (onError) {
                onError(exception);
            }
            return undefined;
        }
    }
    getFolder(path, onError) {
        try {
            const fileManager = NSFileManager.defaultManager;
            const exists = this.folderExists(path);
            if (!exists) {
                try {
                    fileManager.createDirectoryAtPathWithIntermediateDirectoriesAttributesError(path, true, null);
                }
                catch (ex) {
                    if (onError) {
                        onError(new Error("Failed to create folder at path '" + path + "': " + ex));
                    }
                    return undefined;
                }
            }
            const dirName = fileManager.displayNameAtPath(path);
            return {
                path: path,
                name: dirName,
            };
        }
        catch (ex) {
            if (onError) {
                onError(new Error("Failed to create folder at path '" + path + "'"));
            }
            return undefined;
        }
    }
    getExistingFolder(path, onError) {
        try {
            const fileManager = NSFileManager.defaultManager;
            const exists = this.folderExists(path);
            if (exists) {
                const dirName = fileManager.displayNameAtPath(path);
                return {
                    path: path,
                    name: dirName,
                };
            }
            return undefined;
        }
        catch (ex) {
            if (onError) {
                onError(new Error("Failed to get folder at path '" + path + "'"));
            }
            return undefined;
        }
    }
    eachEntity(path, onEntity, onError) {
        if (!onEntity) {
            return;
        }
        this.enumEntities(path, onEntity, onError);
    }
    getEntities(path, onError) {
        const fileInfos = new Array();
        const onEntity = function (entity) {
            fileInfos.push(entity);
            return true;
        };
        let errorOccurred;
        const localError = function (error) {
            if (onError) {
                onError(error);
            }
            errorOccurred = true;
        };
        this.enumEntities(path, onEntity, localError);
        if (!errorOccurred) {
            return fileInfos;
        }
        return null;
    }
    fileExists(path) {
        const result = this.exists(path);
        return result.exists;
    }
    folderExists(path) {
        const result = this.exists(path);
        return result.exists && result.isDirectory;
    }
    exists(path) {
        const fileManager = NSFileManager.defaultManager;
        const isDirectory = new interop.Reference(interop.types.bool, false);
        const exists = fileManager.fileExistsAtPathIsDirectory(path, isDirectory);
        return { exists: exists, isDirectory: isDirectory.value };
    }
    concatPath(left, right) {
        return NSString.pathWithComponents([left, right]).toString();
    }
    deleteFile(path, onError) {
        this.deleteEntity(path, onError);
    }
    deleteFolder(path, onError) {
        this.deleteEntity(path, onError);
    }
    emptyFolder(path, onError) {
        const fileManager = NSFileManager.defaultManager;
        const entities = this.getEntities(path, onError);
        if (!entities) {
            return;
        }
        for (let i = 0; i < entities.length; i++) {
            try {
                fileManager.removeItemAtPathError(entities[i].path);
            }
            catch (ex) {
                if (onError) {
                    onError(new Error("Failed to empty folder '" + path + "': " + ex));
                }
                return;
            }
        }
    }
    rename(path, newPath, onError) {
        const fileManager = NSFileManager.defaultManager;
        try {
            fileManager.moveItemAtPathToPathError(path, newPath);
        }
        catch (ex) {
            if (onError) {
                onError(new Error("Failed to rename '" + path + "' to '" + newPath + "': " + ex));
            }
        }
    }
    getLogicalRootPath() {
        const mainBundlePath = NSBundle.mainBundle.bundlePath;
        const resolvedPath = NSString.stringWithString(mainBundlePath).stringByResolvingSymlinksInPath;
        return resolvedPath;
    }
    getDocumentsFolderPath() {
        return this.getKnownPath(9 /* DocumentDirectory */);
    }
    getTempFolderPath() {
        return this.getKnownPath(13 /* CachesDirectory */);
    }
    getCurrentAppPath() {
        return iOSNativeHelper.getCurrentAppPath();
    }
    readTextAsync(path, encoding) {
        const actualEncoding = encoding || textEncoding.UTF_8;
        return new Promise((resolve, reject) => {
            try {
                NSString.stringWithContentsOfFileEncodingCompletion(path, actualEncoding, (result, error) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(result.toString());
                    }
                });
            }
            catch (ex) {
                reject(new Error("Failed to read file at path '" + path + "': " + ex));
            }
        });
    }
    readTextSync(path, onError, encoding) {
        const actualEncoding = encoding || textEncoding.UTF_8;
        try {
            const nsString = NSString.stringWithContentsOfFileEncodingError(path, actualEncoding);
            return nsString.toString();
        }
        catch (ex) {
            if (onError) {
                onError(new Error("Failed to read file at path '" + path + "': " + ex));
            }
        }
    }
    readAsync(path) {
        return new Promise((resolve, reject) => {
            try {
                NSData.dataWithContentsOfFileCompletion(path, resolve);
            }
            catch (ex) {
                reject(new Error("Failed to read file at path '" + path + "': " + ex));
            }
        });
    }
    readSync(path, onError) {
        try {
            return NSData.dataWithContentsOfFile(path);
        }
        catch (ex) {
            if (onError) {
                onError(new Error("Failed to read file at path '" + path + "': " + ex));
            }
        }
    }
    writeTextAsync(path, content, encoding) {
        const nsString = NSString.stringWithString(content);
        const actualEncoding = encoding || textEncoding.UTF_8;
        return new Promise((resolve, reject) => {
            try {
                nsString.writeToFileAtomicallyEncodingCompletion(path, true, actualEncoding, (error) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve();
                    }
                });
            }
            catch (ex) {
                reject(new Error("Failed to write file at path '" + path + "': " + ex));
            }
        });
    }
    writeTextSync(path, content, onError, encoding) {
        const nsString = NSString.stringWithString(content);
        const actualEncoding = encoding || textEncoding.UTF_8;
        // TODO: verify the useAuxiliaryFile parameter should be false
        try {
            nsString.writeToFileAtomicallyEncodingError(path, false, actualEncoding);
        }
        catch (ex) {
            if (onError) {
                onError(new Error("Failed to write to file '" + path + "': " + ex));
            }
        }
    }
    writeAsync(path, content) {
        return new Promise((resolve, reject) => {
            try {
                content.writeToFileAtomicallyCompletion(path, true, () => {
                    resolve();
                });
            }
            catch (ex) {
                reject(new Error("Failed to write file at path '" + path + "': " + ex));
            }
        });
    }
    writeSync(path, content, onError) {
        try {
            content.writeToFileAtomically(path, true);
        }
        catch (ex) {
            if (onError) {
                onError(new Error("Failed to write to file '" + path + "': " + ex));
            }
        }
    }
    getKnownPath(folderType) {
        const fileManager = NSFileManager.defaultManager;
        const paths = fileManager.URLsForDirectoryInDomains(folderType, 1 /* UserDomainMask */);
        const url = paths.objectAtIndex(0);
        return url.path;
    }
    // TODO: This method is the same as in the iOS implementation.
    // Make it in a separate file / module so it can be reused from both implementations.
    getFileExtension(path) {
        // TODO [For Panata]: The definitions currently specify "any" as a return value of this method
        //const nsString = Foundation.NSString.stringWithString(path);
        //const extension = nsString.pathExtension();
        //if (extension && extension.length > 0) {
        //    extension = extension.concat(".", extension);
        //}
        //return extension;
        const dotIndex = path.lastIndexOf('.');
        if (dotIndex && dotIndex >= 0 && dotIndex < path.length) {
            return path.substring(dotIndex);
        }
        return '';
    }
    deleteEntity(path, onError) {
        const fileManager = NSFileManager.defaultManager;
        try {
            fileManager.removeItemAtPathError(path);
        }
        catch (ex) {
            if (onError) {
                onError(new Error("Failed to delete file at path '" + path + "': " + ex));
            }
        }
    }
    enumEntities(path, callback, onError) {
        try {
            const fileManager = NSFileManager.defaultManager;
            let files;
            try {
                files = fileManager.contentsOfDirectoryAtPathError(path);
            }
            catch (ex) {
                if (onError) {
                    onError(new Error("Failed to enum files for folder '" + path + "': " + ex));
                }
                return;
            }
            for (let i = 0; i < files.count; i++) {
                const file = files.objectAtIndex(i);
                const info = {
                    path: this.concatPath(path, file),
                    name: file,
                    extension: '',
                };
                if (!this.folderExists(this.joinPath(path, file))) {
                    info.extension = this.getFileExtension(info.path);
                }
                const retVal = callback(info);
                if (retVal === false) {
                    // the callback returned false meaning we should stop the iteration
                    break;
                }
            }
        }
        catch (ex) {
            if (onError) {
                onError(ex);
            }
        }
    }
    getPathSeparator() {
        return '/';
    }
    normalizePath(path) {
        const nsString = NSString.stringWithString(path);
        const normalized = nsString.stringByStandardizingPath;
        return normalized;
    }
    joinPath(left, right) {
        const nsString = NSString.stringWithString(left);
        return nsString.stringByAppendingPathComponent(right);
    }
    joinPaths(paths) {
        return iOSNativeHelper.joinPaths(...paths);
    }
}
//# sourceMappingURL=file-system-access.ios.js.map