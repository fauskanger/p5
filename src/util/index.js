import * as M from "mathjs";

export const to2dec = value => typeof value === "undefined" ? '': M.format(value, {notation: 'fixed', precision: 2});

export const toNdec = (value, n=2) => typeof value === "undefined" ? '': M.format(value, {notation: 'fixed', precision: n});