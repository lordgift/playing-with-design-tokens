const StyleDictionary = require('style-dictionary');


// Generate iOS Enum color in #colorLiteral
StyleDictionary.registerFormat({
    name: 'ios-swift/enum.swift',
    formatter: function ({ dictionary }) {
        
        return `import UIKit

public enum StyleDictionaryEnum {
  ${dictionary.allTokens.map(function (token) {
            // console.debug(token);
            var colorLiteral = token.value.replace(/UIColor/, "#colorLiteral")
            return `public static let ${token.name} = ${colorLiteral}`;
        }).join('\n  ')}
}`;
    }
});




const StyleDictionaryExtended = StyleDictionary.extend(__dirname + '/config.json');
StyleDictionaryExtended.buildAllPlatforms();

