"use strict";

var BufferDataView = function(buffer, byteOffset, byteLength) {
    this.buffer = buffer;
    this.byteOffset = byteOffset || 0;
    this.byteLength = byteLength || buffer.byteLength;
};

BufferDataView.prototype.setUint8 = function(offset, value) {
    this.buffer.writeUInt8(value, offset);
};

BufferDataView.prototype.getUint8 = function(offset) {
    return this.buffer.readUInt8(offset);
};

BufferDataView.prototype.setInt8 = function(offset, value) {
    this.buffer.writeInt8(value, offset);
};

BufferDataView.prototype.getInt8 = function(offset) {
    return this.buffer.readInt8(offset);
};

BufferDataView.prototype.setUint16 = function(offset, value) {
    this.buffer.writeUInt16BE(value, offset);
};

BufferDataView.prototype.getUint16 = function(offset) {
    return this.buffer.readUInt16BE(offset);
};

BufferDataView.prototype.setInt16 = function(offset, value) {
    this.buffer.writeInt16BE(value, offset);
};

BufferDataView.prototype.getInt16 = function(offset) {
    return this.buffer.readInt16BE(offset);
};

BufferDataView.prototype.setUint32 = function(offset, value) {
    this.buffer.writeUInt32BE(value, offset);
};

BufferDataView.prototype.getUint32 = function(offset) {
    return this.buffer.readUInt32BE(offset);
};

BufferDataView.prototype.setInt32 = function(offset, value) {
    this.buffer.writeInt32BE(value, offset);
};

BufferDataView.prototype.getInt32 = function(offset) {
    return this.buffer.readInt32BE(offset);
};

BufferDataView.prototype.setFloat32 = function(offset, value) {
    this.buffer.writeFloatBE(value, offset);
};

BufferDataView.prototype.getFloat32 = function(offset) {
    return this.buffer.readFloatBE(offset);
};

BufferDataView.prototype.setFloat64 = function(offset, value) {
    this.buffer.writeDoubleBE(value, offset);
};

BufferDataView.prototype.getFloat64 = function(offset) {
    return this.buffer.readDoubleBE(offset);
};

if (typeof module != "undefined") {
    module.exports = BufferDataView;
}
