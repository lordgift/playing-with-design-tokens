const StyleDictionary = require('style-dictionary');
const fs = require('fs-extra');



// Generate iOS Enum color in #colorLiteral


// Generate Android dimens for sizes in dp unit. (for avoid unknown 16 multiplication ??)
StyleDictionary.registerFormat({
    name: 'android/colors+original',
    formatter: ({ dictionary }) => {


        var contents = "";
        dictionary.allProperties
            .filter(token => token.type === 'color')
            .forEach(token => {

                //TODO: convert RGBA to HEX

                //console.log(token);
                // token.original.value
                contents += `<color name="${token.name}">${token.value}</color>\n    `;
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
    name: 'android/dimens+original',
    formatter: ({ dictionary }) => {


        var contents = "";
        dictionary.allProperties
            .filter(token => token.type === 'sizing' || token.type === 'borderRadius' || token.type === 'spacing')
            .forEach(token => {


                //TODO: DO NOT convert anything

                //TODO: seperated dp / sp

                //TODO: add unit into value

                //console.log(token);
                // token.original.value
                
              /// const regexp = /(\d+)(dp)/g.exec(token.value);
               /// const matches = token.value.matchAll(regexp);


                // token.value.matches.r
                // matches.

                contents += `<dimens name="${token.name}">${token.value}</dimens>\n    `;
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
    name: 'ios-swift/Color+.swift',
    formatter: ({ dictionary }) => {


        //Generate xcassets
        const assetsDir = 'build/ios-swift/ColorSet.xcassets';
        dictionary.allProperties
            .filter(token => token.attributes.category === 'color')
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
            });


            // return `import UIKit

            // public enum StyleDictionaryEnum {
            //   ${dictionary.allTokens.map(function (token) {
            //             // console.debug(token);
            //             var colorLiteral = token.value.replace(/UIColor/, "#colorLiteral")
            //             return `public static let ${token.name} = ${colorLiteral}`;
            //         }).join('\n  ')}
            
            //     }`;
        return `
//
//  Colors+.swift
//  Customized for StyleDictionary
//
//  Generated by LordGift on ${Date()}
//
import SwiftUI

extension ShapeStyle where Self == Color {
    ${dictionary.allTokens.map(function (token) {
        return `static var ${token.name}: Color { Color("${token.name}")}`
    }).join('\n\t')}
}`;



    }
});


const StyleDictionaryExtended = StyleDictionary.extend(__dirname + '/config.json');
StyleDictionaryExtended.buildAllPlatforms();


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
            var fixedJSON = cleaupSwift.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2": '); 
            jsonComponents = JSON.parse(fixedJSON); 
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
            console.error("Mismatch pattern for tokenValue.");
        }
        
        return jsonComponents;
    } catch (e) {
        console.error(e);
        return ""
    }
    
}
