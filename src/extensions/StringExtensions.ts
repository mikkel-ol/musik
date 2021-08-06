/* eslint-disable no-extend-native */
declare global {
    interface String {
        shorten(length: number): string;
    }
}

String.prototype.shorten = function(length: number): string {
    return this.length > length - 3 ? `${this.slice(0, length)}...` : this.toString();
};

export {};
