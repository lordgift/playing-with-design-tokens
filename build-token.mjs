import StyleDictionary from 'style-dictionary';
import fs from 'fs-extra';

import designTokenJson from '/Users/gift/Documents/scgprojects/design-tokens-sync/tokens.json' assert { type: "json" };;

// 📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝
function tokensToMultifiles() {
    let keys = Object.keys(designTokenJson);
    keys.forEach( tokenGroup => {
        let file = `tokens-multi-files/${tokenGroup}.json`;
        fs.ensureFileSync(file);
        fs.writeJsonSync(file, designTokenJson[tokenGroup], {spaces: 4});
    });
}

if (process.argv.length < 3) {
    console.info(`\x1b[1;31mExtraction mode disabled.`);
} else {
    process.argv.filter(arg => arg == "-e" || arg == "--extract" ).forEach( aa => {
        console.info(`\x1b[1;32mExtraction mode enabled.`);
        tokensToMultifiles();
    });

    process.argv.filter(arg => arg == "-h" || arg == "--help" ).forEach( aa => {
        console.info(`\x1b[0m\t -e, --extract \tto enable extraction mode.
             \t\tfor extract single json file that exported from Token Studio into directory-based.`);
        console.info(`\x1b[0m\t -h, --help \tprint command line options.`);
        process.exit(0);
    });
}
// 📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝📝


// Generate Android dimens for sizes in dp unit. (for avoid unknown 16 multiplication ??)
StyleDictionary.registerFormat({
    name: 'android/Colors+',
    format: ({ dictionary }) => {

        console.info("\x1b[0m\nformatting 'android/Colors+'...");
        // console.debug(dictionary);

        // console.error(rgba2argbHex("rgba(255, 255, 255, 0.08)"));
        // console.error(hex("0.08"));

        var contents = "";
        let newline = "\n\t";
        dictionary.allTokens
            .filter(token => token.type === 'color')
            .forEach(token => {

                let tokenName = token.name;
                let tokenValue = token.value;
                
                // tokenValue is hex e.g.#112233
                if (tokenValue.startsWith("#")) {
                    let lineOfCode = `<color name="${tokenName}">${tokenValue}</color>`;
                    contents += lineOfCode + newline;
                    console.info(`\x1b[1;33mappending case 1: ${tokenName}: \x1b[1;37m${tokenValue} \x1b[1;33minto \x1b[1;37m${lineOfCode}`);
                }

                // tokenValue is rgba e.g.rgba(255, 255, 255, 0.08)
                else if (tokenValue.match(/rgba\((\d+),\s?(\d+),\s?(\d+),\s?(.+)\)/g)) {
                    let lineOfCode = `<color name="${tokenName}">#${rgba2argbHex(tokenValue)}</color>`;
                    contents += lineOfCode + newline;
                    console.info(`\x1b[1;33mappending case 2: ${tokenName}: \x1b[1;37m${tokenValue} \x1b[1;33minto \x1b[1;37m${lineOfCode}`);
                }
                
                // tokenValue is FUCKING RGBA e.g.rgba( #ff020202, 0.32)
                else if (tokenValue.startsWith("rgba") && tokenValue.includes("#")) {
                    let alpha = tokenValue.replace(/rgba\(\s?#(.{2})(.{2})(.{2})(.{2}),\s?(.+)\)/g, `$5`); 
                    let hexAlpha = hex(alpha)
                    let hexRGB = tokenValue.replace(/rgba\(\s?#(.{2})(.{2})(.{2})(.{2}),\s?(.+)\)/g, `$2$3$4`);

                    let lineOfCode = `<color name="${tokenName}">#${hexAlpha + hexRGB}</color>`;
                    contents += lineOfCode + newline;
                    console.info(`\x1b[1;33mappending case 3: ${tokenName}: \x1b[1;37m${tokenValue} \x1b[1;33minto \x1b[1;37m${lineOfCode}`);
                } 
                
                else {
                    console.error(`Mismatch pattern for token ${tokenName} = ${tokenValue}`);
                }

            });


        return `<?xml version="1.0" encoding="UTF-8"?>
<!--
  Customized based-on StyleDictionary

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
    format: ({ dictionary }) => {

        console.info("\x1b[0m\nformatting 'android/Dimens+'...");

        var contents = "";
        let newline = "\n\t";
        dictionary.allTokens
            .filter(token => token.type === 'sizing' || token.type === 'borderRadius' || token.type === 'spacing')
            .forEach(token => {
                let tokenValueNoUnit = token.value.replaceAll(/(px|dp)/g, "");
                let lineOfCode = `<dimens name="${token.name}">${tokenValueNoUnit}dp</dimens>`;
                contents += lineOfCode + newline;
                console.info(`\x1b[1;33mappending: ${token.name}: \x1b[1;37m${token.value} \x1b[1;33minto \x1b[1;37m${lineOfCode}`);
            });


        return `<?xml version="1.0" encoding="UTF-8"?>
<!--
  Customized based-on StyleDictionary

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
    format: ({ dictionary }) => {

        console.info("\x1b[0m\nformatting 'android/FontDimens+'...");

        var contents = "";
        let newline = "\n\t";
        dictionary.allTokens
            .filter(token => token.type === 'fontSizes' )
            .forEach(token => {
                let tokenValueNoUnit = token.value.replaceAll(/(px|dp)/g, "");
                let lineOfCode = `<dimens name="${token.name}">${tokenValueNoUnit}sp</dimens>`;
                contents += lineOfCode + newline;
                console.info(`\x1b[1;33mappending: ${token.name}: \x1b[1;37m${token.value} \x1b[1;33minto \x1b[1;37m${lineOfCode}`);
            });


        return `<?xml version="1.0" encoding="UTF-8"?>
<!--
  Customized based-on StyleDictionary

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
    format: ({ dictionary }) => {

        console.info("\x1b[0m\nformatting 'ios-swift/Colors+'...");

        var classContents = "";
        //Generate xcassets
        const assetsDir = 'build/ios-swift/StyleDictionaryColorSet.xcassets';
        dictionary.allTokens
            .filter(token => token.type === 'color')
            .forEach(token => {

                // console.info(token);

                const folder = `${assetsDir}/${token.name}.colorset`;
                const file = `${folder}/Contents.json`;
                const contents = {
                    colors: [
                        {
                            "color" : {
                                'color-space': "srgb",
                                components: extractToComponents(token)
                            },
                            idiom: "universal"
                        }
                    ]
                };
                // create the directory if it doesn't exist
                fs.ensureDirSync(folder);
                // create the Contents.json file
                fs.writeFileSync(file, JSON.stringify(contents, null, 2));

                classContents += `static var ${token.name}: Color { Color("${token.name}")}\n\t`
                console.info(`\x1b[1;33m✔︎ ${file}`);
            });
        return `//
//  Customized based-on StyleDictionary
//
//  Do not edit directly
//  Generated by LordGift on ${Date()}
//
import SwiftUI

extension ShapeStyle where Self == Color {
    ${classContents}
}`;

    }
});


// Generate iOS dimens for sizes. (for avoid unknown 16 multiplication ??)
StyleDictionary.registerFormat
StyleDictionary.registerFormat({
    name: 'ios-swift/Sizes+',
    format: ({ dictionary }) => {

        console.info("\x1b[0m\nformatting 'ios-swift/Sizes+'...");

        var classContents = "";
        let newline = "\n\t"
        dictionary.allTokens
            .filter(token => token.type === 'sizing' || token.type === 'borderRadius' || token.type === 'spacing')
            .forEach(token => {
                var tokenValueNoUnit = token.value.replaceAll(/px/g, "");
                let lineOfCode = `static var ${token.name}: Double = ${tokenValueNoUnit}`
                classContents += lineOfCode + newline
                console.info(`\x1b[1;33mappending: ${token.name}: \x1b[1;37m${token.value} \x1b[1;33minto \x1b[1;37m${lineOfCode}`);
            });


        return `//
//  Customized based-on StyleDictionary
//
//  Do not edit directly
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
    format: ({ dictionary }) => {

        console.info("\x1b[0m\nformatting 'ios-swift/FontSizes+'...");

        var classContents = "";
        let newline = "\n\t"
        dictionary.allTokens
            .filter(token => token.type === 'fontSizes' )
            .forEach(token => {
                var tokenValue = token.value.replaceAll(/px/g, "");
                let lineOfCode = `static var ${token.name}: Double = ${tokenValue}`
                classContents += lineOfCode + newline
                console.info(`\x1b[1;33mappending: ${token.name}: \x1b[1;37m${token.value} \x1b[1;33minto \x1b[1;37m${lineOfCode}`);
            });


        return `//
//  Customized based-on StyleDictionary
//
//  Do not edit directly
//  Generated by LordGift on ${Date()}
//
import SwiftUI

extension Double {
    ${classContents}
}`;

    }
});


/* 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥 */

console.info(`\x1b[0m🔥 Generating you Design Token (*.json) into usable source code........`);

const sd = new StyleDictionary('./config.json');
await sd.hasInitialized;

const sdExtended = await sd.extend({
    source: ["tokens-multi-files/**/*.json"]
});

await sdExtended.cleanAllPlatforms();
await sdExtended.buildAllPlatforms();
/* 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥 */


function extractToComponents(token) {
    let tokenName = token.name;
    let tokenValue = token.value;

    try {
        var jsonComponents = "";

        // tokenValue is hex e.g.#112233
        if (tokenValue.startsWith("#")) {
            var crappyJSON = `{ "alpha" : "1.000", "red" : "0x${tokenValue.substring(1,3)}", "green" : "0x${tokenValue.substring(3,5)}", "blue" : "0x${tokenValue.substring(5,7)}" }`; 
            jsonComponents = JSON.parse(crappyJSON); 
            console.info(`\x1b[1;33mgenerating case 1: ${tokenName}: \x1b[1;37m${tokenValue} \x1b[1;33minto \x1b[1;37m${crappyJSON}`);
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
            console.info(`\x1b[1;33mgenerating case 2: ${tokenName}: \x1b[1;37m${tokenValue} \x1b[1;33minto \x1b[1;37m${appendedQuot}`);
/* 
  "components": {
    "red": 0.823,
    "green": 0.890,
    "blue": 0.210,
    "alpha": 1
   }
*/
        } 

        // tokenValue is rgba e.g.rgba(41, 51, 43, 0.12)
        else if (tokenValue.match(/rgba\((\d+),\s?(\d+),\s?(\d+),\s?(.+)\)/g)) {
            var jsonRGBA = tokenValue.replace(/rgba\((\d+),\s?(\d+),\s?(\d+),\s?(.+)\)/g, `{"red": "$1", "blue": "$2", "green": "$3", "alpha": "$4"}`); 
            jsonComponents = JSON.parse(jsonRGBA); 
            console.info(`\x1b[1;33mgenerating case 3: ${tokenName}: \x1b[1;37m${tokenValue} \x1b[1;33minto \x1b[1;37m${jsonRGBA}`);
/* 
  "components": {
    "red": "41",
    "blue": "51",
    "green": "43",
    "alpha": "0.12"
   }
*/
        } 

        // tokenValue is FUCKING RGBA e.g.rgba( UIColor(red: 0.004, green: 0.275, blue: 0.447, alpha: 1), 0.16)
        else if (tokenValue.startsWith("rgba") && tokenValue.includes("UIColor")) {
            var jsonRGBA = tokenValue.replace(/rgba\(\s?UIColor\(red:\s?(.+),\s?green:\s?(.+),\s?blue:\s?(.+),\s?alpha:\s?(.+)\),\s?(.+)\)/g, `{"red": "$1", "blue": "$3", "green": "$2", "alpha": "$5"}`); 
            jsonComponents = JSON.parse(jsonRGBA); 
            console.info(`\x1b[1;33mgenerating case 4: ${tokenName}: \x1b[1;37m${tokenValue} \x1b[1;33minto \x1b[1;37m${jsonRGBA}`);
/* 
  "components": {
    "red": "0.004",
    "blue": "0.447",
    "green": "0.275",
    "alpha": "0.16"
   }
*/
        } 

        else {
            console.error(`Mismatch pattern for token ${tokenName} = ${tokenValue}`);
        }
        
        return jsonComponents;
    } catch (e) {
        console.error(e);
        return ""
    }
    
}

//rgba(0, 0, 0, 0.74) => bc000000
function rgba2argbHex(orig) {
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
        a = "01";
    }
    // multiply before convert to HEX
    a = ((a * 255) | 1 << 8).toString(16).slice(1)
    hex = a + hex;

    return hex;
}

function hex(floatingPoint) {    
    var hex2digit = ((floatingPoint * 255) | 1 << 8).toString(16).slice(1)
    return hex2digit;
}