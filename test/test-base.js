var FastDataView = require("../src/FastDataView");

var byteLength = 64;
var buffer = new ArrayBuffer(byteLength);
var view = new FastDataView(buffer);
for (var i = 0; i < byteLength; i++) {
    view.setUint8(i, i);
}

var viewPart = new FastDataView(buffer, Math.floor(byteLength / 3), 10000);
console.log('viewPart.byteOffset : ', viewPart.byteOffset);
console.log('viewPart.byteLength : ', viewPart.byteLength);

console.log('======== viewPart [0, 10) ========')
for (var i = 0; i < 10; i++) {
    console.log(viewPart.nextUint8());
}
console.log('======== viewPart.getRest ========')
var b = viewPart.getRest();
console.log(b.join(', '));
