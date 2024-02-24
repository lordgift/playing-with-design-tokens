const StyleDictionary = require('style-dictionary');
const fs = require('fs-extra');


// StyleDictionary.transform(
    
// )

// module.exports = {
//     // matcher: (token) => typeof token.value === "string" && token.value.indexOf("px") !== -1,
//     transformer: (token, option) => {
//       // leverage multi-brand multi-platform build file to pass in `option.scale`
//       token.value = token.value * 0;
//       console.debug("👀👀👀👀👀👀👀👀👀👀👀👀👀👀👀👀");
  
//       return styleDictionary.transform["android/dimens"].transformer(token, options);
//     },
//   };


// StyleDictionary.registerTransform({
//     name: 'unitless/dp-sp',
//     type: 'value',
//     matcher: function(prop) {
//         return prop.group === 'typography' || prop.group === 'spacing';
//     },
//     transformer: function(prop) {
//         // in Android font sizes are expressed in "sp" units
//         let unit = (prop.group === 'typography') ? 'sp' : 'dp';
//         return `${prop.value}${unit}`;
//     }
// });


// StyleDictionary.registerTransformGroup({
//     name: 'custom/android',
//     // as you can see, here we are completely ignoring the "attribute/cti" transform (it's totally possible),
//     // because we are relying on custom attributes for the matchers and the custom format for the output
//     transforms: ["attribute/cti"]
// });

// StyleDictionary.registerTransform({
//     name: 'android/ext',
//     type: 'value',
//     matcher: function (token) {
//       return token.attributes.category === 'size';
//     },
//     transformer: function (token) {
//       return token.original.value; //(parseInt(token.original.value) / 1000).toString() + 's';
//     },
//   });
  


// Generate Android dimens for sizes in dp unit. (for avoid unknown 16 multiplication ??)
StyleDictionary.registerFormat({
    name: 'android/Colors+',
    formatter: ({ dictionary }) => {


        var contents = "";
        dictionary.allProperties
            .filter(token => token.type === 'color')
            .forEach(token => {

                let tokenValue = token.value
                if (tokenValue.startsWith("#")) {
                    contents += `<color name="${token.name}">${tokenValue}</color>\n    `;
                }
                // tokenValue is rgba e.g.rgba(255, 255, 255, 0.08)
                else if (tokenValue.startsWith("rgba")) {
                    contents += `<color name="${token.name}">#${rgba2hex(tokenValue)}</color>\n    `;
                }
            });


        return `
<?xml version="1.0" encoding="UTF-8"?>

<!--
  Do not edit directly
  Generated by LordGift on ${Date()}
-->
<resources>
    ${contents}
</resources>
        `;

    }
});



// Generate Android dimens for sizes in dp unit. (for avoid unknown 16 multiplication ??)
StyleDictionary.registerFormat({
    name: 'android/Dimens+',
    formatter: ({ dictionary }) => {


        var contents = "";
        dictionary.allProperties
            .filter(token => token.type === 'sizing' || token.type === 'borderRadius' || token.type === 'spacing')
            .forEach(token => {
                contents += `<dimens name="${token.name}">${token.value}dp</dimens>\n    `;
            });


        return `
<?xml version="1.0" encoding="UTF-8"?>

<!--
  Do not edit directly
  Generated by LordGift on ${Date()}
-->
<resources>
    ${contents}
</resources>
        `;

    }
});


// Generate Android dimens for sizes in dp unit. (for avoid unknown 16 multiplication ??)
StyleDictionary.registerFormat({
    name: 'android/FontDimens+',
    formatter: ({ dictionary }) => {


        var contents = "";
        dictionary.allProperties
            .filter(token => token.type === 'fontSizes' || token.type === 'typography')
            .forEach(token => {
                contents += `<dimens name="${token.name}">${token.value}sp</dimens>\n    `;
            });


        return `
<?xml version="1.0" encoding="UTF-8"?>

<!--
  Do not edit directly
  Generated by LordGift on ${Date()}
-->
<resources>
    ${contents}
</resources>
        `;

    }
});


// Generate iOS Enum colors with xcassets.
StyleDictionary.registerFormat({
    name: 'ios-swift/Colors+',
    formatter: ({ dictionary }) => {

        var classContents = "";

        //Generate xcassets
        const assetsDir = 'build/ios-swift/ColorSet.xcassets';
        dictionary.allProperties
            .filter(token => token.type === 'color')
            .forEach(token => {

                // console.log(token);

                const folder = `${assetsDir}/${token.name}.colorset`;
                const file = `${folder}/Contents.json`;
                const contents = {
                    colors: [
                        {
                            "color" : {
                                'color-space': "srgb",
                                components: extractToComponents(token.value)
                            },
                            idiom: "universal"
                        }
                    ]
                };
                // create the directory if it doesn't exist
                fs.ensureDirSync(folder);
                // create the Contents.json file
                fs.writeFileSync(file, JSON.stringify(contents, null, 2));

                console.warn(`\x1b[1;33m✔︎ ${file}`);

                classContents += `static var ${token.name}: Color { Color("${token.name}")}\n\t`
            });
        return `
//
//  Colors+.swift
//  Customized for StyleDictionary
//
//  Generated by LordGift on ${Date()}
//
import SwiftUI

extension ShapeStyle where Self == Color {
    ${classContents}
}`;

    }
});


// Generate iOS dimens for sizes. (for avoid unknown 16 multiplication ??)
StyleDictionary.registerFormat({
    name: 'ios-swift/Sizes+',
    formatter: ({ dictionary }) => {


        var classContents = "";
        dictionary.allProperties
            .filter(token => token.type === 'sizing' || token.type === 'borderRadius' || token.type === 'spacing')
            .forEach(token => {
                classContents += `static var ${token.name}: Double = ${token.value} \n\t`
            });


        return `
//
//  StyleDictionarySize+.swift
//  Customized for StyleDictionary
//
//  Generated by LordGift on ${Date()}
//
import SwiftUI

extension Double {
    ${classContents}
}`;

    }
});

// Generate iOS dimens for sizes. (for avoid unknown 16 multiplication ??)
StyleDictionary.registerFormat({
    name: 'ios-swift/FontSizes+',
    formatter: ({ dictionary }) => {


        var classContents = "";
        dictionary.allProperties
            .filter(token => token.type === 'fontSizes' || token.type === 'typography')
            .forEach(token => {
                classContents += `static var ${token.name}: Double = ${token.value} \n\t`
            });


        return `
//
//  StyleDictionaryFontSize+.swift
//  Customized for StyleDictionary
//
//  Generated by LordGift on ${Date()}
//
import SwiftUI

extension Double {
    ${classContents}
}`;

    }
});


/* 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥 */
const StyleDictionaryExtended = StyleDictionary.extend(__dirname + '/config.json');
StyleDictionaryExtended.buildAllPlatforms();
/* 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥 */


function extractToComponents(tokenValue) {
    try {
        
        // console.debug(tokenValue);

        var jsonComponents = "";

        // tokenValue is hex e.g.#112233
        if (tokenValue.startsWith("#")) {
            var crappyJSON = `{ "alpha" : "1.000", "red" : "0x${tokenValue.substring(1,3)}", "green" : "0x${tokenValue.substring(3,5)}", "blue" : "0x${tokenValue.substring(5,7)}" }`; 
            jsonComponents = JSON.parse(crappyJSON); 
/* 
  "components": {
    "alpha": "1.000",
    "red": "0xff",
    "green": "0xff",
    "blue": "0xff"
   }
*/
        }

        // tokenValue is UIColor e.g.UIColor(red: 0.823, green: 0.890, blue: 0.210, alpha: 1)
        else if (tokenValue.startsWith("UIColor")) {
            var cleaupSwift = tokenValue.replace(/UIColor\(/, "{").replace(/\)/, "}")
            var appendedQuot = cleaupSwift.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2": '); 
            jsonComponents = JSON.parse(appendedQuot); 
/* 
  "components": {
    "red": 0.004,
    "green": 0.275,
    "blue": 0.447,
    "alpha": 1
   }
*/
        } 

        // tokenValue is rgba e.g.rgba(255, 255, 255, 0.08)
        else if (tokenValue.startsWith("rgba")) {
            var jsonRGBA = tokenValue.replace(/rgba\((\d+),\W?(\d+),\W?(\d+),\W?(\d+.\d+)\)/g, `{"red": "$1", "blue": "$2", "green": "$3", "alpha": "$4"}`); 
            jsonComponents = JSON.parse(jsonRGBA); 
/* 
  "components": {
    "red": 0.004,
    "green": 0.275,
    "blue": 0.447,
    "alpha": 1
   }
*/
        } 

        else {
            console.error(`Mismatch pattern for tokenValue = ${tokenValue}`);
        }
        
        return jsonComponents;
    } catch (e) {
        console.error(e);
        return ""
    }
    
}

//rgba(0, 0, 0, 0.74) => 000000bc
function rgba2hex(orig) {
    var a, isPercent,
        rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i),
        alpha = (rgb && rgb[4] || "").trim(),
        hex = rgb ?
        (rgb[1] | 1 << 8).toString(16).slice(1) +
        (rgb[2] | 1 << 8).toString(16).slice(1) +
        (rgb[3] | 1 << 8).toString(16).slice(1) : orig;

    if (alpha !== "") {
        a = alpha;
    } else {
        a = 01;
    }
    // multiply before convert to HEX
    a = ((a * 255) | 1 << 8).toString(16).slice(1)
    hex = hex + a;

    return hex;
}