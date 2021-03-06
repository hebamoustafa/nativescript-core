export declare class FileSystemAccess {
    getLastModified(path: string): Date;
    getFileSize(path: string): number;
    getParent(path: string, onError?: (error: any) => any): {
        path: string;
        name: string;
    };
    getFile(path: string, onError?: (error: any) => any): {
        path: string;
        name: string;
        extension: string;
    };
    getFolder(path: string, onError?: (error: any) => any): {
        path: string;
        name: string;
    };
    getExistingFolder(path: string, onError?: (error: any) => any): {
        path: string;
        name: string;
    };
    eachEntity(path: string, onEntity: (file: {
        path: string;
        name: string;
        extension: string;
    }) => any, onError?: (error: any) => any): void;
    getEntities(path: string, onError?: (error: any) => any): Array<{
        path: string;
        name: string;
        extension: string;
    }>;
    fileExists(path: string): boolean;
    folderExists(path: string): boolean;
    private exists;
    concatPath(left: string, right: string): string;
    deleteFile(path: string, onError?: (error: any) => any): void;
    deleteFolder(path: string, onError?: (error: any) => any): void;
    emptyFolder(path: string, onError?: (error: any) => any): void;
    rename(path: string, newPath: string, onError?: (error: any) => any): void;
    getLogicalRootPath(): string;
    getDocumentsFolderPath(): string;
    getTempFolderPath(): string;
    getCurrentAppPath(): string;
    readText: any;
    readTextAsync(path: string, encoding?: any): Promise<string>;
    readTextSync(path: string, onError?: (error: any) => any, encoding?: any): string;
    read: any;
    readAsync(path: string): Promise<NSData>;
    readSync(path: string, onError?: (error: any) => any): NSData;
    writeText: any;
    writeTextAsync(path: string, content: string, encoding?: any): Promise<void>;
    writeTextSync(path: string, content: string, onError?: (error: any) => any, encoding?: any): void;
    write: any;
    writeAsync(path: string, content: NSData): Promise<void>;
    writeSync(path: string, content: NSData, onError?: (error: any) => any): void;
    private getKnownPath;
    getFileExtension(path: string): string;
    private deleteEntity;
    private enumEntities;
    getPathSeparator(): string;
    normalizePath(path: string): string;
    joinPath(left: string, right: string): string;
    joinPaths(paths: string[]): string;
}
