# playing-with-design-tokens
Try to use design tokens from designer then generate for development.


This example code initialize from style-dictionary basic. I focus to use on iOS, Android development. If you have the style-dictionary module installed globally, you can `cd` into this directory and run:
```bash
style-dictionary build
```

### Config file
├── config.json


### Token structure supporting

#### Color
```json
{
  "color": {
    "base": {
      "gray": {
        "light" : { "value": "#CCCCCC" },
        "medium": { "value": "#999999" },
        "dark"  : { "value": "#111111" }
      },
      "red": { "value": "#FF0000" },
      "green": { "value": "#00FF00" }
    }
  }
}
```

#### Font Size
```json
{
  "size": {
    "font": {
      "small" : {
        "value": "0.75",
        "comment": "the small size of the font"
      },
      "medium": {
        "value": "1",
        "comment": "the medium size of the font"
      },
      "large" : {
        "value": "2",
        "comment": "the large size of the font"
      },
      "base"  : {
        "value": "{size.font.medium.value}",
        "comment": "the base size of the font"
      }
    }
  }
}

```


---
## Customization

I got many problem with basic generator. I have to customize into my style.

- Json token pattern required.
- Size multiply by 16.
- I need to generate color in Color Assets.

All above problem can be solved by using following my customize format. You can build style-dictionary including with expansion by only execute this command.

```bash
node build.js
```

Don't forget to check your `config.json`

- android/Colors+
- android/Dimens+
- android/FontDimens+
- ios-swift/Colors+
- ios-swift/Sizes+
- ios-swift/FontSizes+

---

`ColorSet.xcassets` is for XCode, you can preview your colors in GUI.

### Generated Output 

![colorassets-example](https://github.com/lordgift/playing-with-design-tokens/assets/1191403/e6aa4c81-b012-4fdc-9643-817eaaf97f51)


I also have an extension for point to ColorAssets for easier to use in your development.

```swift
//
//  Colors+.swift
//  Customized for StyleDictionary
//
//  Generated by LordGift on 21/9/2566 BE.
//
import SwiftUI

extension ShapeStyle where Self == Color {
	static var baseGrayLight: Color { Color("baseGrayLight")}
	static var baseGrayMedium: Color { Color("baseGrayMedium")}
	static var baseGrayDark: Color { Color("baseGrayDark")}
	static var baseRed: Color { Color("baseRed")}
	static var baseGreen: Color { Color("baseGreen")}
	static var fontBase: Color { Color("fontBase")}
	static var fontSecondary: Color { Color("fontSecondary")}
	static var fontTertiary: Color { Color("fontTertiary")}
}
```

---

For further customization, if you need to advance customize for support as you wish. You have to implement javascript following with [docs](https://amzn.github.io/style-dictionary/#/formats?id=custom-format-with-output-references).

---

