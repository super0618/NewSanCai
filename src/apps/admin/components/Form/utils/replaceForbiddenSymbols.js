export default function (string) {
    return string.replace(/[\\/:.?&=#+%@_]/g, '').trim().replace(/\s+/g, '-');
}
