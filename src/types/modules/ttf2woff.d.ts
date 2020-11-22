declare module 'ttf2woff' {
  function ttf2woff(
    ttf: Uint8Array,
    options?: {
      /**
       * Woff Extended Metadata Block
       *
       * See https://www.w3.org/TR/WOFF/#Metadata
       */
      metadata?: string;
    }
  ): Buffer;
  export default ttf2woff;
}
