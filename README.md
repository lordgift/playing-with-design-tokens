# playing-with-design-tokens
Try to use design tokens from designer then generate for development.


This example code initialize from style-dictionary basic. I focus to use on iOS, Android development. If you have the style-dictionary module installed globally, you can `cd` into this directory and run:
```bash
style-dictionary build
```

## Config file
├── config.json


## Token structure supporting

### Color
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

### Font Size
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
