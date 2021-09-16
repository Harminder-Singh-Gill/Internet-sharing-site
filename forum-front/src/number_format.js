const THOUSAND = 1000;
const MILLION = THOUSAND*THOUSAND;
const BILLION = THOUSAND*MILLION;

export const shortify = (num) => {
    const abs_num = Math.abs(num);
    if (abs_num >= BILLION) {
        return (num / BILLION).toFixed(1) + 'B';
    }
    if (abs_num >= MILLION) {
        return (num / MILLION).toFixed(1) + 'M';
    }
    if (abs_num >= THOUSAND) {
        return (num / THOUSAND).toFixed(1) + 'K';
    }
    return num
}

export const pluralize = (num, noun) => {

    if (num === 1) { return noun;}

    if (noun.endsWith("y")) {
        return noun.slice(0, noun.length-1) + "ies";
    }

    return noun + 's';
}