import { Observable } from '../../../data/observable';
import { Trace } from '../../../trace';
export class Style extends Observable {
    constructor(ownerView) {
        super();
        this.unscopedCssVariables = new Map();
        this.scopedCssVariables = new Map();
        // HACK: Could not find better way for cross platform WeakRef type checking.
        if (ownerView.constructor.toString().indexOf('[native code]') !== -1) {
            this.viewRef = ownerView;
        }
        else {
            this.viewRef = new WeakRef(ownerView);
        }
    }
    setScopedCssVariable(varName, value) {
        this.scopedCssVariables.set(varName, value);
    }
    setUnscopedCssVariable(varName, value) {
        this.unscopedCssVariables.set(varName, value);
    }
    getCssVariable(varName) {
        const view = this.view;
        if (!view) {
            return null;
        }
        if (this.unscopedCssVariables.has(varName)) {
            return this.unscopedCssVariables.get(varName);
        }
        if (this.scopedCssVariables.has(varName)) {
            return this.scopedCssVariables.get(varName);
        }
        if (!view.parent || !view.parent.style) {
            return null;
        }
        return view.parent.style.getCssVariable(varName);
    }
    resetScopedCssVariables() {
        this.scopedCssVariables.clear();
    }
    resetUnscopedCssVariables() {
        this.unscopedCssVariables.clear();
    }
    toString() {
        const view = this.viewRef.get();
        if (!view) {
            Trace.write(`toString() of Style cannot execute correctly because ".viewRef" is cleared`, Trace.categories.Animation, Trace.messageType.warn);
            return '';
        }
        return `${view}.style`;
    }
    get view() {
        if (this.viewRef) {
            return this.viewRef.get();
        }
        return undefined;
    }
}
Style.prototype.PropertyBag = class {
};
//# sourceMappingURL=index.js.map