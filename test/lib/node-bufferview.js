"use strict";
module.exports = BufferView;

/**
 * Constructs a new BufferView.
 * @exports BufferView
 * @class An optimized DataView-compatible BufferView for node Buffers.
 * @param {!Buffer} buffer An existing Buffer to use as the storage for the new BufferView object.
 * @param {number=} byteOffset The offset, in bytes, to the first byte in the specified buffer for the new view to
 *  reference. If not specified, the view of the buffer will start with the first byte.
 * @param {number=} byteLength The number of elements in the byte array. If unspecified, length of the view will match
 *  the buffer's length.
 * @constructor
 * @extends DataView
 */
function BufferView(buffer, byteOffset, byteLength) {
    if (typeof byteOffset === "undefined") byteOffset = 0;
    if (typeof byteLength === "undefined") byteLength = buffer.length;
    this._buffer = byteOffset === 0 && byteLength === buffer.length
        ? buffer
        : buffer.slice(byteOffset, byteLength);

    this.byteOffset = byteOffset;
    this.byteLength = byteLength;
}

/**
 * Creates a BufferView if the argument is a Buffer and a DataView otherwise.
 * @param {!(Buffer|ArrayBuffer)} buffer An existing Buffer or ArrayBuffer to use as the storage for the new BufferView
 *  respectively DataView object.
 * @param {number=} byteOffset The offset, in bytes, to the first byte in the specified buffer for the new view to
 *  reference. If not specified, the view of the buffer will start with the first byte.
 * @param {number=} byteLength The number of elements in the byte array. If unspecified, length of the view will match
 *  the buffer's length.
 * @returns {!(BufferView|DataView)}} A BufferView for a Buffer or a DataView otherwise
 * @expose
 */
BufferView.create = function(buffer, byteOffset, byteLength) {
    return Buffer.isBuffer(buffer)
        ? new BufferView(buffer, byteOffset, byteLength)
        : new DataView(buffer, byteOffset, byteLength);
};

/**
 * Tests if the specified view is a BufferView wrapping a Buffer.
 * @param {*} view View to test
 * @returns {boolean} `true` if it is a BufferView, otherwise `false`
 * @expose
 */
BufferView.isBufferView = function(view) {
    return view && view instanceof BufferView;
};

/**
 * Tests if the specified view is a DataView wrapping an ArrayBuffer.
 * @param {*} view View to test
 * @returns {boolean} `true` if it is a DataView and not a BufferView, otherwise `false`
 * @expose
 */
BufferView.isDataView = function(view) {
    return view && view instanceof DataView && !(view instanceof BufferView);
};

// Extend DataView
// BufferView.prototype = Object.create(DataView.prototype);
Object.defineProperty(BufferView.prototype, "buffer", {
    get: function() { return this._buffer; }
});

/**
 * Gets an unsigned 8-bit integer at the specified byte offset from the start of the view.
 * @param {number} offset The offset, in byte, from the start of the view where to read the data.
 * @returns {number}
 * @expose
 */
BufferView.prototype.getUint8 = function(offset) {
    return this._buffer.readUInt8(offset);
};

/**
 * Sets an unsigned 8-bit integer at the specified byte offset from the start of the view.
 * @param {number} offset The offset, in byte, from the start of the view where to write the data.
 * @param {number} value The value to write
 * @expose
 */
BufferView.prototype.setUint8 = function(offset, value) {
    this._buffer.writeUInt8(value & 0xff, offset);
};

/**
 * Gets a signed 8-bit integer at the specified byte offset from the start of the view.
 * @param {number} offset The offset, in byte, from the start of the view where to read the data.
 * @returns {number}
 * @expose
 */
BufferView.prototype.getInt8 = function(offset) {
    return this._buffer.readInt8(offset);
};

/**
 * Sets a signed 8-bit integer at the specified byte offset from the start of the view.
 * @param {number} offset The offset, in byte, from the start of the view where to write the data.
 * @param {value} value The value to write
 * @expose
 */
BufferView.prototype.setInt8 = function(offset, value) {
    this._buffer.writeInt8(value << 24 >> 24, offset);
};

/**
 * Gets an unsigned 16-bit integer at the specified byte offset from the start of the view.
 * @param {number} offset The offset, in byte, from the start of the view where to read the data.
 * @param {boolean=} le Indicates whether the 16-bit int is stored in little- or big-endian format. If false or
 *  undefined, a big-endian value is read.
 * @returns {number}
 * @expose
 */
BufferView.prototype.getUint16 = function(offset, le) {
    return le
        ? this._buffer.readUInt16LE(offset)
        : this._buffer.readUInt16BE(offset);
};

/**
 * Sets an unsigned 16-bit integer at the specified byte offset from the start of the view.
 * @param {number} offset The offset, in byte, from the start of the view where to write the data.
 * @param {number} value The value to write
 * @param {boolean=} le Indicates whether the 16-bit int is stored in little- or big-endian format. If false or
 *  undefined, a big-endian value is written.
 * @expose
 */
BufferView.prototype.setUint16 = function(offset, value, le) {
    if (le) this._buffer.writeUInt16LE(value & 0xffff, offset);
    else this._buffer.writeUInt16BE(value & 0xffff, offset);
};

/**
 * Gets a signed 16-bit integer at the specified byte offset from the start of the view.
 * @param {number} offset The offset, in byte, from the start of the view where to read the data.
 * @param {boolean=} le Indicates whether the 16-bit int is stored in little- or big-endian format. If false or
 *  undefined, a big-endian value is read.
 * @returns {number}
 * @expose
 */
BufferView.prototype.getInt16 = function(offset, le) {
    return le
        ? this._buffer.readInt16LE(offset)
        : this._buffer.readInt16BE(offset);
};

/**
 * Sets a signed 16-bit integer at the specified byte offset from the start of the view.
 * @param {number} offset The offset, in byte, from the start of the view where to write the data.
 * @param {number} value The value to write
 * @param {boolean=} le Indicates whether the 16-bit int is stored in little- or big-endian format. If false or
 *  undefined, a big-endian value is written.
 * @expose
 */
BufferView.prototype.setInt16 = function(offset, value, le) {
    if (le) this._buffer.writeInt16LE(value << 16 >> 16, offset);
    else this._buffer.writeInt16BE(value << 16 >> 16, offset);
};

/**
 * Gets an unsigned 32-bit integer at the specified byte offset from the start of the view.
 * @param {number} offset The offset, in byte, from the start of the view where to read the data.
 * @param {boolean=} le Indicates whether the 32-bit int is stored in little- or big-endian format. If false or
 *  undefined, a big-endian value is read.
 * @returns {number}
 * @expose
 */
BufferView.prototype.getUint32 = function(offset, le) {
    return le
        ? this._buffer.readUInt32LE(offset)
        : this._buffer.readUInt32BE(offset);
};

/**
 * Sets an unsigned 32-bit integer at the specified byte offset from the start of the view.
 * @param {number} offset The offset, in byte, from the start of the view where to write the data.
 * @param {number} value The value to write
 * @param {boolean=} le Indicates whether the 32-bit int is stored in little- or big-endian format. If false or
 *  undefined, a big-endian value is written.
 * @expose
 */
BufferView.prototype.setUint32 = function(offset, value, le) {
    if (le) this._buffer.writeUInt32LE(value >>> 0, offset);
    else this._buffer.writeUInt32BE(value >>> 0, offset);
};

/**
 * Gets a signed 32-bit integer at the specified byte offset from the start of the view.
 * @param {number} offset The offset, in byte, from the start of the view where to read the data.
 * @param {boolean=} le Indicates whether the 32-bit int is stored in little- or big-endian format. If false or
 *  undefined, a big-endian value is read.
 * @returns {number}
 * @expose
 */
BufferView.prototype.getInt32 = function(offset, le) {
    return le
        ? this._buffer.readInt32LE(offset)
        : this._buffer.readInt32BE(offset);
};

/**
 * Sets a signed 32-bit integer at the specified byte offset from the start of the view.
 * @param {number} offset The offset, in byte, from the start of the view where to write the data.
 * @param {number} value The value to write
 * @param {boolean=} le Indicates whether the 32-bit int is stored in little- or big-endian format. If false or
 *  undefined, a big-endian value is written.
 * @expose
 */
BufferView.prototype.setInt32 = function(offset, value, le) {
    if (le) this._buffer.writeInt32LE(value | 0, offset);
    else this._buffer.writeInt32BE(value | 0, offset);
};

/**
 * Gets a 32-bit float at the specified byte offset from the start of the view.
 * @param {number} offset The offset, in byte, from the start of the view where to read the data.
 * @param {boolean=} le Indicates whether the 32-bit float is stored in little- or big-endian format. If false or
 *  undefined, a big-endian value is read.
 * @returns {number}
 * @expose
 */
BufferView.prototype.getFloat32 = function(offset, le) {
    return le
        ? this._buffer.readFloatLE(offset)
        : this._buffer.readFloatBE(offset);
};

/**
 * Sets a 32-bit float at the specified byte offset from the start of the view.
 * @param {number} offset The offset, in byte, from the start of the view where to read the data.
 * @param {number} value The value to write
 * @param {boolean=} le Indicates whether the 32-bit float is stored in little- or big-endian format. If false or
 *  undefined, a big-endian value is written.
 * @expose
 */
BufferView.prototype.setFloat32 = function(offset, value, le) {
    if (le) this._buffer.writeFloatLE(value, offset);
    else this._buffer.writeFloatBE(value, offset);
};

/**
 * Gets a 64-bit float at the specified byte offset from the start of the view.
 * @param {number} offset The offset, in byte, from the start of the view where to read the data.
 * @param {boolean=} le Indicates whether the 64-bit float is stored in little- or big-endian format. If false or
 *  undefined, a big-endian value is read.
 * @returns {number}
 * @expose
 */
BufferView.prototype.getFloat64 = function(offset, le) {
    return le
        ? this._buffer.readDoubleLE(offset)
        : this._buffer.readDoubleBE(offset);
};

/**
 * Sets a 64-bit float at the specified byte offset from the start of the view.
 * @param {number} offset The offset, in byte, from the start of the view where to read the data.
 * @param {number} value The value to write
 * @param {boolean=} le Indicates whether the 64-bit float is stored in little- or big-endian format. If false or
 *  undefined, a big-endian value is written.
 * @expose
 */
BufferView.prototype.setFloat64 = function(offset, value, le) {
    if (le) this._buffer.writeDoubleLE(value, offset);
    else this._buffer.writeDoubleBE(value, offset);
};
