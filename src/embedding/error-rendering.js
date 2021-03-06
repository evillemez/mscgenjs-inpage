/* istanbul ignore next */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["../utl/tpl"], function(tpl) {
    "use strict";

    var TPL_ERR_LINENO = "<pre><div style='color: #d00'># ERROR on line {line}, column {col} - {message}</div>";
    var TPL_ERR = "<pre><div style='color: #d00'># ERROR {message}</div>";
    var TPL_MARKED_LINE = "<mark>{line}\n</mark>";
    var TPL_UNDERLINED_CHAR = "<span style='text-decoration:underline'>{char}</span>";
    /**
     * Given a Number, emits a String with that number in, left padded so the
     * string is pMaxWidth long. If the number doesn't fit within pMaxWidth
     * characters, just returns a String with that number in it
     *
     * @param {number} pNumber
     * @param {number} pMaxWidth
     * @return {string} - the formatted number
     */
    function formatNumber(pNumber, pMaxWidth) {
        var lRetval = pNumber.toString();
        var lPosLeft = pMaxWidth - lRetval.length;
        for (var i = 0; i < lPosLeft; i++) {
            lRetval = " " + lRetval;
        }
        return lRetval;
    }

    function formatLine(pLine, pLineNo){
        return formatNumber(pLineNo, 3) + " " + pLine;
    }

    function underlineCol(pLine, pCol){
        return pLine.split("").reduce(function(pPrev, pChar, pIndex){
            if (pIndex === pCol) {
                return pPrev + tpl.applyTemplate(
                    TPL_UNDERLINED_CHAR, {char: deHTMLize(pChar)}
                );
            }
            return pPrev + deHTMLize(pChar);
        }, "");
    }

    /**
     * returns a 'sanitized' version of the passed
     * string. Sanitization is <em>very barebones</em> at the moment
     * - it replaces < by &lt; so the browser won't start interpreting it
     * as html. I'd rather use something standard for this, but haven't
     * found it yet...
     */
    function deHTMLize(pString){
        return pString.replace(/</g, "&lt;");
    }

    return {
        formatNumber: formatNumber,
        deHTMLize: deHTMLize,
        renderError: function renderError(pSource, pErrorLocation, pMessage){
            var lErrorIntro = Boolean(pErrorLocation)
                ? tpl.applyTemplate(
                    TPL_ERR_LINENO, {
                        message: pMessage,
                        line: pErrorLocation.start.line,
                        col: pErrorLocation.start.column
                    })
                : tpl.applyTemplate(
                    TPL_ERR, {
                        message: pMessage
                    }
                );

            return pSource.split('\n').reduce(function(pPrev, pLine, pIndex) {
                if (!!pErrorLocation && pIndex === (pErrorLocation.start.line - 1)) {
                    return pPrev + tpl.applyTemplate(
                        TPL_MARKED_LINE, {
                            line:formatLine(underlineCol(pLine, pErrorLocation.start.column - 1), pIndex + 1)
                        }
                    );
                }
                return pPrev + deHTMLize(formatLine(pLine, pIndex + 1)) + '\n';
            }, lErrorIntro) + "</pre>";
        }
    };
});
/*
 This file is part of mscgen_js.

 mscgen_js is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 mscgen_js is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with mscgen_js.  If not, see <http://www.gnu.org/licenses/>.
 */
