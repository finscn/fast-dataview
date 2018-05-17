"use strict";

var FastDataView;

(function(exports) {

    var cacheBuffer = new ArrayBuffer(8);
    var uint8Array = new Uint8Array(cacheBuffer);
    var int8Array = new Int8Array(cacheBuffer);
    var uint16Array = new Uint16Array(cacheBuffer);
    var int16Array = new Int16Array(cacheBuffer);
    var uint32Array = new Uint32Array(cacheBuffer);
    var int32Array = new Int32Array(cacheBuffer);
    var float32Array = new Float32Array(cacheBuffer);
    var float64Array = new Float64Array(cacheBuffer);

    FastDataView = function(buffer, byteOffset, byteLength) {
        this.initCacheArray();
        if (buffer) {
            this.setBuffer(buffer, byteOffset, byteLength);
        } else {
            this.buffer = null;
            this.byteOffset = 0;
            this.byteLength = 0;
            this.byteArray = null;
            this.cursor = 0;
        }
    };

    FastDataView.prototype.initCacheArray = function() {
        this.uint8Array = uint8Array;
        this.int8Array = int8Array;
        // this.uint16Array = uint16Array;
        this.int16Array = int16Array;
        // this.uint32Array = uint32Array;
        this.int32Array = int32Array;
        this.float32Array = float32Array;
        this.float64Array = float64Array;
    };

    FastDataView.prototype.setBuffer = function(buffer, byteOffset, byteLength) {
        this.buffer = buffer;
        this.byteOffset = byteOffset || 0;
        this.byteLength = byteLength || buffer.byteLength;

        // If buffer is an instance of Node Buffer , byteArray = buffer;
        this.byteArray = buffer.buffer ? buffer : new Uint8Array(buffer);

        this.cursor = this.byteOffset;
    };

    FastDataView.prototype.slice = function(begin, end) {
        return this.byteArray.slice(begin + this.byteOffset, end + this.byteOffset);
    };

    FastDataView.prototype.getRest = function() {
        return this.byteArray.slice(this.cursor, this.byteLength);
    };

    FastDataView.prototype.setUint8 = function(offset, value) {
        this.byteArray[offset + this.byteOffset] = value;
    };

    FastDataView.prototype.getUint8 = function(offset) {
        return this.byteArray[offset + this.byteOffset];
    };

    FastDataView.prototype.pushUint8 = function(value) {
        this.byteArray[this.cursor++] = value;
    };

    FastDataView.prototype.nextUint8 = function() {
        return this.byteArray[this.cursor++];
    };

    FastDataView.prototype.setInt8 = function(offset, value) {
        this.byteArray[offset + this.byteOffset] = value;
    };

    FastDataView.prototype.getInt8 = function(offset) {
        // Use TypedArray
        this.uint8Array[0] = this.byteArray[offset + this.byteOffset];
        return this.int8Array[0];
    };

    FastDataView.prototype.pushInt8 = function(value) {
        this.byteArray[this.cursor++] = value;
    };

    FastDataView.prototype.nextInt8 = function() {
        // Use TypedArray
        this.uint8Array[0] = this.byteArray[this.cursor++];
        return this.int8Array[0];
    };

    FastDataView.prototype.setUint16 = function(offset, value) {
        offset += this.byteOffset;
        this.byteArray[offset] = value >>> 8;
        this.byteArray[offset + 1] = value;
    };

    FastDataView.prototype.getUint16 = function(offset) {
        offset += this.byteOffset;
        var a = this.byteArray[offset];
        var b = this.byteArray[offset + 1];
        return (a << 8) | b;
    };

    FastDataView.prototype.pushUint16 = function(value) {
        var offset = this.cursor;
        this.byteArray[offset] = value >>> 8;
        this.byteArray[offset + 1] = value;
        this.cursor += 2;
    };

    FastDataView.prototype.nextUint16 = function() {
        var offset = this.cursor;
        var a = this.byteArray[offset];
        var b = this.byteArray[offset + 1];
        this.cursor += 2;
        return (a << 8) | b;
    };

    FastDataView.prototype.setInt16 = function(offset, value) {
        offset += this.byteOffset;
        this.byteArray[offset] = value >>> 8;
        this.byteArray[offset + 1] = value;
    };

    FastDataView.prototype.getInt16 = function(offset) {
        // Use TypedArray
        offset += this.byteOffset;
        this.uint8Array[0] = this.byteArray[offset + 1];
        this.uint8Array[1] = this.byteArray[offset];
        return this.int16Array[0];
    };

    FastDataView.prototype.pushInt16 = function(value) {
        var offset = this.cursor;
        this.byteArray[offset] = value >>> 8;
        this.byteArray[offset + 1] = value;
        this.cursor += 2;
    };

    FastDataView.prototype.nextInt16 = function() {
        // Use TypedArray
        var offset = this.cursor;
        this.uint8Array[0] = this.byteArray[offset + 1];
        this.uint8Array[1] = this.byteArray[offset];
        this.cursor += 2;
        return this.int16Array[0];
    };

    FastDataView.prototype.setUint32 = function(offset, value) {
        offset += this.byteOffset;
        this.byteArray[offset] = value >>> 24;
        this.byteArray[offset + 1] = (value >>> 16);
        this.byteArray[offset + 2] = (value >>> 8);
        this.byteArray[offset + 3] = value;
    };

    FastDataView.prototype.getUint32 = function(offset) {
        offset += this.byteOffset;
        var a = this.byteArray[offset];
        var b = this.byteArray[offset + 1];
        var c = this.byteArray[offset + 2];
        var d = this.byteArray[offset + 3];
        return ((a << 24) >>> 0) + ((b << 16) | (c << 8) | (d));
    };

    FastDataView.prototype.pushUint32 = function(value) {
        var offset = this.cursor;
        this.byteArray[offset] = value >>> 24;
        this.byteArray[offset + 1] = (value >>> 16);
        this.byteArray[offset + 2] = (value >>> 8);
        this.byteArray[offset + 3] = value;
        this.cursor += 4;
    };

    FastDataView.prototype.nextUint32 = function() {
        var offset = this.cursor;
        var a = this.byteArray[offset];
        var b = this.byteArray[offset + 1];
        var c = this.byteArray[offset + 2];
        var d = this.byteArray[offset + 3];
        this.cursor += 4;
        return ((a << 24) >>> 0) + ((b << 16) | (c << 8) | (d));
    };

    FastDataView.prototype.setInt32 = function(offset, value) {
        offset += this.byteOffset;
        this.byteArray[offset] = value >>> 24;
        this.byteArray[offset + 1] = (value >>> 16);
        this.byteArray[offset + 2] = (value >>> 8);
        this.byteArray[offset + 3] = value;
    };

    FastDataView.prototype.getInt32 = function(offset) {
        // Use TypedArray
        offset += this.byteOffset;
        this.uint8Array[0] = this.byteArray[offset + 3];
        this.uint8Array[1] = this.byteArray[offset + 2];
        this.uint8Array[2] = this.byteArray[offset + 1];
        this.uint8Array[3] = this.byteArray[offset];
        return this.int32Array[0];
    };

    FastDataView.prototype.pushInt32 = function(value) {
        var offset = this.cursor;
        this.byteArray[offset] = value >>> 24;
        this.byteArray[offset + 1] = (value >>> 16);
        this.byteArray[offset + 2] = (value >>> 8);
        this.byteArray[offset + 3] = value;
        this.cursor += 4;
    };

    FastDataView.prototype.nextInt32 = function() {
        // Use TypedArray
        var offset = this.cursor;
        this.uint8Array[0] = this.byteArray[offset + 3];
        this.uint8Array[1] = this.byteArray[offset + 2];
        this.uint8Array[2] = this.byteArray[offset + 1];
        this.uint8Array[3] = this.byteArray[offset];
        this.cursor += 4;
        return this.int32Array[0];
    };

    FastDataView.prototype.setFloat32 = function(offset, value) {
        offset += this.byteOffset;
        this.float32Array[0] = value;
        this.byteArray[offset] = this.uint8Array[3];
        this.byteArray[offset + 1] = this.uint8Array[2];
        this.byteArray[offset + 2] = this.uint8Array[1];
        this.byteArray[offset + 3] = this.uint8Array[0];
    };

    FastDataView.prototype.getFloat32 = function(offset) {
        // Use TypedArray
        offset += this.byteOffset;
        this.uint8Array[0] = this.byteArray[offset + 3];
        this.uint8Array[1] = this.byteArray[offset + 2];
        this.uint8Array[2] = this.byteArray[offset + 1];
        this.uint8Array[3] = this.byteArray[offset];
        return this.float32Array[0];
    };

    FastDataView.prototype.pushFloat32 = function(value) {
        var offset = this.cursor;
        this.float32Array[0] = value;
        this.byteArray[offset] = this.uint8Array[3];
        this.byteArray[offset + 1] = this.uint8Array[2];
        this.byteArray[offset + 2] = this.uint8Array[1];
        this.byteArray[offset + 3] = this.uint8Array[0];
        this.cursor += 4;
    };

    FastDataView.prototype.nextFloat32 = function() {
        // Use TypedArray
        var offset = this.cursor;
        this.uint8Array[0] = this.byteArray[offset + 3];
        this.uint8Array[1] = this.byteArray[offset + 2];
        this.uint8Array[2] = this.byteArray[offset + 1];
        this.uint8Array[3] = this.byteArray[offset];
        this.cursor += 4;
        return this.float32Array[0];
    };

    FastDataView.prototype.setFloat64 = function(offset, value) {
        offset += this.byteOffset;
        this.float64Array[0] = value;
        this.byteArray[offset] = this.uint8Array[7];
        this.byteArray[offset + 1] = this.uint8Array[6];
        this.byteArray[offset + 2] = this.uint8Array[5];
        this.byteArray[offset + 3] = this.uint8Array[4];
        this.byteArray[offset + 4] = this.uint8Array[3];
        this.byteArray[offset + 5] = this.uint8Array[2];
        this.byteArray[offset + 6] = this.uint8Array[1];
        this.byteArray[offset + 7] = this.uint8Array[0];
    };

    FastDataView.prototype.getFloat64 = function(offset) {
        offset += this.byteOffset;
        // Use TypedArray
        this.uint8Array[0] = this.byteArray[offset + 7];
        this.uint8Array[1] = this.byteArray[offset + 6];
        this.uint8Array[2] = this.byteArray[offset + 5];
        this.uint8Array[3] = this.byteArray[offset + 4];
        this.uint8Array[4] = this.byteArray[offset + 3];
        this.uint8Array[5] = this.byteArray[offset + 2];
        this.uint8Array[6] = this.byteArray[offset + 1];
        this.uint8Array[7] = this.byteArray[offset];
        return this.float64Array[0];
    };

    FastDataView.prototype.pushFloat64 = function(value) {
        var offset = this.cursor;
        this.float64Array[0] = value;
        this.byteArray[offset] = this.uint8Array[7];
        this.byteArray[offset + 1] = this.uint8Array[6];
        this.byteArray[offset + 2] = this.uint8Array[5];
        this.byteArray[offset + 3] = this.uint8Array[4];
        this.byteArray[offset + 4] = this.uint8Array[3];
        this.byteArray[offset + 5] = this.uint8Array[2];
        this.byteArray[offset + 6] = this.uint8Array[1];
        this.byteArray[offset + 7] = this.uint8Array[0];
        this.cursor += 8;
    };

    FastDataView.prototype.nextFloat64 = function() {
        // Use TypedArray
        var offset = this.cursor;
        this.uint8Array[0] = this.byteArray[offset + 7];
        this.uint8Array[1] = this.byteArray[offset + 6];
        this.uint8Array[2] = this.byteArray[offset + 5];
        this.uint8Array[3] = this.byteArray[offset + 4];
        this.uint8Array[4] = this.byteArray[offset + 3];
        this.uint8Array[5] = this.byteArray[offset + 2];
        this.uint8Array[6] = this.byteArray[offset + 1];
        this.uint8Array[7] = this.byteArray[offset];
        this.cursor += 8;
        return this.float64Array[0];
    };

    if (exports) {
        exports.FastDataView = FastDataView;
    }

    if (typeof module !== "undefined") {
        module.exports = FastDataView;
    }

})(typeof window !== "undefined" ? window : null);
