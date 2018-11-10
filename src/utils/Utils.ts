export * from "./Pool";
export * from "./LimitedPool";

export module utils{
    export function shuffle(a) {
        var len = a.length;
        for (var i = 0; i < len; i++) {
            var index = Math.floor(Math.random() * (len - i));
            var temp = a[index];
            a[index] = a[len - i - 1];
            a[len - i - 1] = temp;
        }
    }

    export function shuffleClone(array,target?) {
        var len = array.length;
        var b = target?target:[];
        for (var i = 0; i < len; i++) {
            b[i] = array[i];
        }
        for (var i = 0; i < len - 1; i++) {
            var index = Math.floor(Math.random() * (len - i));
            var temp = b[index];
            b[index] = b[len - i - 1];
            b[len - i - 1] = temp;
        }
        return b;
    }
}
