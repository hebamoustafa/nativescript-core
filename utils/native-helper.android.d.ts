export declare namespace ad {
    function getApplicationContext(): globalAndroid.content.Context;
    function getApplication(): globalAndroid.app.Application;
    function getResources(): globalAndroid.content.res.Resources;
    function getInputMethodManager(): android.view.inputmethod.InputMethodManager;
    function showSoftInput(nativeView: android.view.View): void;
    function dismissSoftInput(nativeView?: android.view.View): void;
    namespace collections {
        function stringArrayToStringSet(str: string[]): java.util.HashSet<string>;
        function stringSetToStringArray(stringSet: any): string[];
    }
    namespace resources {
        function getDrawableId(name: any): number;
        function getStringId(name: any): number;
        function getId(name: string): number;
        function getPalleteColor(name: string, context: android.content.Context): number;
        function getPaletteColor(name: string, context: android.content.Context): number;
    }
    function isRealDevice(): boolean;
}
export declare const iOSNativeHelper = 0;
