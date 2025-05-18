import _ from "lodash";

export const reduceToObject = (arg: any[], value: any, init = {}) => {
  return arg.reduce((acc, k) => {
    return { ...acc, [k]: acc[k] || value };
  }, init);
};

export const convertArrayStringsToNestedObject = (
  args: any,
  value,
  delimitter = "select",
) => {
  return _.transform(
    _.mapValues(_.keyBy(args), () => value),
    function (transformed, val, key) {
      const obj = _.set(
        transformed,
        key.replaceAll(".", `.${delimitter}.`),
        val,
      );
      return obj;
    },
  );
};

export function isObject(x: any) {
  return typeof x === "object" && !Array.isArray(x) && x !== null;
}

export const getSeason = (d) => {
  const index = Math.floor((d.getMonth() / 12) * 4) % 4;
  return ["Summer", "Autumn", "Winter", "Spring"][index]?.toUpperCase();
};
