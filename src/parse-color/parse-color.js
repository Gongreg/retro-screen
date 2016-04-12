export default function parseColor(color) {
    if (typeof color === 'number') {
        //make sure our hexadecimal number is padded out
        color = '#' + ('00000' + (color | 0).toString(16)).substr(-6);
    }

    return color;
}
