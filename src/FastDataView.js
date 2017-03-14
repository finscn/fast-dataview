"use strict";

(function(exports) {

    var FastDataView = function(buffer, byteOffset, byteLength) {
        this.buffer = buffer;
        this.byteOffset = byteOffset || 0;
        this.byteLength = byteLength || buffer.byteLength;

        this.byteArray = new Uint8Array(buffer);
        // this.dataView = new DataView(buffer, byteOffset, byteLength);

        this.initCacheArray();
    };

    FastDataView.prototype.initCacheArray = function() {
        this.cacheBuffer = new ArrayBuffer(8);

        this.uint8Array = new Uint8Array(this.cacheBuffer);
        this.int8Array = new Int8Array(this.cacheBuffer);

        // this.uint16Array = new Uint16Array(this.cacheBuffer);
        this.int16Array = new Int16Array(this.cacheBuffer);

        // this.uint32Array = new Uint32Array(this.cacheBuffer);
        this.int32Array = new Int32Array(this.cacheBuffer);

        this.float32Array = new Float32Array(this.cacheBuffer);
        this.float64Array = new Float64Array(this.cacheBuffer);
    };

    FastDataView.prototype.setUint8 = function(offset, value) {
        this.byteArray[offset] = value;
    };

    FastDataView.prototype.getUint8 = function(offset) {
        return this.byteArray[offset];
    };

    FastDataView.prototype.setInt8 = function(offset, value) {
        this.byteArray[offset] = value;
    };

    FastDataView.prototype.getInt8 = function(offset) {
        this.uint8Array[0] = this.byteArray[offset];
        return this.int8Array[0];
    };

    FastDataView.prototype.setUint16 = function(offset, value) {
        this.byteArray[offset] = value >>> 8;
        this.byteArray[offset + 1] = value;
    };

    FastDataView.prototype.getUint16 = function(offset) {
        var a = this.byteArray[offset];
        var b = this.byteArray[offset + 1];
        return (a << 8) | b;
    };

    FastDataView.prototype.setInt16 = function(offset, value) {
        this.byteArray[offset] = value >>> 8;
        this.byteArray[offset + 1] = value;
    };

    FastDataView.prototype.getInt16 = function(offset) {
        this.uint8Array[0] = this.byteArray[offset + 1];
        this.uint8Array[1] = this.byteArray[offset];
        return this.int16Array[0];
    };

    FastDataView.prototype.setUint32 = function(offset, value) {
        // this.dataView.setUint32(offset, value);
        this.byteArray[offset] = value >>> 24;
        this.byteArray[offset + 1] = (value >>> 16);
        this.byteArray[offset + 2] = (value >>> 8);
        this.byteArray[offset + 3] = value;
    };

    FastDataView.prototype.getUint32 = function(offset) {
        // return this.dataView.getUint32(offset);
        var a = this.byteArray[offset];
        var b = this.byteArray[offset + 1];
        var c = this.byteArray[offset + 2];
        var d = this.byteArray[offset + 3];
        var value = (a << 24) | (b << 16) | (c << 8) | d;
        value = (value >>> 1) * 2 + (d & 1);
        return value;
    };

    FastDataView.prototype.setInt32 = function(offset, value) {
        this.byteArray[offset] = value >>> 24;
        this.byteArray[offset + 1] = (value >>> 16);
        this.byteArray[offset + 2] = (value >>> 8);
        this.byteArray[offset + 3] = value;
    };

    FastDataView.prototype.getInt32 = function(offset) {
        this.uint8Array[0] = this.byteArray[offset + 3];
        this.uint8Array[1] = this.byteArray[offset + 2];
        this.uint8Array[2] = this.byteArray[offset + 1];
        this.uint8Array[3] = this.byteArray[offset];
        return this.int32Array[0];
    };

    FastDataView.prototype.setFloat32 = function(offset, value) {
        this.float32Array[0] = value;
        this.byteArray[offset] = this.uint8Array[3];
        this.byteArray[offset + 1] = this.uint8Array[2];
        this.byteArray[offset + 2] = this.uint8Array[1];
        this.byteArray[offset + 3] = this.uint8Array[0];
    };

    FastDataView.prototype.getFloat32 = function(offset) {
        this.uint8Array[0] = this.byteArray[offset + 3];
        this.uint8Array[1] = this.byteArray[offset + 2];
        this.uint8Array[2] = this.byteArray[offset + 1];
        this.uint8Array[3] = this.byteArray[offset];
        return this.float32Array[0];
    };

    FastDataView.prototype.setFloat64 = function(offset, value) {
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

    if (exports) {
        exports.FastDataView = FastDataView;
    }

    if (typeof module != "undefined") {
        module.exports = FastDataView;
    }

})(typeof window !== "undefined" ? window : null);
