var FastDataView = FastDataView || require("../src/FastDataView");

var testCount = 1000;

var bufferSize = 26;
var KB = 1024;

var littleEndian = false;

var args = process.argv.slice(2);
if (args[0] === 'little' || args[0] === 'l') {
    littleEndian = true;
    console.log('\n ALL TESTS USE : littleEndian \n');
} else {
    console.log('\n ALL TESTS USE : bigEndian \n');
}

var types = [
    'Uint8',
    'Int8',
    'Uint16',
    'Int16',
    'Uint32',
    'Int32',
    'Float32',
    'Float64',
];

function saveTestDataToView(view, littleEndian) {
    var byteLength = view.byteLength;
    for (var i = 0; i < byteLength;) {
        view.setUint8(i, 255, littleEndian);
        i += 1;
        view.setInt8(i, 127, littleEndian);
        i += 1;
        view.setUint16(i, 65535, littleEndian);
        i += 2;
        view.setInt16(i, 32767, littleEndian);
        i += 2;
        view.setUint32(i, 4294967295, littleEndian);
        i += 4;
        view.setInt32(i, 2147483647, littleEndian);
        i += 4;
        view.setFloat32(i, 1.625, littleEndian);
        i += 4;
        view.setFloat64(i, Math.E, littleEndian);
        i += 8;
    }
}

function loadTestDataFromView(view, littleEndian) {
    var byteLength = view.byteLength;
    var result = [];
    for (var i = 0; i < byteLength;) {
        result.push(view.getUint8(i, littleEndian));
        i += 1;
        result.push(view.getInt8(i, littleEndian));
        i += 1;
        result.push(view.getUint16(i, littleEndian));
        i += 2;
        result.push(view.getInt16(i, littleEndian));
        i += 2;
        result.push(view.getUint32(i, littleEndian));
        i += 4;
        result.push(view.getInt32(i, littleEndian));
        i += 4;
        result.push(view.getFloat32(i, littleEndian));
        i += 4;
        result.push(view.getFloat64(i, littleEndian));
        i += 8;
    }
    return result;
}

function testWrite(fast, littleEndian) {
    var buffer = new ArrayBuffer(bufferSize * KB);
    var DataViewClass = fast ? FastDataView : DataView;
    var name = fast ? 'FastDataView' : 'DataView';

    var view = new DataViewClass(buffer);
    console.time(name + ' wirte');
    for (var c = 0; c < testCount; c++) {
        saveTestDataToView(view, littleEndian);
    }
    console.timeEnd(name + ' wirte');
    return buffer;
}

function testRead(buffer, fast, littleEndian) {
    var byteLength = buffer.byteLength;
    var DataViewClass = fast ? FastDataView : DataView;
    var name = fast ? 'FastDataView' : 'DataView';

    var view = new DataViewClass(buffer);
    console.time(name + ' read');
    for (var c = 0; c < testCount; c++) {
        loadTestDataFromView(view, littleEndian);
    }
    console.timeEnd(name + ' read');
    return buffer;
}


function verify(littleEndian) {
    var byteLength = bufferSize;

    var buffer1 = new ArrayBuffer(byteLength);
    var view1 = new DataView(buffer1);

    var buffer2 = new ArrayBuffer(byteLength);
    var view2 = new FastDataView(buffer2);

    saveTestDataToView(view1, littleEndian);
    saveTestDataToView(view2, littleEndian);

    // var byteLength = buffer1.byteLength;

    var byteArray1 = new Uint8Array(buffer1);
    var byteArray2 = new Uint8Array(buffer2);

    var ok = true;
    for (var i = 0; i < byteLength; i++) {
        if (byteArray1[i] !== byteArray2[i]) {
            ok = false;
            console.log("wirte FAILED ( " + i + " ) : ", byteArray1[i], byteArray2[i]);
        }
    }

    if (ok) {
        console.log("  >>> wirte OK <<<");
    }

    var view1 = new FastDataView(buffer1);
    var view2 = new DataView(buffer1);

    var result1 = loadTestDataFromView(view1, littleEndian);
    var result2 = loadTestDataFromView(view2, littleEndian);

    var ok = true;
    result1.forEach(function(num1, idx) {
        var num2 = result2[idx];
        var type = types[idx];
        if (num1 !== num2) {
            ok = false;
            console.log('read FAILED ( ' + type + ' ) : ', num1, num2);
        } else {
            console.log('read ( ' + type + ' ) : ', num1);
        }
    });
    if (ok) {
        console.log("  >>> read OK <<<");
    }
    // var view2 = new FastDataView(buffer);
}

function verifyTypedArray(littleEndian) {
    var testValue = [
        1, 15, 16, 255, 256, 65535, 65536, 0xABCDABCD
    ];
    var typedMethod = [
        'setUint8',
        'setInt8',
        'setUint16',
        'setInt16',
        'setUint32',
        'setInt32',
        'setFloat32',
        'setFloat64',
    ];

    var cacheBuffer = new ArrayBuffer(8);
    var byteArray = new Uint8Array(cacheBuffer);
    var TypedArrays = {
        uint8Array: new Uint8Array(cacheBuffer),
        int8Array: new Int8Array(cacheBuffer),
        uint16Array: new Uint16Array(cacheBuffer),
        int16Array: new Int16Array(cacheBuffer),
        uint32Array: new Uint32Array(cacheBuffer),
        int32Array: new Int32Array(cacheBuffer),
        float32Array: new Float32Array(cacheBuffer),
        float64Array: new Float64Array(cacheBuffer),
    }

    var result = [
        [],
        []
    ];
    var views = [
        new DataView(cacheBuffer),
        new FastDataView(cacheBuffer),
    ];
    views.forEach(function(view, idx) {
        testValue.forEach(function(value) {
            byteArray.fill(0);
            typedMethod.forEach(function(method) {
                view[method](0, value, littleEndian);
                for (var name in TypedArrays) {
                    var array = TypedArrays[name];
                    result[idx].push([array[0], method, name, value])
                }
            });
        });
    });
    var result1 = result[0];
    var result2 = result[0];

    var ok = true;
    result1.forEach(function(r1, idx) {
        var num1 = r1[0];
        var method = r1[1];
        var name = r1[2];
        var value = r1[3];

        var r2 = result2[idx];
        var num2 = r2[0];

        if (num1 !== num2 && !isNaN(num1) && !isNaN(num2)) {
            ok = false;
            console.log('TypedArray FAILED (', method, name, value, ') : ', num1, num2);
        }
    });
    if (ok) {
        console.log("  >>> TypedArray OK <<<");
    }
}

setTimeout(function() {
    console.log("==== performance (", bufferSize + 'KB * ' + testCount + ") ====");

    var bufferFast = testWrite(true, littleEndian);
    testRead(bufferFast, true, littleEndian);

    setTimeout(function() {
        var buffer = testWrite(false, littleEndian);
        testRead(buffer, false, littleEndian);

        setTimeout(function() {

            console.log("==== verify with DataView ====");
            verify(littleEndian);

            console.log("==== verify with TypedArray ====");
            verifyTypedArray(littleEndian)

        }, 100);

    }, 100);

}, 100);

