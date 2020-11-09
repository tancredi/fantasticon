export enum FontAssetType {
  EOT = 'eot',
  WOFF2 = 'woff2',
  WOFF = 'woff',
  TTF = 'ttf',
  SVG = 'svg'
}

export enum OtherAssetType {
  CSS = 'css',
  SCSS = 'scss',
  SASS = 'sass',
  HTML = 'html',
  JSON = 'json',
  TS = 'ts'
}

export const ASSET_TYPES = {
  ...FontAssetType,
  ...OtherAssetType
};

export type AssetType = FontAssetType | OtherAssetType;

// Asset types which support a custom template
export type AssetWithTemplateType =
  | OtherAssetType.CSS
  | OtherAssetType.SASS
  | OtherAssetType.SCSS
  | OtherAssetType.HTML;
