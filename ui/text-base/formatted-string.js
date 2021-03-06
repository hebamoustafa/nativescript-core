import { Span } from './span';
import { Observable } from '../../data/observable';
import { ObservableArray } from '../../data/observable-array';
import { ViewBase } from '../core/view-base';
export class FormattedString extends ViewBase {
    constructor() {
        super();
        this._spans = new ObservableArray();
        this._spans.addEventListener(ObservableArray.changeEvent, this.onSpansCollectionChanged, this);
    }
    get fontFamily() {
        return this.style.fontFamily;
    }
    set fontFamily(value) {
        this.style.fontFamily = value;
    }
    get fontSize() {
        return this.style.fontSize;
    }
    set fontSize(value) {
        this.style.fontSize = value;
    }
    get fontStyle() {
        return this.style.fontStyle;
    }
    set fontStyle(value) {
        this.style.fontStyle = value;
    }
    get fontWeight() {
        return this.style.fontWeight;
    }
    set fontWeight(value) {
        this.style.fontWeight = value;
    }
    get textDecoration() {
        return this.style.textDecoration;
    }
    set textDecoration(value) {
        this.style.textDecoration = value;
    }
    get color() {
        return this.style.color;
    }
    set color(value) {
        this.style.color = value;
    }
    get backgroundColor() {
        return this.style.backgroundColor;
    }
    set backgroundColor(value) {
        this.style.backgroundColor = value;
    }
    get spans() {
        if (!this._spans) {
            this._spans = new ObservableArray();
        }
        return this._spans;
    }
    toString() {
        let result = '';
        for (let i = 0, length = this._spans.length; i < length; i++) {
            result += this._spans.getItem(i).text;
        }
        return result;
    }
    _addArrayFromBuilder(name, value) {
        if (name === 'spans') {
            this.spans.push(value);
        }
    }
    _addChildFromBuilder(name, value) {
        if (value instanceof Span) {
            this.spans.push(value);
        }
    }
    onSpansCollectionChanged(eventData) {
        if (eventData.addedCount > 0) {
            for (let i = 0; i < eventData.addedCount; i++) {
                const span = eventData.object.getItem(eventData.index + i);
                // First add to logical tree so that inherited properties are set.
                this._addView(span);
                // Then attach handlers - we skip the first notification because
                // we raise change for the whole instance.
                this.addPropertyChangeHandler(span);
            }
        }
        if (eventData.removed && eventData.removed.length > 0) {
            for (let p = 0; p < eventData.removed.length; p++) {
                const span = eventData.removed[p];
                // First remove handlers so that we don't listen for changes
                // on inherited properties.
                this.removePropertyChangeHandler(span);
                // Then remove the element.
                this._removeView(span);
            }
        }
        this.notifyPropertyChange('.', this);
    }
    addPropertyChangeHandler(span) {
        const style = span.style;
        span.on(Observable.propertyChangeEvent, this.onPropertyChange, this);
        style.on('fontFamilyChange', this.onPropertyChange, this);
        style.on('fontSizeChange', this.onPropertyChange, this);
        style.on('fontStyleChange', this.onPropertyChange, this);
        style.on('fontWeightChange', this.onPropertyChange, this);
        style.on('textDecorationChange', this.onPropertyChange, this);
        style.on('colorChange', this.onPropertyChange, this);
        style.on('backgroundColorChange', this.onPropertyChange, this);
    }
    removePropertyChangeHandler(span) {
        const style = span.style;
        span.off(Observable.propertyChangeEvent, this.onPropertyChange, this);
        style.off('fontFamilyChange', this.onPropertyChange, this);
        style.off('fontSizeChange', this.onPropertyChange, this);
        style.off('fontStyleChange', this.onPropertyChange, this);
        style.off('fontWeightChange', this.onPropertyChange, this);
        style.off('textDecorationChange', this.onPropertyChange, this);
        style.off('colorChange', this.onPropertyChange, this);
        style.off('backgroundColorChange', this.onPropertyChange, this);
    }
    onPropertyChange(data) {
        this.notifyPropertyChange(data.propertyName, this);
    }
    eachChild(callback) {
        this.spans.forEach((v, i, arr) => callback(v));
    }
}
//# sourceMappingURL=formatted-string.js.map