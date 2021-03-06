import { View } from '../core/view';
import { LayoutBase } from '../layouts/layout-base';
/**
 * Proxy view container that adds all its native children directly to the parent.
 * To be used as a logical grouping container of views.
 */
export declare class ProxyViewContainer extends LayoutBase {
    private proxiedLayoutProperties;
    constructor();
    get ios(): any;
    get android(): any;
    get isLayoutRequested(): boolean;
    createNativeView(): any;
    _getNativeViewsCount(): number;
    _eachLayoutView(callback: (View: any) => void): void;
    _addViewToNativeVisualTree(child: View, atIndex?: number): boolean;
    _removeViewFromNativeVisualTree(child: View): void;
    _registerLayoutChild(child: View): void;
    _unregisterLayoutChild(child: View): void;
    _parentChanged(oldParent: View): void;
    /**
     * Layout property changed, proxy the new value to the child view(s)
     */
    _changedLayoutProperty(propName: string, value: string): void;
    /**
     * Apply the layout property to the child view.
     */
    private _applyLayoutPropertyToChild;
}
