const StyleDictionary = require('style-dictionary');
const fs = require('fs-extra');



// Generate iOS Enum color in #colorLiteral
StyleDictionary.registerFormat({
    name: 'ios-swift/Color+.swift',
    formatter: ({ dictionary }) => {


        //Generate xcassets
        const assetsDir = 'build/ios-swift/ColorSet.xcassets';
        dictionary.allProperties
            .filter(token => token.attributes.category === 'color')
            .forEach(token => {
                const folder = `${assetsDir}/${token.name}.colorset`;
                const file = `${folder}/Contents.json`;
                const contents = {
                    colors: [
                        {
                            "color" : {
                                'color-space': "srgb",
                                components: uiColorToJson(token.value)
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
//  Generated by LordGift on 21/9/2566 BE.
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



function uiColorToJson(uiColor) {
    // let uiColor = "UIColor(red: 0.823, green: 0.890, blue: 0.210, alpha: 1)";
    var cleaupSwift = uiColor.replace(/UIColor\(/, "{").replace(/\)/, "}")

    // var crappyJSON = '{ somePropertyWithoutQuotes: "theValue!"  }'; 
    var fixedJSON = cleaupSwift.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2": '); 
    var json = JSON.parse(fixedJSON); 

    return json;
}
