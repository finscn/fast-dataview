var FastDataView = require("../src/FastDataView");
var BufferDataView = require("../src/BufferDataView");

var testCount = 1000;

var bufferSize = 26 * 1024;

function testWrite(byteLength, fast) {
    var buffer = Buffer.alloc(byteLength);
    var DataViewClass = fast ? FastDataView : BufferDataView;
    var name = fast ? 'FastDataView' : 'BufferDataView';

    var view = new DataViewClass(buffer);
    console.time(name + ' wirte');
    for (var c = 0; c < testCount; c++) {
        for (var i = 0; i < byteLength;) {
            view.setUint8(i, 255);
            i += 1;
            view.setInt8(i, 127);
            i += 1;
            view.setUint16(i, 65535);
            i += 2;
            view.setInt16(i, 32767);
            i += 2;
            view.setUint32(i, 4294967295);
            i += 4;
            view.setInt32(i, 2147483647);
            i += 4;
            view.setFloat32(i, 1.625);
            i += 4;
            view.setFloat64(i, Math.E);
            i += 8;
        }
    }
    console.timeEnd(name + ' wirte');
    return buffer;
}

function testRead(buffer, fast) {
    var byteLength = buffer.byteLength;
    var DataViewClass = fast ? FastDataView : BufferDataView;
    var name = fast ? 'FastDataView' : 'BufferDataView';

    var view = new DataViewClass(buffer);
    console.time(name + ' read');
    for (var c = 0; c < testCount; c++) {
        for (var i = 0; i < byteLength;) {
            view.getUint8(i);
            i += 1;
            view.getInt8(i);
            i += 1;
            view.getUint16(i);
            i += 2;
            view.getInt16(i);
            i += 2;
            view.getUint32(i);
            i += 4;
            view.getInt32(i);
            i += 4;
            view.getFloat32(i);
            i += 4;
            view.getFloat64(i);
            i += 8;
        }
    }
    console.timeEnd(name + ' read');
    return buffer;
}

function toArrayBuffer(buf) {
    if (buf.byteOffset === 0 && buf.byteLength === buf.buffer.byteLength) {
        return buf.buffer;
    }

    return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

function verify(buffer1, buffer2) {
    // var byteLength = buffer1.byteLength;
    var byteLength = 26;

    var bytes1 = buffer1;
    var bytes2 = buffer2;

    for (var i = 0; i < byteLength; i++) {
        if (bytes1[i] !== bytes2[i]) {
            console.log("wirte FAILED", i);
            return;
        }
    }
    console.log("==== wirte OK. ====");

    var view1 = new FastDataView(buffer1);
    var view2 = new BufferDataView(buffer2);

    for (var i = 0; i < byteLength;) {
        if (view1.getUint8(i) !== view2.getUint8(i)) {
            console.log("read FAILED ", i);
            return;
        };
        console.log(view1.getUint8(i));
        i += 1;
        if (view1.getInt8(i) !== view2.getInt8(i)) {
            console.log("read FAILED ", i);
            return;
        };
        console.log(view1.getInt8(i));
        i += 1;
        if (view1.getUint16(i) !== view2.getUint16(i)) {
            console.log("read FAILED ", i);
            return;
        };
        console.log(view1.getUint16(i));
        i += 2;
        if (view1.getInt16(i) !== view2.getInt16(i)) {
            console.log("read FAILED ", i);
            return;
        };
        console.log(view1.getInt16(i));
        i += 2;
        if (view1.getUint32(i) !== view2.getUint32(i)) {
            console.log("read FAILED ", i);
            return;
        };
        console.log(view1.getUint32(i));
        i += 4;
        if (view1.getInt32(i) !== view2.getInt32(i)) {
            console.log("read FAILED ", i);
            return;
        };
        console.log(view1.getInt32(i));
        i += 4;
        if (view1.getFloat32(i) !== view2.getFloat32(i)) {
            console.log("read FAILED ", i);
            return;
        };
        console.log(view1.getFloat32(i));
        i += 4;
        if (view1.getFloat64(i) !== view2.getFloat64(i)) {
            console.log("read FAILED ", i);
            return;
        };
        console.log(view1.getFloat64(i));
        i += 8;
    }

    console.log("==== read OK. ====");

}

console.log("==== performance (x" + testCount + ") ====");

var buffer1 = testWrite(bufferSize, true);
testRead(buffer1, true);

var buffer2 = testWrite(bufferSize);
testRead(buffer2);

verify(buffer1, buffer2);
