import crypto from "node:crypto";

const DEFAULT_CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function randomStringGenerator(
  length: number = 6,
  chars: string = DEFAULT_CHARACTERS,
) {
  let result = "";
  const characters = chars;
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export function convertFromSlug(slug: string) {
  const words = slug.split("-");

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    words[i] = word.charAt(0).toUpperCase() + word.slice(1);
  }

  return words.join(" ");
}

export function createHash(value: string, options: Record<string, any> = {}) {
  return crypto
    .createHash("sha256")
    .update(value + JSON.stringify(options))
    .digest("hex");
}
