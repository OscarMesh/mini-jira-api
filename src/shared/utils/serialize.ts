import omit from 'omit-deep-lodash';

export function excludeFields(obj: any, ...fields: string[]) {
  return omit(obj, ...fields);
}
